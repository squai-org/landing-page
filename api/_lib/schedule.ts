import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Hono } from "hono";
import { google } from "googleapis";

// ─── Configuration ──────────────────────────────────────────────────────
const TIMEZONE = "America/Bogota";
const SLOT_DURATION_MIN = 30;

// Morning: 9:00–12:00, Afternoon: 14:00–17:00
const TIME_RANGES = [
  { startHour: 9, endHour: 12 },
  { startHour: 14, endHour: 17 },
];

// Days of week: 1=Monday ... 5=Friday
const VALID_DAYS = new Set([1, 2, 3, 4, 5]);

// All bookable 30-min slots (derived from TIME_RANGES)
const ALL_SLOTS: string[] = [];
for (const r of TIME_RANGES) {
  for (let m = r.startHour * 60; m + SLOT_DURATION_MIN <= r.endHour * 60; m += SLOT_DURATION_MIN) {
    ALL_SLOTS.push(
      `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`,
    );
  }
}

// ─── Validation helpers ─────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HTML_TAG_RE = /<[^>]*>/g;

/** Strip HTML tags to prevent injection into calendar event fields */
function sanitize(str: string): string {
  return str.replaceAll(HTML_TAG_RE, "").trim();
}

interface ScheduleBody {
  name: string;
  company: string;
  email: string;
  description?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  lang?: "en" | "es";
}

function extractFields(body: Record<string, unknown>) {
  return {
    name: typeof body.name === "string" ? sanitize(body.name) : "",
    company: typeof body.company === "string" ? sanitize(body.company) : "",
    email: typeof body.email === "string" ? body.email.trim() : "",
    description: typeof body.description === "string" ? sanitize(body.description) : "",
    date: typeof body.date === "string" ? body.date.trim() : "",
    time: typeof body.time === "string" ? body.time.trim() : "",
    lang: body.lang === "es" ? ("es" as const) : ("en" as const),
  };
}

function validateFields(f: ReturnType<typeof extractFields>): string | null {
  if (!f.name) return "Name is required";
  if (f.name.length > 200) return "Name too long";
  if (!f.company) return "Company is required";
  if (f.company.length > 200) return "Company too long";
  if (!f.email || !EMAIL_RE.test(f.email)) return "Valid email is required";
  if (f.description.length > 2000) return "Description too long";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(f.date)) return "Invalid date format (YYYY-MM-DD)";
  if (!/^\d{2}:\d{2}$/.test(f.time)) return "Invalid time format (HH:mm)";
  return null;
}

function validateDateAndTime(date: string, time: string): string | null {
  const dateObj = new Date(`${date}T12:00:00`);
  if (Number.isNaN(dateObj.getTime())) return "Invalid date";
  const dayOfWeek = dateObj.getUTCDay(); // 0=Sun, 1=Mon ... 6=Sat
  const isoDay = dayOfWeek === 0 ? 7 : dayOfWeek;
  if (!VALID_DAYS.has(isoDay)) return "Only weekdays are available";

  const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: TIMEZONE });
  if (date < todayStr) return "Cannot schedule in the past";

  const [hourStr, minStr] = time.split(":");
  const hour = Number.parseInt(hourStr, 10);
  const min = Number.parseInt(minStr, 10);
  if (min % SLOT_DURATION_MIN !== 0) return "Invalid time slot";

  const totalMinutes = hour * 60 + min;
  const isValidSlot = TIME_RANGES.some(
    (r) => totalMinutes >= r.startHour * 60 && totalMinutes + SLOT_DURATION_MIN <= r.endHour * 60,
  );
  if (!isValidSlot) return "Time slot is outside available hours";

  return null;
}

function validateBody(body: unknown): { data?: ScheduleBody; error?: string } {
  if (!body || typeof body !== "object") return { error: "Invalid request body" };

  const f = extractFields(body as Record<string, unknown>);
  const fieldError = validateFields(f);
  if (fieldError) return { error: fieldError };

  const dateTimeError = validateDateAndTime(f.date, f.time);
  if (dateTimeError) return { error: dateTimeError };

  return { data: { name: f.name, company: f.company, email: f.email, description: f.description, date: f.date, time: f.time, lang: f.lang } };
}

// ─── Google Calendar client ─────────────────────────────────────────────
function getCalendarClient() {
  const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE;
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!keyPath && !keyJson) {
    throw new Error("Set GOOGLE_SERVICE_ACCOUNT_KEY_FILE or GOOGLE_SERVICE_ACCOUNT_KEY");
  }

  let credentials: Record<string, unknown>;
  try {
    credentials = keyPath
      ? JSON.parse(readFileSync(resolve(keyPath), "utf-8"))
      : JSON.parse(keyJson!);
  } catch (e) {
    throw new Error(`Failed to parse service account JSON: ${e instanceof Error ? e.message : e}`);
  }

  // Vercel env vars may store \n as literal two-char sequences;
  // the Google Auth SDK requires actual newline characters in the PEM key.
  if (typeof credentials.private_key === "string") {
    credentials.private_key = credentials.private_key.replaceAll(
      String.raw`\n`,
      String.raw`
`,
    );
  }
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  return google.calendar({ version: "v3", auth });
}

function getCalendarId(): string {
  const id = process.env.GOOGLE_CALENDAR_ID;
  if (!id) throw new Error("GOOGLE_CALENDAR_ID env var is not set");
  return id;
}

// ─── Route ──────────────────────────────────────────────────────────────
export const scheduleRoute = new Hono();

scheduleRoute.post("/schedule", async (c) => {
  const body = await c.req.json().catch(() => null);
  const { data, error } = validateBody(body);

  if (error || !data) {
    return c.json({ error: "validation", message: error }, 400);
  }

  try {
    const calendar = getCalendarClient();
    const calendarId = getCalendarId();

    // Build start/end datetimes
    const startDateTime = `${data.date}T${data.time}:00`;
    const [h, m] = data.time.split(":").map(Number);
    const endMin = m + SLOT_DURATION_MIN;
    const endH = h + Math.floor(endMin / 60);
    const endM = endMin % 60;
    const endTime = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
    const endDateTime = `${data.date}T${endTime}:00`;

    // Check if the slot is free
    const busyCheck = await calendar.freebusy.query({
      requestBody: {
        timeMin: new Date(`${startDateTime}-05:00`).toISOString(),
        timeMax: new Date(`${endDateTime}-05:00`).toISOString(),
        timeZone: TIMEZONE,
        items: [{ id: calendarId }],
      },
    });

    const busy = busyCheck.data.calendars?.[calendarId]?.busy ?? [];
    if (busy.length > 0) {
      return c.json({ error: "slot_taken" }, 409);
    }

    // Create the event
    const summary =
      data.lang === "es"
        ? `Llamada de Descubrimiento — ${data.name} (${data.company})`
        : `Discovery Call — ${data.name} (${data.company})`;

    const description = [
      `Name: ${data.name}`,
      `Company: ${data.company}`,
      `Email: ${data.email}`,
      data.description ? `\nMessage:\n${data.description}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    await calendar.events.insert({
      calendarId,
      requestBody: {
        summary,
        description,
        start: { dateTime: startDateTime, timeZone: TIMEZONE },
        end: { dateTime: endDateTime, timeZone: TIMEZONE },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 60 },
            { method: "popup", minutes: 15 },
          ],
        },
      },
    });

    return c.json({ success: true });
  } catch (err: unknown) {
    console.error("[schedule] Error:", err instanceof Error ? err.message : err);
    return c.json({ error: "server_error" }, 500);
  }
});

// ─── Availability ───────────────────────────────────────────────────────
const BOGOTA_OFFSET = "-05:00"; // Colombia has no DST

interface BusyPeriod {
  start?: string | null;
  end?: string | null;
}

function isSlotTaken(slotStartMs: number, slotEndMs: number, periods: BusyPeriod[]): boolean {
  return periods.some((p) => {
    if (!p.start || !p.end) return false;
    return slotStartMs < new Date(p.end).getTime() && slotEndMs > new Date(p.start).getTime();
  });
}

function computeBusySlots(
  from: string,
  to: string,
  periods: BusyPeriod[],
): Record<string, string[]> {
  const slotMs = SLOT_DURATION_MIN * 60_000;
  const busy: Record<string, string[]> = {};

  let cursor = from;
  while (cursor <= to) {
    const dow = new Date(`${cursor}T12:00:00${BOGOTA_OFFSET}`).getUTCDay();
    if (dow !== 0 && dow !== 6) {
      const dayBusy: string[] = [];
      for (const slot of ALL_SLOTS) {
        const slotStartMs = Date.parse(`${cursor}T${slot}:00${BOGOTA_OFFSET}`);
        if (isSlotTaken(slotStartMs, slotStartMs + slotMs, periods)) {
          dayBusy.push(slot);
        }
      }
      if (dayBusy.length > 0) busy[cursor] = dayBusy;
    }
    const next = new Date(`${cursor}T12:00:00Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    cursor = next.toISOString().slice(0, 10);
  }

  return busy;
}

scheduleRoute.get("/availability", async (c) => {
  const from = c.req.query("from");
  const to = c.req.query("to");

  if (!from || !to || !/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
    return c.json({ error: "validation", message: "from and to params required (YYYY-MM-DD)" }, 400);
  }

  const fromMs = Date.parse(`${from}T00:00:00${BOGOTA_OFFSET}`);
  const toMs = Date.parse(`${to}T23:59:59${BOGOTA_OFFSET}`);

  if (Number.isNaN(fromMs) || Number.isNaN(toMs) || from > to) {
    return c.json({ error: "validation", message: "Invalid date range" }, 400);
  }

  if ((toMs - fromMs) / 86_400_000 > 45) {
    return c.json({ error: "validation", message: "Range limited to 45 days" }, 400);
  }

  try {
    const calendar = getCalendarClient();
    const calendarId = getCalendarId();

    const freebusyRes = await calendar.freebusy.query({
      requestBody: {
        timeMin: new Date(fromMs).toISOString(),
        timeMax: new Date(toMs).toISOString(),
        timeZone: TIMEZONE,
        items: [{ id: calendarId }],
      },
    });

    const periods = freebusyRes.data.calendars?.[calendarId]?.busy ?? [];
    const busy = computeBusySlots(from, to, periods);

    return c.json({ busy });
  } catch (err: unknown) {
    console.error("[availability] Error:", err instanceof Error ? err.message : err);
    return c.json({ error: "server_error" }, 500);
  }
});
