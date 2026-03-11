import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { Hono } from "hono";
import { google } from "googleapis";
import { getScheduleCopy } from "./schedule-copy.js";
import { normalizeLang } from "./lang.js";

// ─── Configuration ──────────────────────────────────────────────────────
const TIMEZONE = "America/Bogota";
const SLOT_DURATION_MIN = 30;

const TIME_RANGES = [
  { startHour: 9, endHour: 12 },
  { startHour: 14, endHour: 17 },
];

const VALID_DAYS = new Set([1, 2, 3, 4, 5]);

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
const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar";

function sanitize(str: string): string {
  return str.replaceAll(HTML_TAG_RE, "").trim();
}

function escapeHtml(str: string): string {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

interface ScheduleBody {
  name: string;
  company: string;
  email: string;
  description?: string;
  date: string;
  time: string;
  lang: "en" | "es";
}

interface RescheduleBody {
  eventId: string;
  email: string;
  date: string;
  time: string;
  lang: "en" | "es";
}

function extractFields(body: Record<string, unknown>) {
  return {
    name: typeof body.name === "string" ? sanitize(body.name) : "",
    company: typeof body.company === "string" ? sanitize(body.company) : "",
    email: typeof body.email === "string" ? body.email.trim() : "",
    description: typeof body.description === "string" ? sanitize(body.description) : "",
    date: typeof body.date === "string" ? body.date.trim() : "",
    time: typeof body.time === "string" ? body.time.trim() : "",
    lang: normalizeLang(body.lang),
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
  const dayOfWeek = dateObj.getUTCDay();
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

function validateRescheduleBody(body: unknown): { data?: RescheduleBody; error?: string } {
  if (!body || typeof body !== "object") return { error: "Invalid request body" };

  const raw = body as Record<string, unknown>;
  const data: RescheduleBody = {
    eventId: typeof raw.eventId === "string" ? raw.eventId.trim() : "",
    email: typeof raw.email === "string" ? raw.email.trim() : "",
    date: typeof raw.date === "string" ? raw.date.trim() : "",
    time: typeof raw.time === "string" ? raw.time.trim() : "",
    lang: normalizeLang(raw.lang),
  };

  if (!data.eventId) return { error: "eventId is required" };
  if (!/^[a-z0-9]{5,1024}$/i.test(data.eventId)) return { error: "Invalid eventId format" };
  if (!data.email || !EMAIL_RE.test(data.email)) return { error: "Valid email is required" };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) return { error: "Invalid date format (YYYY-MM-DD)" };
  if (!/^\d{2}:\d{2}$/.test(data.time)) return { error: "Invalid time format (HH:mm)" };

  const dateTimeError = validateDateAndTime(data.date, data.time);
  if (dateTimeError) return { error: dateTimeError };

  return { data };
}

// ─── Google Calendar client ─────────────────────────────────────────────
function getOauthConfig() {
  return {
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID?.trim() ?? "",
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim() ?? "",
    refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN?.trim() ?? "",
    redirectBaseUrl:
      process.env.GOOGLE_OAUTH_REDIRECT_BASE_URL?.trim() ?? "http://localhost:3001",
    stateSecret:
      process.env.GOOGLE_OAUTH_STATE_SECRET?.trim() ??
      process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim() ??
      "",
  };
}

function getOauthRedirectUri(baseUrl: string): string {
  const base = new URL(baseUrl);
  return new URL("/api/oauth/google/callback", base).toString();
}

function createOAuthClient(options?: { includeRefreshToken?: boolean; requireRefreshToken?: boolean }) {
  const { clientId, clientSecret, refreshToken, redirectBaseUrl } = getOauthConfig();

  if (!clientId || !clientSecret) {
    return null;
  }
  if (options?.requireRefreshToken && !refreshToken) {
    return null;
  }

  const client = new google.auth.OAuth2(clientId, clientSecret, getOauthRedirectUri(redirectBaseUrl));
  if (options?.includeRefreshToken && refreshToken) {
    client.setCredentials({ refresh_token: refreshToken });
  }

  return client;
}

function createSignedState(): string {
  const { stateSecret } = getOauthConfig();
  if (!stateSecret) {
    throw new Error("GOOGLE_OAUTH_STATE_SECRET (or GOOGLE_OAUTH_CLIENT_SECRET) is required");
  }

  const payload = JSON.stringify({
    n: randomBytes(12).toString("hex"),
    iat: Date.now(),
  });
  const encodedPayload = Buffer.from(payload, "utf8").toString("base64url");
  const signature = createHmac("sha256", stateSecret).update(encodedPayload).digest("base64url");
  return `${encodedPayload}.${signature}`;
}

function verifySignedState(state: string | undefined): boolean {
  if (!state) return false;
  const { stateSecret } = getOauthConfig();
  if (!stateSecret) return false;

  const parts = state.split(".");
  if (parts.length !== 2) return false;

  const [encodedPayload, signature] = parts;
  const expected = createHmac("sha256", stateSecret).update(encodedPayload).digest("base64url");

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as {
      iat?: number;
    };
    if (typeof payload.iat !== "number") return false;
    const maxAgeMs = 15 * 60 * 1000;
    return Date.now() - payload.iat <= maxAgeMs;
  } catch {
    return false;
  }
}

function getServiceAccountCalendarClient() {
  const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE;
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const impersonateUser = process.env.GOOGLE_CALENDAR_IMPERSONATE_USER?.trim();

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
  
  if (typeof credentials.private_key === "string") {
    credentials.private_key = credentials.private_key.replaceAll(
      String.raw`\n`,
      String.raw`
`,
    );
  }
  const scopes = [CALENDAR_SCOPE];
  let auth;

  if (impersonateUser) {
    const clientEmail = credentials.client_email;
    const privateKey = credentials.private_key;

    if (typeof clientEmail !== "string" || typeof privateKey !== "string") {
      throw new TypeError("Service account JSON must include client_email and private_key");
    }
    
    auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes,
      subject: impersonateUser,
    });
  } else {
    auth = new google.auth.GoogleAuth({
      credentials,
      scopes,
    });
  }

  return google.calendar({ version: "v3", auth });
}

function getCalendarClient() {
  const oauthClient = createOAuthClient({ includeRefreshToken: true, requireRefreshToken: true });
  if (oauthClient) {
    return google.calendar({ version: "v3", auth: oauthClient });
  }
  return getServiceAccountCalendarClient();
}

function getCalendarId(): string {
  const id = process.env.GOOGLE_CALENDAR_ID;
  if (!id) throw new Error("GOOGLE_CALENDAR_ID env var is not set");
  return id;
}

function buildGoogleEventId(): string {
  return randomBytes(10).toString("hex");
}

function buildRescheduleLink(eventId: string, email: string, lang: "en" | "es"): string {
  const base = process.env.BOOKING_RESCHEDULE_URL?.trim();
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

function buildStartAndEnd(date: string, time: string) {
  const startDateTime = `${date}T${time}:00`;
  const [h, m] = time.split(":").map(Number);
  const endMin = m + SLOT_DURATION_MIN;
  const endH = h + Math.floor(endMin / 60);
  const endM = endMin % 60;
  const endTime = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
  const endDateTime = `${date}T${endTime}:00`;
  return { startDateTime, endDateTime };
}

async function hasSlotConflict(
  calendar: ReturnType<typeof google.calendar>,
  calendarId: string,
  startDateTime: string,
  endDateTime: string,
  excludeEventId?: string,
) {
  const eventsRes = await calendar.events.list({
    calendarId,
    timeMin: new Date(`${startDateTime}-05:00`).toISOString(),
    timeMax: new Date(`${endDateTime}-05:00`).toISOString(),
    singleEvents: true,
    showDeleted: false,
    maxResults: 20,
  });

  const items = eventsRes.data.items ?? [];
  return items.some((ev) => ev.id !== excludeEventId && ev.status !== "cancelled");
}

// ─── Route ──────────────────────────────────────────────────────────────
export const scheduleRoute = new Hono();

scheduleRoute.get("/oauth/google/start", async (c) => {
  try {
    const oauthClient = createOAuthClient();
    if (!oauthClient) {
      return c.json(
        {
          error: "oauth_not_configured",
          message: "Set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET",
        },
        500,
      );
    }

    const authUrl = oauthClient.generateAuthUrl({
      access_type: "offline",
      include_granted_scopes: true,
      prompt: "consent",
      scope: [CALENDAR_SCOPE],
      state: createSignedState(),
    });

    return c.redirect(authUrl, 302);
  } catch (err: unknown) {
    console.error("[oauth-start] Error:", err instanceof Error ? err.message : err);
    return c.json({ error: "server_error" }, 500);
  }
});

scheduleRoute.get("/oauth/google/callback", async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const oauthError = c.req.query("error");

  if (oauthError) {
    return c.json({ error: "oauth_error", message: oauthError }, 400);
  }
  if (!code) {
    return c.json({ error: "validation", message: "Missing code" }, 400);
  }
  if (!verifySignedState(state)) {
    return c.json({ error: "validation", message: "Invalid or expired state" }, 400);
  }

  try {
    const oauthClient = createOAuthClient();
    if (!oauthClient) {
      return c.json(
        {
          error: "oauth_not_configured",
          message: "Set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET",
        },
        500,
      );
    }

    const { tokens } = await oauthClient.getToken(code);
    if (!tokens.refresh_token) {
      return c.json(
        {
          error: "missing_refresh_token",
          message:
            "No refresh token returned. Re-run consent with prompt=consent and access_type=offline.",
        },
        400,
      );
    }

    return c.json({
      success: true,
      message: "Store GOOGLE_OAUTH_REFRESH_TOKEN in your environment.",
      refreshToken: tokens.refresh_token,
      scope: tokens.scope,
      expiryDate: tokens.expiry_date,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[oauth-callback] Error:", message);
    return c.json({ error: "oauth_exchange_failed", message }, 500);
  }
});

scheduleRoute.get("/oauth/google/status", (c) => {
  const { clientId, clientSecret, refreshToken, redirectBaseUrl, stateSecret } = getOauthConfig();
  return c.json({
    oauthClientConfigured: Boolean(clientId && clientSecret),
    oauthRefreshTokenConfigured: Boolean(refreshToken),
    oauthStateConfigured: Boolean(stateSecret),
    redirectUri: getOauthRedirectUri(redirectBaseUrl),
  });
});

scheduleRoute.post("/schedule", async (c) => {
  const body = await c.req.json().catch(() => null);
  const { data, error } = validateBody(body);

  if (error || !data) {
    return c.json({ error: "validation", message: error }, 400);
  }

  try {
    const calendar = getCalendarClient();
    const calendarId = getCalendarId();
    
    const { startDateTime, endDateTime } = buildStartAndEnd(data.date, data.time);
    
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
    
    const summary =
      `${getScheduleCopy(data.lang ?? "en").summary} — ${data.name} (${data.company})`;

    const eventId = buildGoogleEventId();
    const rescheduleLink = buildRescheduleLink(eventId, data.email, data.lang);
    const copy = getScheduleCopy(data.lang);

    const descriptionLines = [
      `${copy.labels.name}: ${escapeHtml(data.name)}`,
      `${copy.labels.company}: ${escapeHtml(data.company)}`,
      `${copy.labels.email}: ${escapeHtml(data.email)}`,
      data.description ? `${copy.labels.message}: ${escapeHtml(data.description)}` : "",
      rescheduleLink
        ? `<br/><a href="${escapeHtml(rescheduleLink)}"><strong>${copy.cta.reschedule}</strong></a>`
        : "",
    ].filter(Boolean);

    const description = descriptionLines.join("<br/>");

    await calendar.events.insert({
      calendarId,
      sendUpdates: "all",
      requestBody: {
        id: eventId,
        summary,
        description,
        start: { dateTime: startDateTime, timeZone: TIMEZONE },
        end: { dateTime: endDateTime, timeZone: TIMEZONE },
        attendees: [
          {
            email: data.email,
            displayName: data.name,
          },
        ],
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
    const message = err instanceof Error ? err.message : String(err);
    console.error("[schedule] Error:", message);

    if (message.includes("Service accounts cannot invite attendees")) {
      return c.json(
        {
          error: "calendar_permission",
          message:
            "Inviting attendees requires Google Workspace Domain-Wide Delegation or OAuth user auth.",
        },
        500,
      );
    }

    return c.json({ error: "server_error" }, 500);
  }
});

scheduleRoute.post("/reschedule", async (c) => {
  const body = await c.req.json().catch(() => null);
  const { data, error } = validateRescheduleBody(body);

  if (error || !data) {
    return c.json({ error: "validation", message: error }, 400);
  }

  try {
    const calendar = getCalendarClient();
    const calendarId = getCalendarId();
    const { startDateTime, endDateTime } = buildStartAndEnd(data.date, data.time);

    const existing = await calendar.events.get({ calendarId, eventId: data.eventId });
    const event = existing.data;
    const attendees = event.attendees ?? [];
    const attendeeMatch = attendees.some(
      (a) => typeof a.email === "string" && a.email.toLowerCase() === data.email.toLowerCase(),
    );

    if (!attendeeMatch) {
      return c.json({ error: "forbidden", message: "Email is not an attendee of this event" }, 403);
    }

    const hasConflict = await hasSlotConflict(
      calendar,
      calendarId,
      startDateTime,
      endDateTime,
      data.eventId,
    );
    if (hasConflict) {
      return c.json({ error: "slot_taken" }, 409);
    }

    await calendar.events.patch({
      calendarId,
      eventId: data.eventId,
      sendUpdates: "all",
      requestBody: {
        start: { dateTime: startDateTime, timeZone: TIMEZONE },
        end: { dateTime: endDateTime, timeZone: TIMEZONE },
      },
    });

    return c.json({ success: true, action: "rescheduled" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[reschedule] Error:", message);
    return c.json({ error: "server_error" }, 500);
  }
});

// ─── Availability ───────────────────────────────────────────────────────
const BOGOTA_OFFSET = "-05:00";

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
