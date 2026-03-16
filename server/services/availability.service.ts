import {
  BUSINESS_TZ,
  SLOT_DURATION_MIN,
  PREPARATION_BUFFER_MIN,
  TIME_RANGES,
} from "../config/env.js";
import { getCalendarClient, getCalendarId } from "../config/index.js";
import {
  getBusinessOffset,
  getBusinessToday,
  getBusinessNowMinutes,
  isWeekday,
} from "../validators/index.js";
import type { BusyPeriod } from "../types/index.js";

const ALL_SLOTS: string[] = [];
for (const r of TIME_RANGES) {
  for (
    let m = r.startHour * 60;
    m + SLOT_DURATION_MIN <= r.endHour * 60;
    m += SLOT_DURATION_MIN
  ) {
    ALL_SLOTS.push(
      `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`,
    );
  }
}


function nextDay(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

function isSlotTaken(
  slotStartMs: number,
  slotEndMs: number,
  periods: BusyPeriod[],
): boolean {
  return periods.some((p) => {
    if (!p.start || !p.end) return false;
    return (
      slotStartMs < new Date(p.end).getTime() &&
      slotEndMs > new Date(p.start).getTime()
    );
  });
}

function getSlotIso(
  slot: string,
  dateStr: string,
  offset: string,
  todayStr: string,
  minSlotMinutes: number,
  slotMs: number,
  periods: BusyPeriod[],
): string | null {
  const slotStartMs = Date.parse(`${dateStr}T${slot}:00${offset}`);
  if (isSlotTaken(slotStartMs, slotStartMs + slotMs, periods)) return null;

  if (dateStr === todayStr) {
    const [sh, sm] = slot.split(":").map(Number);
    if (sh * 60 + sm < minSlotMinutes) return null;
  }

  return new Date(slotStartMs).toISOString();
}

function computeAvailableSlots(
  from: string,
  to: string,
  periods: BusyPeriod[],
): Record<string, string[]> {
  const offset = getBusinessOffset();
  const todayStr = getBusinessToday();
  const minSlotMinutes = getBusinessNowMinutes() + PREPARATION_BUFFER_MIN;
  const slotMs = SLOT_DURATION_MIN * 60_000;
  const slots: Record<string, string[]> = {};

  for (let cursor = from; cursor <= to; cursor = nextDay(cursor)) {
    if (!isWeekday(cursor)) continue;

    const daySlots = ALL_SLOTS.map((slot) =>
      getSlotIso(slot, cursor, offset, todayStr, minSlotMinutes, slotMs, periods),
    ).filter((iso): iso is string => iso !== null);

    if (daySlots.length > 0) slots[cursor] = daySlots;
  }

  return slots;
}


/** Queries Google Calendar and returns available booking slots grouped by date. */
export async function getAvailability(
  from: string,
  to: string,
): Promise<Record<string, string[]>> {
  const calendar = getCalendarClient();
  const calendarId = getCalendarId();
  const offset = getBusinessOffset();

  const fromMs = Date.parse(`${from}T00:00:00${offset}`);
  const toMs = Date.parse(`${to}T23:59:59${offset}`);

  const freebusyRes = await calendar.freebusy.query({
    requestBody: {
      timeMin: new Date(fromMs).toISOString(),
      timeMax: new Date(toMs).toISOString(),
      timeZone: BUSINESS_TZ,
      items: [{ id: calendarId }],
    },
  });

  const periods = freebusyRes.data.calendars?.[calendarId]?.busy ?? [];
  return computeAvailableSlots(from, to, periods);
}
