import type { Lang } from "@/i18n/types";
import es from "../../i18n/locales/es.json";

export type TranslationData = typeof es;

const translations: Record<Lang, TranslationData> = { es };

/** Returns the full translation object for the given language. */
export function t(lang: Lang = "es"): TranslationData {
  return translations[lang];
}
