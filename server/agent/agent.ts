/**
 * Agent core — a stateless ReAct loop.
 *
 * Runs the injection guard first, then alternates model "reason" steps with tool
 * "act" steps (max 5 iterations) until the model produces a final answer, which
 * is streamed token-by-token as server-sent events. The server keeps no
 * conversation state: the full message history is supplied per request and
 * clamped to the most recent 20 messages.
 */
import { buildSystemPrompt } from "./prompts/system.js";
import { createProvider } from "./providers/index.js";
import { TOOLS, getToolSchemas } from "./tools/index.js";
import { detectInjection, safeRefusal } from "./security/injection-guard.js";
import type { AgentLang } from "./context/page-content-extractor.js";
import type { AgentEvent, AvailabilitySlot, ChatMessage } from "./types.js";

const MAX_ITERATIONS = 5;
const MAX_HISTORY = 20;

/** User-facing fallback copy, localized. Raw provider errors are never shown. */
const FALLBACKS = {
  en: {
    error:
      'I hit a snag on my end. You can try again, or book your call manually right here on the page using the "Book Your Free Call" button.',
    clarify: "Happy to help — could you tell me a bit more about what you're after?",
    exhausted:
      "Let's keep this simple — want me to book you a free 30-minute call so we can dig into your case directly?",
  },
  es: {
    error:
      'Tuve un problema por mi lado. Puedes intentarlo de nuevo, o agendar tu llamada manualmente aquí en la página con el botón "Agenda tu llamada gratis".',
    clarify: "Con gusto te ayudo. ¿Me cuentas un poco más sobre lo que buscas?",
    exhausted:
      "Hagámoslo simple: ¿quieres que te agende una llamada gratis de 30 minutos para revisar tu caso?",
  },
} as const;

export interface RunAgentInput {
  messages: ChatMessage[];
  lang?: AgentLang;
}

function lastUserContent(messages: ChatMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i].content ?? "";
  }
  return "";
}

/**
 * Removes markdown so replies render as clean plain text (the UI shows raw text).
 * Safety net in case the model ignores the "plain text only" instruction.
 */
function stripMarkdown(s: string): string {
  return s
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * True only when the visitor's MOST RECENT message is a concrete slot pick (ISO).
 * Scoped to the latest turn so the picker is hidden right after a pick, but can
 * reappear later if the agent legitimately re-fetches slots (e.g. after a booking
 * failure where the chosen slot was taken).
 */
function justPickedSlot(messages: ChatMessage[]): boolean {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") {
      return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(messages[i].content);
    }
  }
  return false;
}

function* streamText(text: string): Generator<AgentEvent> {
  // Stream in word-sized chunks so the UI renders progressively regardless of
  // whether the underlying provider streams natively.
  const tokens = text.match(/\S+\s*/g) ?? [text];
  for (const value of tokens) {
    yield { type: "token", value };
  }
}

/** Drives the agent and yields a stream of events for the API to serialize. */
export async function* runAgent(
  input: RunAgentInput,
): AsyncGenerator<AgentEvent> {
  const lang: AgentLang = input.lang ?? "en";
  const userText = lastUserContent(input.messages);

  // 1) Security: block injection attempts before any model call.
  const guard = detectInjection(userText);
  if (guard.isInjection) {
    yield { type: "blocked", reason: guard.matchedPatterns.join(",") };
    const refusal = safeRefusal(lang);
    yield* streamText(refusal);
    yield { type: "done", message: refusal };
    return;
  }

  const provider = createProvider();
  const system = buildSystemPrompt(lang);
  const copy = FALLBACKS[lang] ?? FALLBACKS.en;
  const convo: ChatMessage[] = input.messages.slice(-MAX_HISTORY);
  const toolSchemas = getToolSchemas();
  // Don't re-show the picker on the turn right after the visitor picks a time.
  const suppressPicker = justPickedSlot(input.messages);

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    let response;
    try {
      response = await provider.generate({ system, messages: convo, tools: toolSchemas });
    } catch (err) {
      // Log the raw provider error server-side only; never surface it to the user.
      console.error("[agent] provider error:", err instanceof Error ? err.message : err);
      yield { type: "error", message: "provider_error" };
      yield* streamText(copy.error);
      yield { type: "done", message: copy.error };
      return;
    }

    if (response.toolCalls && response.toolCalls.length > 0) {
      convo.push({
        role: "assistant",
        content: response.text ?? "",
        toolCalls: response.toolCalls,
      });

      for (const call of response.toolCalls) {
        yield { type: "tool_call", name: call.name, arguments: call.arguments };
        const def = TOOLS[call.name];
        let result: unknown;
        if (!def) {
          result = { error: "unknown_tool", name: call.name };
        } else {
          try {
            result = await def.execute(call.arguments, { lang });
          } catch (err) {
            result = { error: "tool_failed", message: err instanceof Error ? err.message : "" };
          }
        }

        if (call.name === "get_availability" && !suppressPicker) {
          const slots = (result as { slots?: AvailabilitySlot[] })?.slots;
          if (Array.isArray(slots) && slots.length) {
            yield { type: "availability", slots };
          }
        }

        convo.push({
          role: "tool",
          name: call.name,
          toolCallId: call.id,
          content: JSON.stringify(result),
        });
      }
      continue; // let the model reason over the tool results
    }

    const finalText = stripMarkdown(response.text ?? "") || copy.clarify;
    yield* streamText(finalText);
    yield { type: "done", message: finalText };
    return;
  }

  // Iteration budget exhausted.
  yield* streamText(copy.exhausted);
  yield { type: "done", message: copy.exhausted };
}
