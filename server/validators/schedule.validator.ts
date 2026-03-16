import {
  BUSINESS_TZ,
  SLOT_DURATION_MIN,
  PREPARATION_BUFFER_MIN,
  TIME_RANGES,
  VALID_DAYS,
} from "../config/env.js";
import { normalizeLang } from "../config/lang.js";
import type { SupportedLang } from "../config/lang.js";
import { EMAIL_PATTERN, HTML_TAG_PATTERN, EVENT_ID_PATTERN, DATE_FORMAT_PATTERN } from "../config/constants.js";

function sanitize(str: string): string {
  return str.replaceAll(HTML_TAG_PATTERN, "").trim();
}

const dateParts = new Intl.DateTimeFormat("en", {
  timeZone: BUSINESS_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function toBusinessDate(d: Date): string {
  const p = Object.fromEntries(
    dateParts.formatToParts(d).map((x) => [x.type, x.value]),
  );
  return `${p.year}-${p.month}-${p.day}`;
}

function toBusinessTime(d: Date): { hour: number; minute: number } {
  const p = Object.fromEntries(
    dateParts.formatToParts(d).map((x) => [x.type, x.value]),
  );
  return { hour: Number(p.hour), minute: Number(p.minute) };
}

function getBusinessToday(): string {
  return toBusinessDate(new Date());
}

function getBusinessNowMinutes(): number {
  const { hour, minute } = toBusinessTime(new Date());
  return hour * 60 + minute;
}

function getBusinessOffset(): string {
  const now = new Date();
  const utcStr = now.toLocaleString("sv-SE", { timeZone: "UTC" });
  const bizStr = now.toLocaleString("sv-SE", { timeZone: BUSINESS_TZ });
  const diffMs = new Date(bizStr).getTime() - new Date(utcStr).getTime();
  const sign = diffMs >= 0 ? "+" : "-";
  const abs = Math.abs(diffMs);
  const h = String(Math.floor(abs / 3_600_000)).padStart(2, "0");
  const m = String(Math.floor((abs % 3_600_000) / 60_000)).padStart(2, "0");
  return `${sign}${h}:${m}`;
}

function isWeekday(dateStr: string): boolean {
  const offset = getBusinessOffset();
  const dow = new Date(`${dateStr}T12:00:00${offset}`).getUTCDay();
  return dow !== 0 && dow !== 6;
}

/** Parsed components of an ISO datetime in the business timezone. */
export interface ParsedDatetime {
  date: string;
  time: string;
  parsed: Date;
}

/** Parses an ISO datetime string into date, time, and Date components in the business timezone. */
export function parseDatetime(datetime: string): ParsedDatetime | null {
  const parsed = new Date(datetime);
  if (Number.isNaN(parsed.getTime())) return null;
  const date = toBusinessDate(parsed);
  const { hour, minute } = toBusinessTime(parsed);
  const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  return { date, time, parsed };
}

/** Validates that a datetime falls on a bookable weekday slot within business hours. Returns an error message or `null`. */
export function validateDatetime(datetime: string): string | null {
  const result = parseDatetime(datetime);
  if (!result) return "Invalid datetime";
  const { date, time } = result;

  const dateObj = new Date(`${date}T12:00:00`);
  const dayOfWeek = dateObj.getUTCDay();
  const isoDay = dayOfWeek === 0 ? 7 : dayOfWeek;
  if (!VALID_DAYS.has(isoDay)) return "Only weekdays are available";

  const todayStr = getBusinessToday();
  if (date < todayStr) return "Cannot schedule in the past";

  const [hourStr, minStr] = time.split(":");
  const hour = Number.parseInt(hourStr, 10);
  const min = Number.parseInt(minStr, 10);
  if (min % SLOT_DURATION_MIN !== 0) return "Invalid time slot";

  const totalMinutes = hour * 60 + min;
  const isValidSlot = TIME_RANGES.some(
    (r) =>
      totalMinutes >= r.startHour * 60 &&
      totalMinutes + SLOT_DURATION_MIN <= r.endHour * 60,
  );
  if (!isValidSlot) return "Time slot is outside available hours";

  if (
    date === todayStr &&
    totalMinutes < getBusinessNowMinutes() + PREPARATION_BUFFER_MIN
  ) {
    return "Time slot is no longer available";
  }

  return null;
}

/** Validated request body for POST /api/schedule. */
export interface ScheduleBody {
  name: string;
  company: string;
  email: string;
  description: string;
  datetime: string;
  timezone: string;
  lang: SupportedLang;
}

/** Validated request body for POST /api/reschedule. */
export interface RescheduleBody {
  eventId: string;
  email: string;
  datetime: string;
  lang: SupportedLang;
}

/** Discriminated union: holds either validated `data` or an `error` message. */
export type ValidationResult<T> = { data: T; error?: never } | { data?: never; error: string };

function extractScheduleFields(body: Record<string, unknown>) {
  return {
    name: typeof body.name === "string" ? sanitize(body.name) : "",
    company: typeof body.company === "string" ? sanitize(body.company) : "",
    email: typeof body.email === "string" ? body.email.trim() : "",
    description:
      typeof body.description === "string" ? sanitize(body.description) : "",
    datetime: typeof body.datetime === "string" ? body.datetime.trim() : "",
    timezone: typeof body.timezone === "string" ? body.timezone.trim() : "",
    lang: normalizeLang(body.lang),
  };
}

function validateScheduleFields(f: ReturnType<typeof extractScheduleFields>): string | null {
  if (!f.name) return "Name is required";
  if (f.name.length > 200) return "Name too long";
  if (!f.company) return "Company is required";
  if (f.company.length > 200) return "Company too long";
  if (!f.email || !EMAIL_PATTERN.test(f.email)) return "Valid email is required";
  if (f.description.length > 2000) return "Description too long";
  if (!f.datetime) return "Datetime is required";
  if (!f.timezone) return "Timezone is required";
  try {
    Intl.DateTimeFormat(undefined, { timeZone: f.timezone });
  } catch {
    return "Invalid timezone";
  }
  return null;
}

/** Validates and sanitizes the POST /api/schedule request body. */
export function validateScheduleBody(body: unknown): ValidationResult<ScheduleBody> {
  if (!body || typeof body !== "object") return { error: "Invalid request body" };

  const f = extractScheduleFields(body as Record<string, unknown>);
  const fieldError = validateScheduleFields(f);
  if (fieldError) return { error: fieldError };

  const dtError = validateDatetime(f.datetime);
  if (dtError) return { error: dtError };

  return {
    data: {
      name: f.name,
      company: f.company,
      email: f.email,
      description: f.description,
      datetime: f.datetime,
      timezone: f.timezone,
      lang: f.lang,
    },
  };
}

/** Validates and sanitizes the POST /api/reschedule request body. */
export function validateRescheduleBody(body: unknown): ValidationResult<RescheduleBody> {
  if (!body || typeof body !== "object") return { error: "Invalid request body" };

  const raw = body as Record<string, unknown>;
  const data: RescheduleBody = {
    eventId: typeof raw.eventId === "string" ? raw.eventId.trim() : "",
    email: typeof raw.email === "string" ? raw.email.trim() : "",
    datetime: typeof raw.datetime === "string" ? raw.datetime.trim() : "",
    lang: normalizeLang(raw.lang),
  };

  if (!data.eventId) return { error: "eventId is required" };
  if (!EVENT_ID_PATTERN.test(data.eventId)) return { error: "Invalid eventId format" };
  if (!data.email || !EMAIL_PATTERN.test(data.email)) return { error: "Valid email is required" };
  if (!data.datetime) return { error: "Datetime is required" };

  const dtError = validateDatetime(data.datetime);
  if (dtError) return { error: dtError };

  return { data };
}

/** Validates the from/to query parameters for GET /api/availability (max 45-day range). */
export function validateAvailabilityQuery(
  from: string | undefined,
  to: string | undefined,
): ValidationResult<{ from: string; to: string }> {
  if (
    !from ||
    !to ||
    !DATE_FORMAT_PATTERN.test(from) ||
    !DATE_FORMAT_PATTERN.test(to)
  ) {
    return { error: "from and to params required (YYYY-MM-DD)" };
  }

  const offset = getBusinessOffset();
  const fromMs = Date.parse(`${from}T00:00:00${offset}`);
  const toMs = Date.parse(`${to}T23:59:59${offset}`);

  if (Number.isNaN(fromMs) || Number.isNaN(toMs) || from > to) {
    return { error: "Invalid date range" };
  }

  if ((toMs - fromMs) / 86_400_000 > 45) {
    return { error: "Range limited to 45 days" };
  }

  return { data: { from, to } };
}

export {
  getBusinessOffset,
  getBusinessToday,
  getBusinessNowMinutes,
  isWeekday,
};
