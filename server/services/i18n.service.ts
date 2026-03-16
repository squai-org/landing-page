import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { SupportedLang } from "../config/lang.js";
import type { TranslationData } from "../types/index.js";

const cache = new Map<SupportedLang, TranslationData>();

function getLocalesDir(): string {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  return resolve(currentDir, "..", "..", "i18n", "locales");
}

/** Loads and caches a JSON translation file for the given language. */
export function loadTranslation(lang: SupportedLang): TranslationData {
  const cached = cache.get(lang);
  if (cached) return cached;

  const filePath = resolve(getLocalesDir(), `${lang}.json`);
  const data = JSON.parse(readFileSync(filePath, "utf-8")) as TranslationData;
  cache.set(lang, data);
  return data;
}

/** Replaces `{{key}}` placeholders in a template string with provided values. */
export function interpolate(
  template: string,
  vars: Record<string, string>,
): string {
  return template.replaceAll(
    /\{\{(\w+)\}\}/g,
    (_, key: string) => vars[key] ?? "",
  );
}
