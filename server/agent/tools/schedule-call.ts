/**
 * Tool: schedule_call
 *
 * WHAT:  Books the free 30-minute diagnostic call on a chosen slot.
 * WHEN:  Call it only after the visitor has picked a specific slot (ISO from
 *        get_availability) AND given their name and email.
 * RETURNS: { success: true } on booking, or a structured error (e.g. slot taken,
 *        invalid email) so you can recover gracefully in conversation.
 * WHEN NOT: Don't call it speculatively, with a made-up time, or before you have
 *        name + email + a confirmed slot.
 */
import { createBooking, type CreateBookingParams } from "../../services/index.js";
import { EMAIL_PATTERN } from "../../config/constants.js";
import { BUSINESS_TZ } from "../../config/env.js";
import type { ToolDefinition } from "../types.js";
import { isCalendarConfigured } from "./availability-helpers.js";

interface ScheduleCallArgs {
  name?: string;
  email?: string;
  /** ISO datetime of the chosen slot (must come from get_availability). */
  datetime?: string;
  /** Optional short note about what the visitor wants help with. */
  description?: string;
  /** IANA timezone; defaults to business timezone. */
  timezone?: string;
}

export const scheduleCallTool: ToolDefinition<ScheduleCallArgs> = {
  schema: {
    name: "schedule_call",
    description:
      "Book the free 30-minute Squai diagnostic call. Only call after the user picked a specific slot (ISO datetime from get_availability) and gave their name and email. Returns success or a recoverable error.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Visitor's name." },
        email: { type: "string", description: "Visitor's email address." },
        datetime: {
          type: "string",
          description: "Chosen slot as an ISO datetime string from get_availability.",
        },
        description: {
          type: "string",
          description: "Short note about what they want help with (optional).",
        },
        timezone: {
          type: "string",
          description: "IANA timezone (optional, defaults to America/Bogota).",
        },
      },
      required: ["name", "email", "datetime"],
    },
  },
  async execute(args, ctx) {
    const { name, email, datetime } = args;

    if (!name || !email || !datetime) {
      return {
        success: false,
        error: "missing_fields",
        message: "Need name, email, and a chosen slot before booking.",
      };
    }
    if (!EMAIL_PATTERN.test(email)) {
      return {
        success: false,
        error: "invalid_email",
        message: "That email doesn't look valid — please double-check it.",
      };
    }

    const params: CreateBookingParams = {
      name,
      email,
      description: args.description ?? "",
      datetime,
      timezone: args.timezone ?? BUSINESS_TZ,
      lang: ctx.lang,
    };

    // Offline / unconfigured environments: simulate a successful booking so the
    // conversational flow completes without a real calendar backend.
    if (!isCalendarConfigured()) {
      return {
        success: true,
        simulated: true,
        message: "Booking confirmed (no calendar backend configured).",
      };
    }

    try {
      const outcome = await createBooking(params);
      if ("error" in outcome) {
        console.error("[schedule_call] booking rejected:", outcome.error, outcome);
        const message =
          outcome.error === "slot_taken"
            ? "That slot was just taken — let's pick another."
            : "Couldn't complete the booking; please try again.";
        return { success: false, error: outcome.error, message };
      }
      return {
        success: true,
        message: "Booked! A confirmation email with the meeting link is on its way.",
      };
    } catch (err) {
      console.error("[schedule_call] booking threw:", err instanceof Error ? err.message : err);
      return {
        success: false,
        error: "server_error",
        message: "Something went wrong booking the call; please try again.",
      };
    }
  },
};
