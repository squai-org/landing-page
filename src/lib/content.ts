import type { Lang } from "@/i18n/types";
import en from "../../i18n/locales/en.json";
import es from "../../i18n/locales/es.json";

export type TranslationData = typeof en;

const translations: Record<Lang, TranslationData> = { en, es };

/** Returns the full translation object for the given language. */
export function t(lang: Lang): TranslationData {
  return translations[lang];
}

