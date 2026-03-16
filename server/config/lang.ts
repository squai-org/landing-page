export type SupportedLang = "en" | "es";

const DEFAULT_LANG: SupportedLang = "en";

/** Normalizes an unknown value to a {@link SupportedLang}, defaulting to `"en"`. */
export function normalizeLang(value: unknown): SupportedLang {
  return value === "es" ? "es" : DEFAULT_LANG;
}
