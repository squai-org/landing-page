/**
 * Chat agent route: POST /api/agent.
 *
 * Accepts { messages, sessionId } and streams the agent's response as
 * server-sent events. The server is stateless (history comes in the request),
 * IP rate limiting is applied globally in app.ts, and no API keys are ever
 * returned to the client.
 */
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { HttpStatus, ErrorCode } from "../config/constants.js";
import { createRateLimiter } from "../middleware/index.js";
import { runAgent } from "../agent/agent.js";
import { detectLangFromText, isLangCode } from "../agent/lang.js";
import type { AgentLang } from "../agent/context/page-content-extractor.js";
import type { ChatMessage } from "../agent/types.js";

export const agentRoutes = new Hono();

// Each agent call fans out to an LLM, so it's far costlier than the form routes.
// Give it its own, tighter budget on top of the global limiter.
const agentRateLimiter = createRateLimiter(8, 60_000);

interface IncomingMessage {
  role?: string;
  content?: unknown;
}
interface AgentRequestBody {
  messages?: IncomingMessage[];
  sessionId?: string;
  lang?: string;
  /** ISO datetime of a slot the user picked in the UI picker (not shown in chat). */
  selectedSlotIso?: string;
}

const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

const MAX_MESSAGES = 50;
const MAX_CONTENT = 4000;

function sanitizeMessages(raw: IncomingMessage[]): ChatMessage[] {
  return raw
    .filter(
      (m): m is { role: string; content: string } =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content.slice(0, MAX_CONTENT),
    }));
}

function detectLang(body: AgentRequestBody, messages: ChatMessage[]): AgentLang {
  if (isLangCode(body.lang)) return body.lang;
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  return detectLangFromText(lastUser?.content ?? "");
}

agentRoutes.post("/agent", agentRateLimiter, async (c) => {
  const body = (await c.req.json().catch(() => null)) as AgentRequestBody | null;

  if (!body || !Array.isArray(body.messages)) {
    return c.json(
      { error: ErrorCode.VALIDATION, message: "Expected { messages: [...] }" },
      HttpStatus.BAD_REQUEST,
    );
  }

  const messages = sanitizeMessages(body.messages);
  if (messages.length === 0) {
    return c.json(
      { error: ErrorCode.VALIDATION, message: "No valid messages provided" },
      HttpStatus.BAD_REQUEST,
    );
  }

  const lang = detectLang(body, messages);

  // If the user picked a slot in the UI, attach its ISO to their last message
  // server-side so the model can book it — without exposing the raw ISO in chat.
  if (body.selectedSlotIso && ISO_PATTERN.test(body.selectedSlotIso)) {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        messages[i] = {
          ...messages[i],
          content: `${messages[i].content}\n\n[selected slot: ${body.selectedSlotIso}]`,
        };
        break;
      }
    }
  }

  return streamSSE(c, async (stream) => {
    try {
      for await (const event of runAgent({ messages, lang })) {
        await stream.writeSSE({ data: JSON.stringify(event) });
      }
    } catch (err) {
      await stream.writeSSE({
        data: JSON.stringify({
          type: "error",
          message: err instanceof Error ? err.message : "stream_error",
        }),
      });
    }
  });
});
