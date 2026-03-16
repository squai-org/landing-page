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

/** Handles POST /api/schedule — validates body and creates a calendar booking. */
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

/** Handles POST /api/reschedule — validates body and moves an existing event. */
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

/** Handles GET /api/availability — returns available slots for a date range. */
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
