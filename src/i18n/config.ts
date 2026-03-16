import type { Lang } from "@/i18n/types";

/** All supported language codes. */
export const SUPPORTED_LANGS: readonly Lang[] = ["en", "es"];

/** Maps language codes to Open Graph locale identifiers. */
export const OG_LOCALE_BY_LANG: Record<Lang, string> = {
  en: "en_US",
  es: "es_419",
};

export const DEFAULT_LANG: Lang = "en";

/** Type guard that checks if a string is a valid {@link Lang}. */
export function isLang(value: string | undefined): value is Lang {
  return value === "en" || value === "es";
}

/** Returns the alternate language (en ↔ es). */
export function getAltLang(lang: Lang): Lang {
  return lang === "en" ? "es" : "en";
}
