/**
 * Helpers shared by the availability + scheduling tools. Provides a deterministic
 * fallback when Google Calendar is not configured (e.g. local dev, CI, eval) so
 * the agent and its eval can run fully offline, and formats raw ISO slots into
 * the structured shape the UI slot picker consumes.
 */
import { INTL_LOCALE } from "../../config/constants.js";
import { BUSINESS_TZ, TIME_RANGES, SLOT_DURATION_MIN } from "../../config/env.js";
import type { AgentLang } from "../context/page-content-extractor.js";
import type { AvailabilitySlot } from "../types.js";

/** True when the calendar backend is wired up (a real calendar id exists). */
export function isCalendarConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CALENDAR_ID);
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toDateKey(d: Date): string {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/**
 * Generates a plausible set of open weekday slots without touching any external
 * service. Used when no calendar is configured. Deterministic given `from`.
 */
export function fallbackSlots(
  fromDateKey: string,
  businessDays = 5,
): Record<string, string[]> {
  const slots: Record<string, string[]> = {};
  const cursor = new Date(`${fromDateKey}T12:00:00Z`);
  let added = 0;
  // Walk forward day by day, skipping weekends, until we have N business days.
  for (let i = 0; i < 21 && added < businessDays; i++) {
    const day = cursor.getUTCDay();
    if (day !== 0 && day !== 6) {
      const key = toDateKey(cursor);
      const daySlots: string[] = [];
      for (const range of TIME_RANGES) {
        for (
          let m = range.startHour * 60;
          m + SLOT_DURATION_MIN <= range.endHour * 60;
          m += SLOT_DURATION_MIN
        ) {
          // Render as an offset-aware ISO using Bogota (-05:00, no DST).
          daySlots.push(`${key}T${pad(Math.floor(m / 60))}:${pad(m % 60)}:00-05:00`);
        }
      }
      slots[key] = daySlots.map((s) => new Date(s).toISOString());
      added++;
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return slots;
}

/** Flattens grouped slots into a capped, human-labeled list for the UI/model. */
export function formatSlots(
  grouped: Record<string, string[]>,
  lang: AgentLang,
  limit = 12,
): AvailabilitySlot[] {
  const locale = INTL_LOCALE[lang] ?? INTL_LOCALE.en;
  const formatter = new Intl.DateTimeFormat(locale, {
    timeZone: BUSINESS_TZ,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: lang === "en",
  });

  const out: AvailabilitySlot[] = [];
  for (const date of Object.keys(grouped).sort()) {
    for (const iso of grouped[date]) {
      out.push({ iso, date, label: formatter.format(new Date(iso)) });
      if (out.length >= limit) return out;
    }
  }
  return out;
}
