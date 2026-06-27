/** Client-side chat types. Mirrors the server's SSE event contract. */
export type ChatRole = "user" | "assistant";

export interface AvailabilitySlot {
  iso: string;
  date: string;
  label: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  /** Slots surfaced by the agent for the visual picker, if any. */
  slots?: AvailabilitySlot[];
  /** True while this assistant message is still streaming. */
  pending?: boolean;
}

export type AgentEvent =
  | { type: "token"; value: string }
  | { type: "tool_call"; name: string; arguments: Record<string, unknown> }
  | { type: "availability"; slots: AvailabilitySlot[] }
  | { type: "blocked"; reason: string }
  | { type: "done"; message: string }
  | { type: "error"; message: string };
