import type { Lang } from "@/i18n/types";

export const SUPPORTED_LANGS: readonly Lang[] = ["en", "es"];

export const OG_LOCALE_BY_LANG: Record<Lang, string> = {
  en: "en_US",
  es: "es_419",
};

export const DEFAULT_LANG: Lang = "en";

export function isLang(value: string | undefined): value is Lang {
  return value === "en" || value === "es";
}

export function getAltLang(lang: Lang): Lang {
  return lang === "en" ? "es" : "en";
}
