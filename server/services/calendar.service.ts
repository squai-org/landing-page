import { randomBytes } from "node:crypto";
import { google } from "googleapis";
import { getCalendarClient, getCalendarId, getRescheduleBaseUrl, SLOT_DURATION_MIN, INTL_LOCALE, ErrorCode, HttpStatus } from "../config/index.js";
import type { SupportedLang } from "../config/lang.js";
import { parseDatetime } from "../validators/index.js";
import { buildScheduleEmail } from "./email.service.js";
import { loadTranslation } from "./i18n.service.js";

function buildGoogleEventId(): string {
  return randomBytes(10).toString("hex");
}

function buildRescheduleLink(
  eventId: string,
  email: string,
  lang: SupportedLang,
): string {
  const base = getRescheduleBaseUrl();
  if (!base) return "";

  try {
    const url = new URL(base);
    url.pathname = `/${lang}`;
    url.searchParams.set("reschedule", "1");
    url.searchParams.set("eventId", eventId);
    url.searchParams.set("email", email);
    url.searchParams.set("lang", lang);
    return url.toString();
  } catch {
    return base;
  }
}

function formatDateTime(
  date: Date,
  lang: SupportedLang,
  timeZone: string,
): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[lang] ?? INTL_LOCALE.en, {
    timeZone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: lang === "en",
  }).format(date);
}

/** Checks whether a time range overlaps with existing calendar events. */
export async function hasSlotConflict(
  calendarInstance: ReturnType<typeof google.calendar>,
  calendarId: string,
  startMs: number,
  endMs: number,
  excludeEventId?: string,
): Promise<boolean> {
  const eventsRes = await calendarInstance.events.list({
    calendarId,
    timeMin: new Date(startMs).toISOString(),
    timeMax: new Date(endMs).toISOString(),
    singleEvents: true,
    showDeleted: false,
    maxResults: 20,
  });

  const items = eventsRes.data.items ?? [];
  return items.some(
    (ev) => ev.id !== excludeEventId && ev.status !== "cancelled",
  );
}

/** Parameters for creating a new calendar booking. */
export interface CreateBookingParams {
  name: string;
  company: string;
  email: string;
  description: string;
  datetime: string;
  timezone: string;
  lang: SupportedLang;
}

/** Creates a Google Calendar event with a Meet link and confirmation email. */
export async function createBooking(params: CreateBookingParams): Promise<{ success: true } | { error: string; status: number }> {
  const { name, company, email, description, datetime, timezone, lang } = params;
  const calendar = getCalendarClient();
  const calendarId = getCalendarId();

  const result = parseDatetime(datetime);
  if (!result) throw new Error(`Invalid datetime: ${datetime}`);
  const startMs = result.parsed.getTime();
  const endMs = startMs + SLOT_DURATION_MIN * 60_000;

  const busyCheck = await calendar.freebusy.query({
    requestBody: {
      timeMin: new Date(startMs).toISOString(),
      timeMax: new Date(endMs).toISOString(),
      timeZone: process.env.BUSINESS_TIMEZONE?.trim() || "America/Bogota",
      items: [{ id: calendarId }],
    },
  });

  const busy = busyCheck.data.calendars?.[calendarId]?.busy ?? [];
  if (busy.length > 0) {
    return { error: ErrorCode.SLOT_TAKEN, status: HttpStatus.CONFLICT };
  }

  const t = loadTranslation(lang);
  const summary = `${t.backend.schedule.summary} — ${name} (${company})`;

  const eventId = buildGoogleEventId();
  const rescheduleLink = buildRescheduleLink(eventId, email, lang);

  const emailHtml = buildScheduleEmail(lang, {
    name,
    company,
    dateTime: formatDateTime(result.parsed, lang, timezone),
    meetLink: "",
    detail: description,
    rescheduleLink,
  });

  const insertResponse = await calendar.events.insert({
    calendarId,
    sendUpdates: "all",
    conferenceDataVersion: 1,
    requestBody: {
      id: eventId,
      summary,
      description: emailHtml,
      start: { dateTime: new Date(startMs).toISOString() },
      end: { dateTime: new Date(endMs).toISOString() },
      attendees: [{ email, displayName: name }],
      conferenceData: {
        createRequest: {
          requestId: eventId,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 60 },
          { method: "popup", minutes: 15 },
        ],
      },
    },
  });

  const meetUri = insertResponse.data.conferenceData?.entryPoints?.find(
    (ep) => ep.entryPointType === "video",
  )?.uri;

  if (meetUri) {
    const fullDescription = buildScheduleEmail(lang, {
      name,
      company,
      dateTime: formatDateTime(result.parsed, lang, timezone),
      meetLink: meetUri,
      detail: description,
      rescheduleLink,
    });
    await calendar.events.patch({
      calendarId,
      eventId,
      sendUpdates: "none",
      requestBody: { description: fullDescription },
    });
  }

  return { success: true };
}

/** Parameters for rescheduling an existing booking. */
export interface RescheduleBookingParams {
  eventId: string;
  email: string;
  datetime: string;
  lang: SupportedLang;
}

/** Moves an existing calendar event to a new time slot after verifying the attendee. */
export async function rescheduleBooking(
  params: RescheduleBookingParams,
): Promise<{ success: true; action: "rescheduled" } | { error: string; status: number }> {
  const { eventId, email, datetime } = params;
  const calendar = getCalendarClient();
  const calendarId = getCalendarId();

  const result = parseDatetime(datetime);
  if (!result) throw new Error(`Invalid datetime: ${datetime}`);
  const startMs = result.parsed.getTime();
  const endMs = startMs + SLOT_DURATION_MIN * 60_000;

  const existing = await calendar.events.get({ calendarId, eventId });
  const attendees = existing.data.attendees ?? [];
  const attendeeMatch = attendees.some(
    (a) =>
      typeof a.email === "string" &&
      a.email.toLowerCase() === email.toLowerCase(),
  );

  if (!attendeeMatch) {
    return { error: ErrorCode.FORBIDDEN, status: HttpStatus.FORBIDDEN };
  }

  const conflict = await hasSlotConflict(calendar, calendarId, startMs, endMs, eventId);
  if (conflict) {
    return { error: ErrorCode.SLOT_TAKEN, status: HttpStatus.CONFLICT };
  }

  await calendar.events.patch({
    calendarId,
    eventId,
    sendUpdates: "all",
    requestBody: {
      start: { dateTime: new Date(startMs).toISOString() },
      end: { dateTime: new Date(endMs).toISOString() },
    },
  });

  return { success: true, action: "rescheduled" };
}
