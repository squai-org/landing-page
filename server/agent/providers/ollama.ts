/**
 * Ollama Cloud provider (REST).
 *
 * Uses the OpenAI-style `/api/chat` endpoint with tool calling. Activated when
 * AI_PROVIDER=ollama. OLLAMA_BASE_URL defaults to Ollama Cloud; OLLAMA_API_KEY is
 * sent as a bearer token when present.
 */
import type {
  ChatMessage,
  GenerateInput,
  ModelProvider,
  ModelResponse,
  ToolCall,
  ToolSchema,
} from "../types.js";

const DEFAULT_BASE = "https://ollama.com";
const DEFAULT_MODEL = "gpt-oss:20b";
const REQUEST_TIMEOUT_MS = 20_000;

interface OllamaToolCall {
  function: { name: string; arguments: Record<string, unknown> | string };
}
interface OllamaMessage {
  role: string;
  content: string;
  tool_calls?: OllamaToolCall[];
  tool_name?: string;
}

function toOllamaMessages(system: string, messages: ChatMessage[]): OllamaMessage[] {
  const out: OllamaMessage[] = [{ role: "system", content: system }];
  for (const m of messages) {
    if (m.role === "assistant") {
      out.push({
        role: "assistant",
        content: m.content ?? "",
        tool_calls: m.toolCalls?.map((tc) => ({
          function: { name: tc.name, arguments: tc.arguments },
        })),
      });
    } else if (m.role === "tool") {
      out.push({ role: "tool", content: m.content, tool_name: m.name });
    } else {
      out.push({ role: m.role, content: m.content });
    }
  }
  return out;
}

function toOllamaTools(tools: ToolSchema[]) {
  return tools.map((t) => ({
    type: "function" as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters,
    },
  }));
}

export class OllamaProvider implements ModelProvider {
  readonly name = "ollama";
  private readonly base: string;
  private readonly model: string;
  private readonly apiKey?: string;

  constructor(
    apiKey = process.env.OLLAMA_API_KEY,
    base = process.env.OLLAMA_BASE_URL || DEFAULT_BASE,
    model = process.env.OLLAMA_MODEL || DEFAULT_MODEL,
  ) {
    this.apiKey = apiKey;
    this.base = base.replace(/\/$/, "");
    this.model = model;
  }

  async generate(input: GenerateInput): Promise<ModelResponse> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (this.apiKey) headers.Authorization = `Bearer ${this.apiKey}`;

    const res = await fetch(`${this.base}/api/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: this.model,
        messages: toOllamaMessages(input.system, input.messages),
        tools: input.tools.length ? toOllamaTools(input.tools) : undefined,
        stream: false,
        // Match the Google provider's response budget so replies aren't truncated
        // differently depending on which provider is active.
        options: { temperature: 0.5, num_predict: 400 },
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!res.ok) {
      throw new Error(`Ollama API error ${res.status}: ${await res.text()}`);
    }

    const data = (await res.json()) as { message?: OllamaMessage };
    const message = data.message;
    const toolCalls: ToolCall[] = (message?.tool_calls ?? []).map((tc, i) => ({
      id: `call_${tc.function.name}_${i}`,
      name: tc.function.name,
      arguments:
        typeof tc.function.arguments === "string"
          ? safeParse(tc.function.arguments)
          : tc.function.arguments,
    }));

    return toolCalls.length
      ? { toolCalls, text: message?.content || undefined }
      : { text: message?.content ?? "" };
  }
}

function safeParse(s: string): Record<string, unknown> {
  try {
    return JSON.parse(s) as Record<string, unknown>;
  } catch {
    return {};
  }
}
