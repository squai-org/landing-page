/**
 * Model provider factory.
 *
 * The agent uses OmniRoute (https://github.com/diegosouzapw/OmniRoute) as its
 * sole real backend. OmniRoute is a local, OpenAI-compatible AI gateway that
 * fans a single endpoint out over 270+ upstream LLM providers (Claude / GPT /
 * Gemini / DeepSeek / Kimi / …), with auto-fallback, quota-aware routing and
 * token compression baked in.
 *
 * Selection:
 *   AI_PROVIDER=mock                  → MockProvider (offline, deterministic)
 *   AI_PROVIDER=omniroute (or unset)  → OmniRouteProvider if OMNIROUTE_API_KEY
 *                                        is set, otherwise MockProvider
 *
 * The rest of the agent is provider-agnostic, so tests, eval and dev keep
 * working without any keys.
 */
import type { ModelProvider } from "../types.js";
import { OmniRouteProvider } from "./omniroute.js";
import { MockProvider } from "./mock.js";

export type ProviderName = "omniroute" | "mock";

export function createProvider(): ModelProvider {
  const requested = (process.env.AI_PROVIDER || "").toLowerCase();
  const omniKey = process.env.OMNIROUTE_API_KEY;

  if (requested === "mock") return new MockProvider();
  if (requested === "omniroute") {
    return omniKey ? new OmniRouteProvider(omniKey) : new MockProvider();
  }

  // Default: use OmniRoute when a key is configured, else the deterministic mock.
  return omniKey ? new OmniRouteProvider(omniKey) : new MockProvider();
}

export { OmniRouteProvider, MockProvider };
