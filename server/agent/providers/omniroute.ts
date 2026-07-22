/**
 * OmniRoute provider — the sole model backend.
 *
 * OmniRoute (https://github.com/diegosouzapw/OmniRoute) is a local, OpenAI-
 * compatible AI gateway that proxies 270+ providers behind a single endpoint.
 * We treat it as a plain OpenAI Chat Completions API:
 *
 *   POST {OMNIROUTE_BASE_URL}/chat/completions
 *   Authorization: Bearer {OMNIROUTE_API_KEY}
 *
 * Environment:
 *   OMNIROUTE_BASE_URL   default: http://localhost:20128/v1
 *   OMNIROUTE_API_KEY    required for real usage; falls back to MockProvider if absent
 *   OMNIROUTE_MODEL      default: auto  (OmniRoute's zero-config smart routing)
 */
import type {
  ChatMessage,
  GenerateInput,
  ModelProvider,
  ModelResponse,
  ToolCall,
  ToolSchema,
} from "../types.js";

const DEFAULT_BASE = "http://localhost:20128/v1";
const DEFAULT_MODEL = "auto";
const REQUEST_TIMEOUT_MS = 30_000;

interface OpenAIToolCall {
  id?: string;
  type?: "function";
  function: { name: string; arguments: string | Record<string, unknown> };
}

interface OpenAIMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  name?: string;
  tool_call_id?: string;
  tool_calls?: OpenAIToolCall[];
}

function toOpenAIMessages(system: string, messages: ChatMessage[]): OpenAIMessage[] {
  const out: OpenAIMessage[] = [{ role: "system", content: system }];
  for (const m of messages) {
    if (m.role === "assistant") {
      out.push({
        role: "assistant",
        content: m.content ?? "",
        tool_calls: m.toolCalls?.map((tc) => ({
          id: tc.id,
          type: "function",
          function: { name: tc.name, arguments: JSON.stringify(tc.arguments ?? {}) },
        })),
      });
    } else if (m.role === "tool") {
      out.push({
        role: "tool",
        content: m.content,
        name: m.name,
        tool_call_id: m.toolCallId,
      });
    } else if (m.role === "user") {
      out.push({ role: "user", content: m.content });
    } else if (m.role === "system") {
      out.push({ role: "system", content: m.content });
    }
  }
  return out;
}

function toOpenAITools(tools: ToolSchema[]) {
  return tools.map((t) => ({
    type: "function" as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters,
    },
  }));
}

function safeParse(s: string): Record<string, unknown> {
  try {
    return JSON.parse(s) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export class OmniRouteProvider implements ModelProvider {
  readonly name = "omniroute";
  private readonly base: string;
  private readonly model: string;
  private readonly apiKey?: string;

  constructor(
    apiKey = process.env.OMNIROUTE_API_KEY,
    base = process.env.OMNIROUTE_BASE_URL || DEFAULT_BASE,
    model = process.env.OMNIROUTE_MODEL || DEFAULT_MODEL,
  ) {
    this.apiKey = apiKey;
    this.base = base.replace(/\/$/, "");
    this.model = model;
  }

  async generate(input: GenerateInput): Promise<ModelResponse> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (this.apiKey) headers.Authorization = `Bearer ${this.apiKey}`;

    const res = await fetch(`${this.base}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: this.model,
        messages: toOpenAIMessages(input.system, input.messages),
        tools: input.tools.length ? toOpenAITools(input.tools) : undefined,
        tool_choice: input.tools.length ? "auto" : undefined,
        temperature: 0.5,
        max_tokens: 400,
        stream: false,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!res.ok) {
      throw new Error(`OmniRoute API error ${res.status}: ${await res.text()}`);
    }

    const data = (await res.json()) as {
      choices?: { message?: OpenAIMessage }[];
    };
    const message = data.choices?.[0]?.message;

    const toolCalls: ToolCall[] = (message?.tool_calls ?? []).map((tc, i) => ({
      id: tc.id ?? `call_${tc.function.name}_${i}`,
      name: tc.function.name,
      arguments:
        typeof tc.function.arguments === "string"
          ? safeParse(tc.function.arguments)
          : (tc.function.arguments ?? {}),
    }));

    const text = typeof message?.content === "string" ? message.content : "";

    return toolCalls.length
      ? { toolCalls, text: text || undefined }
      : { text };
  }
}
