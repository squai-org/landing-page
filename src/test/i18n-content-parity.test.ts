import { describe, it, expect } from "vitest";
import { content } from "@/lib/content";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOnlyLangKeys(obj: Record<string, unknown>): boolean {
  const keys = Object.keys(obj);
  return keys.length > 0 && keys.every((key) => key === "en" || key === "es");
}

function collectParityErrors(value: unknown, path: string, errors: string[]): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      collectParityErrors(item, `${path}[${index}]`, errors);
    });
    return;
  }

  if (!isPlainObject(value)) {
    return;
  }

  if (hasOnlyLangKeys(value)) {
    const ownKeys = Object.keys(value);
    const hasEn = ownKeys.includes("en");
    const hasEs = ownKeys.includes("es");

    if (!hasEn || !hasEs) {
      errors.push(`${path} must include both en and es keys`);
      return;
    }

    const enValue = value.en;
    const esValue = value.es;

    const enKind = Array.isArray(enValue) ? "array" : typeof enValue;
    const esKind = Array.isArray(esValue) ? "array" : typeof esValue;

    if (enKind !== esKind) {
      errors.push(`${path} has mismatched en/es value types (${enKind} vs ${esKind})`);
    }
  }

  for (const [key, nested] of Object.entries(value)) {
    collectParityErrors(nested, `${path}.${key}`, errors);
  }
}

describe("content i18n parity", () => {
  it("keeps en/es parity for localized entries", () => {
    const errors: string[] = [];
    collectParityErrors(content, "content", errors);

    expect(errors).toEqual([]);
  });
});
