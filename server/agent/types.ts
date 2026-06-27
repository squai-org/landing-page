/** Shared types for the chat agent: messages, tools, providers, and SSE events. */
import type { AgentLang } from "./context/page-content-extractor.js";

export type ChatRole = "user" | "assistant" | "system" | "tool";

export interface ChatMessage {
  role: ChatRole;
  content: string;
  /** Present on assistant messages that requested tool calls. */
  toolCalls?: ToolCall[];
  /** Present on tool messages: which call this result answers. */
  toolCallId?: string;
  /** Present on tool messages: the tool that produced the result. */
  name?: string;
}

export interface ToolCall {
  id: string;
  name: string;
  /** Parsed JSON arguments. */
  arguments: Record<string, unknown>;
}

/** JSON-Schema-shaped parameter definition for a tool. */
export interface ToolParameterSchema {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
}

export interface ToolSchema {
  name: string;
  description: string;
  parameters: ToolParameterSchema;
}

export interface ToolDefinition<T = Record<string, unknown>> {
  schema: ToolSchema;
  /** Executes the tool and returns a JSON-serializable result. */
  execute: (args: T, ctx: ToolContext) => Promise<unknown>;
}

export interface ToolContext {
  lang: AgentLang;
}

/** What a model provider returns for a single turn of the ReAct loop. */
export interface ModelResponse {
  /** Final assistant text, if the model chose to answer. */
  text?: string;
  /** Tool calls the model wants to run, if any. */
  toolCalls?: ToolCall[];
}

export interface GenerateInput {
  system: string;
  messages: ChatMessage[];
  tools: ToolSchema[];
}

/** Uniform interface every provider (google, ollama, mock) implements. */
export interface ModelProvider {
  readonly name: string;
  generate(input: GenerateInput): Promise<ModelResponse>;
}

/** Server-sent event payloads streamed to the browser. */
export type AgentEvent =
  | { type: "token"; value: string }
  | { type: "tool_call"; name: string; arguments: Record<string, unknown> }
  | { type: "availability"; slots: AvailabilitySlot[] }
  | { type: "blocked"; reason: string }
  | { type: "done"; message: string }
  | { type: "error"; message: string };

export interface AvailabilitySlot {
  /** ISO datetime string. */
  iso: string;
  /** YYYY-MM-DD date key. */
  date: string;
  /** Localized human label, e.g. "Mon, Jul 7 · 9:30 AM". */
  label: string;
}
