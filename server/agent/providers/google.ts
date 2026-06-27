/**
 * Google Gemini provider (REST, no SDK dependency).
 *
 * Uses the Generative Language API `generateContent` endpoint with function
 * calling. Activated when GOOGLE_AI_API_KEY is set and AI_PROVIDER=google.
 */
import type {
  ChatMessage,
  GenerateInput,
  ModelProvider,
  ModelResponse,
  ToolCall,
  ToolSchema,
} from "../types.js";

const DEFAULT_MODEL = "gemini-2.5-flash";
const BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const REQUEST_TIMEOUT_MS = 20_000;

interface GeminiPart {
  text?: string;
  functionCall?: { name: string; args?: Record<string, unknown> };
  functionResponse?: { name: string; response: Record<string, unknown> };
}
interface GeminiContent {
  role: "user" | "model";
  parts: GeminiPart[];
}

function toGeminiContents(messages: ChatMessage[]): GeminiContent[] {
  const contents: GeminiContent[] = [];
  for (const m of messages) {
    if (m.role === "user") {
      contents.push({ role: "user", parts: [{ text: m.content }] });
    } else if (m.role === "assistant") {
      const parts: GeminiPart[] = [];
      if (m.content) parts.push({ text: m.content });
      for (const tc of m.toolCalls ?? []) {
        parts.push({ functionCall: { name: tc.name, args: tc.arguments } });
      }
      contents.push({ role: "model", parts: parts.length ? parts : [{ text: "" }] });
    } else if (m.role === "tool") {
      let response: Record<string, unknown>;
      try {
        response = JSON.parse(m.content) as Record<string, unknown>;
      } catch {
        response = { result: m.content };
      }
      contents.push({
        role: "user",
        parts: [{ functionResponse: { name: m.name ?? "tool", response } }],
      });
    }
  }
  return contents;
}

function toGeminiTools(tools: ToolSchema[]) {
  return [
    {
      functionDeclarations: tools.map((t) => ({
        name: t.name,
        description: t.description,
        parameters: t.parameters,
      })),
    },
  ];
}

export class GoogleProvider implements ModelProvider {
  readonly name = "google";
  private readonly apiKey: string;
  private readonly model: string;

  constructor(apiKey: string, model = process.env.GOOGLE_AI_MODEL || DEFAULT_MODEL) {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generate(input: GenerateInput): Promise<ModelResponse> {
    const url = `${BASE}/${this.model}:generateContent?key=${this.apiKey}`;
    const body = {
      systemInstruction: { parts: [{ text: input.system }] },
      contents: toGeminiContents(input.messages),
      tools: input.tools.length ? toGeminiTools(input.tools) : undefined,
      generationConfig: { temperature: 0.5, maxOutputTokens: 400 },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!res.ok) {
      throw new Error(`Gemini API error ${res.status}: ${await res.text()}`);
    }

    const data = (await res.json()) as {
      candidates?: { content?: { parts?: GeminiPart[] } }[];
    };
    const parts = data.candidates?.[0]?.content?.parts ?? [];

    const toolCalls: ToolCall[] = [];
    let text = "";
    parts.forEach((p, i) => {
      if (p.text) text += p.text;
      if (p.functionCall) {
        toolCalls.push({
          id: `call_${p.functionCall.name}_${i}`,
          name: p.functionCall.name,
          arguments: p.functionCall.args ?? {},
        });
      }
    });

    return toolCalls.length ? { toolCalls, text: text || undefined } : { text };
  }
}
