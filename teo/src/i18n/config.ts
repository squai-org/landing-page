import type { Lang } from "@/i18n/types";

export const SUPPORTED_LANGS: readonly Lang[] = ["es"];

export const OG_LOCALE_BY_LANG: Record<Lang, string> = {
  es: "es_CO",
};

export const DEFAULT_LANG: Lang = "es";

export function isLang(value: string | undefined): value is Lang {
  return value === "es";
}
