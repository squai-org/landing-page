/** IANA timezone identifier for business operations. */
export const BUSINESS_TZ = process.env.BUSINESS_TIMEZONE?.trim() || "America/Bogota";
/** Duration of each booking slot in minutes. */
export const SLOT_DURATION_MIN = 30;
/** Minimum buffer in minutes before a same-day slot can be booked. */
export const PREPARATION_BUFFER_MIN = 30;

/** Available booking time ranges per day (24h format). */
export const TIME_RANGES: readonly { startHour: number; endHour: number }[] = [
  { startHour: 9, endHour: 12 },
  { startHour: 14, endHour: 17 },
];

/** ISO weekday numbers (1=Monday..5=Friday) that accept bookings. */
export const VALID_DAYS = new Set([1, 2, 3, 4, 5]);
/** Google Calendar API OAuth scope. */
export const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar";

/** @throws {Error} If GOOGLE_CALENDAR_ID is not set. */
export function getCalendarId(): string {
  const id = process.env.GOOGLE_CALENDAR_ID;
  if (!id) throw new Error("GOOGLE_CALENDAR_ID env var is not set");
  return id;
}

/** Returns the base URL for reschedule links, or empty string if not configured. */
export function getRescheduleBaseUrl(): string {
  return process.env.BOOKING_RESCHEDULE_URL?.trim() ?? "";
}

/** Parses the ALLOWED_ORIGINS CSV environment variable into an array of origin URLs. */
export function getAllowedOrigins(): string[] {
  return (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
}
