/**
 * Tool: get_availability
 *
 * WHAT:  Returns open 30-minute slots for the free diagnostic call.
 * WHEN:  Call it when the visitor is ready to see or pick times. Always call it
 *        before proposing any specific slot — never invent times.
 * RETURNS: A short list of concrete slots (ISO datetime + human label).
 * WHEN NOT: Don't call it for general questions, pricing, or before the visitor
 *        has shown interest in booking.
 */
import { getAvailability } from "../../services/index.js";
import type { ToolDefinition } from "../types.js";
import {
  fallbackSlots,
  formatSlots,
  isCalendarConfigured,
} from "./availability-helpers.js";

interface GetAvailabilityArgs {
  /** Start date YYYY-MM-DD. Defaults to today. */
  from?: string;
  /** End date YYYY-MM-DD. Defaults to ~2 weeks out. */
  to?: string;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateKey: string, days: number): string {
  const d = new Date(`${dateKey}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export const getAvailabilityTool: ToolDefinition<GetAvailabilityArgs> = {
  schema: {
    name: "get_availability",
    description:
      "Get open 30-minute slots for the free Squai diagnostic call. Call it with NO arguments — the date range is chosen automatically. Never ask the visitor for dates or a date format. Use before proposing any time. Returns a list of bookable ISO datetimes with friendly labels. Do not invent slots.",
    parameters: {
      type: "object",
      properties: {
        from: {
          type: "string",
          description:
            "Optional start date YYYY-MM-DD. Leave unset — defaults to today. Do not ask the visitor for it.",
        },
        to: {
          type: "string",
          description:
            "Optional end date YYYY-MM-DD. Leave unset — chosen automatically. Do not ask the visitor for it.",
        },
      },
      required: [],
    },
  },
  async execute(args, ctx) {
    const from = args.from ?? todayKey();
    const to = args.to ?? addDays(from, 14);

    let grouped: Record<string, string[]>;
    if (isCalendarConfigured()) {
      try {
        grouped = await getAvailability(from, to);
      } catch {
        grouped = fallbackSlots(from);
      }
    } else {
      grouped = fallbackSlots(from);
    }

    const slots = formatSlots(grouped, ctx.lang);
    return {
      count: slots.length,
      slots,
      message:
        slots.length > 0
          ? "Here are some open slots."
          : "No open slots in that range; suggest a different week.",
    };
  },
};
