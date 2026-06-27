/** Shared language detection for the agent (route, eval, mock all use this). */
import type { AgentLang } from "./context/page-content-extractor.js";

/** Spanish-only characters; their presence is a strong signal the text is ES. */
const SPANISH_HINT = /[áéíóúñ¿¡]/i;

/** Narrows an arbitrary value to a supported language code. */
export function isLangCode(value: unknown): value is AgentLang {
  return value === "en" || value === "es";
}

/** Best-effort language guess from free text, defaulting to English. */
export function detectLangFromText(text: string): AgentLang {
  return SPANISH_HINT.test(text) ? "es" : "en";
}
