/**
 * Model provider factory.
 *
 * ── MODEL SELECTION (S1) ──────────────────────────────────────────────────────
 * Two providers are supported; the active one is chosen via the AI_PROVIDER env
 * var. Both picks were made against the criteria: native function calling, sub-2s
 * typical latency, a generous free tier, and >= 8k context.
 *
 *  • google → gemini-2.5-flash (default, configurable via GOOGLE_AI_MODEL)
 *      - Function calling: native (functionDeclarations).
 *      - Latency: Flash tier is Google's fast general model, ~1s.
 *      - Free tier: Google AI Studio free tier (per-minute/day request quota).
 *      - Context: 1M tokens (>> 8k).
 *      Chosen as the default for the best quality/latency/cost balance.
 *      (gemini-2.5-flash-lite is a lower-latency, higher-quota alternative.)
 *
 *  • ollama → gpt-oss:20b (default, configurable via OLLAMA_MODEL)
 *      - Function calling: supported (gpt-oss is tuned for tool use).
 *      - Latency: 20B open model served on Ollama Cloud, fast first token.
 *      - Free tier: available on Ollama Cloud (gpt-oss:120b also free; larger
 *        models like deepseek-v3.1 require a paid subscription).
 *      - Context: 128k (>> 8k).
 *      Provides a vendor-independent / self-hostable alternative.
 *
 *  • mock → deterministic offline fallback (no key, no network). Used for local
 *    dev, CI, and the eval harness so the system is reproducible without keys.
 *
 * Selection rules:
 *   AI_PROVIDER=google  → GoogleProvider  (requires GOOGLE_AI_API_KEY, else mock)
 *   AI_PROVIDER=ollama  → OllamaProvider
 *   AI_PROVIDER=mock    → MockProvider
 *   unset               → google if GOOGLE_AI_API_KEY present, otherwise mock
 * The agent loop is provider-agnostic, so switching is transparent.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import type { ModelProvider } from "../types.js";
import { GoogleProvider } from "./google.js";
import { OllamaProvider } from "./ollama.js";
import { MockProvider } from "./mock.js";

export type ProviderName = "google" | "ollama" | "mock";

export function createProvider(): ModelProvider {
  const requested = (process.env.AI_PROVIDER || "").toLowerCase();
  const googleKey = process.env.GOOGLE_AI_API_KEY;

  if (requested === "mock") return new MockProvider();
  if (requested === "ollama") return new OllamaProvider();
  if (requested === "google") {
    return googleKey ? new GoogleProvider(googleKey) : new MockProvider();
  }

  // Default: prefer Google when a key exists, else deterministic mock.
  return googleKey ? new GoogleProvider(googleKey) : new MockProvider();
}

export { GoogleProvider, OllamaProvider, MockProvider };
