/** Client-side chat types. Mirrors the server's SSE event contract. */
export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  /** True while this assistant message is still streaming. */
  pending?: boolean;
}

export type AgentEvent =
  | { type: "token"; value: string }
  | { type: "tool_call"; name: string; arguments: Record<string, unknown> }
  | { type: "scheduling_form" }
  | { type: "blocked"; reason: string }
  | { type: "done"; message: string }
  | { type: "error"; message: string };
