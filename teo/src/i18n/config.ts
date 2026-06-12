import type { Lang } from "@/i18n/types";

/** All supported language codes. The Teo landing is Spanish-only. */
export const SUPPORTED_LANGS: readonly Lang[] = ["es"];

/** Maps language codes to Open Graph locale identifiers. */
export const OG_LOCALE_BY_LANG: Record<Lang, string> = {
  es: "es_CO",
};

export const DEFAULT_LANG: Lang = "es";

/** Type guard that checks if a string is a valid {@link Lang}. */
export function isLang(value: string | undefined): value is Lang {
  return value === "es";
}
