export type SupportedLang = "en" | "es";

const DEFAULT_LANG: SupportedLang = "en";

export function normalizeLang(value: unknown): SupportedLang {
  return value === "es" ? "es" : DEFAULT_LANG;
}
