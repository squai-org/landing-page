import type { Context } from "hono";
import {
  validateScheduleBody,
  validateRescheduleBody,
  validateAvailabilityQuery,
} from "../validators/index.js";
import {
  createBooking,
  rescheduleBooking,
  getAvailability,
  RescheduleBookingParams,
  CreateBookingParams,
} from "../services/index.js";
import { HttpStatus, ErrorCode } from "../config/constants.js";
import { getErrorMessage } from "../utils/index.js";

/**
 * Handles POST /api/schedule.
 *
 * Validates the request body ({@link CreateBookingParams}), checks calendar
 * availability via Google FreeBusy, and creates a Calendar event with a
 * Google Meet link and confirmation email.
 *
 * @param c - Hono request context with JSON body.
 * @returns 200 `{ success: true }` on success.
 * @returns 400 if validation fails.
 * @returns 409 if the requested time slot is already taken.
 * @returns 500 on calendar permission or unexpected errors.
 */
export async function handleSchedule(c: Context) {
  const body = await c.req.json().catch(() => null);
  const result = validateScheduleBody(body);

  if (result.error) {
    return c.json({ error: ErrorCode.VALIDATION, message: result.error }, HttpStatus.BAD_REQUEST);
  }

  const data = result.data;

  try {
    const outcome = await createBooking(data as CreateBookingParams);

    if ("error" in outcome) {
      if (outcome.error === ErrorCode.SLOT_TAKEN) {
        return c.json({ error: ErrorCode.SLOT_TAKEN }, HttpStatus.CONFLICT);
      }
      return c.json({ error: outcome.error }, outcome.status as 400);
    }

    return c.json({ success: true });
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("[schedule] Error:", message);

    if (message.includes("Service accounts cannot invite attendees")) {
      return c.json(
        {
          error: ErrorCode.CALENDAR_PERMISSION,
          message:
            "Inviting attendees requires Google Workspace Domain-Wide Delegation or OAuth user auth.",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return c.json({ error: ErrorCode.SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

/**
 * Handles POST /api/reschedule.
 *
 * Validates the request body ({@link RescheduleBookingParams}), verifies the
 * email matches an attendee of the existing event, checks for conflicts,
 * and patches the event with the new time.
 *
 * @param c - Hono request context with JSON body.
 * @returns 200 `{ success: true, action: "rescheduled" }` on success.
 * @returns 400 if validation fails.
 * @returns 403 if the email is not an attendee of the event.
 * @returns 409 if the new time slot is already taken.
 */
export async function handleReschedule(c: Context) {
  const body = await c.req.json().catch(() => null);
  const result = validateRescheduleBody(body);

  if (result.error) {
    return c.json({ error: ErrorCode.VALIDATION, message: result.error }, HttpStatus.BAD_REQUEST);
  }

  const data = result.data;

  try {
    const outcome = await rescheduleBooking(data as RescheduleBookingParams);

    if ("error" in outcome) {
      if (outcome.error === ErrorCode.FORBIDDEN) {
        return c.json(
          { error: ErrorCode.FORBIDDEN, message: "Email is not an attendee of this event" },
          HttpStatus.FORBIDDEN,
        );
      }
      if (outcome.error === ErrorCode.SLOT_TAKEN) {
        return c.json({ error: ErrorCode.SLOT_TAKEN }, HttpStatus.CONFLICT);
      }
      return c.json({ error: outcome.error }, outcome.status as 400);
    }

    return c.json({ success: true, action: "rescheduled" });
  } catch (err: unknown) {
    console.error("[reschedule] Error:", getErrorMessage(err));
    return c.json({ error: ErrorCode.SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

/**
 * Handles GET /api/availability.
 *
 * Accepts `from` and `to` query parameters (YYYY-MM-DD) and returns available
 * 30-minute booking slots grouped by date, excluding busy periods from
 * Google Calendar and respecting business hours.
 *
 * @param c - Hono request context with `from` and `to` query params.
 * @returns 200 `{ slots: Record<string, string[]> }` with ISO datetime strings.
 * @returns 400 if query params are missing or the range exceeds 45 days.
 */
export async function handleAvailability(c: Context) {
  const from = c.req.query("from");
  const to = c.req.query("to");
  const result = validateAvailabilityQuery(from, to);

  if (!result.data) {
    return c.json({ error: ErrorCode.VALIDATION, message: result.error ?? "Invalid query" }, HttpStatus.BAD_REQUEST);
  }

  const { from: validFrom, to: validTo } = result.data;

  try {
    const slots = await getAvailability(validFrom, validTo);
    return c.json({ slots });
  } catch (err: unknown) {
    console.error("[availability] Error:", getErrorMessage(err));
    return c.json({ error: ErrorCode.SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
