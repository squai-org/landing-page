/**
 * Tool: open_scheduling_form
 *
 * WHAT:   Signals the UI to open the scheduling form (ContactModal) so the
 *         visitor can pick a date, time and enter their details themselves.
 * WHEN:   Call this whenever the visitor wants to book, schedule, or "agendar"
 *         the free call — instead of trying to collect the data in chat.
 * ARGS:   None. This tool only surfaces a UI signal.
 * RETURNS: { ok: true } — a marker for the agent loop, which emits an SSE
 *         "scheduling_form" event to the browser. The agent should follow up
 *         with one short sentence telling the visitor the form is now open.
 */
import type { ToolDefinition } from "../types.js";

export const openSchedulingFormTool: ToolDefinition<Record<string, never>> = {
  schema: {
    name: "open_scheduling_form",
    description:
      "Open the scheduling form on the page so the visitor can pick a date and time and enter their details. Call this whenever the visitor wants to book, schedule, or agendar the free call. Takes no arguments. After calling it, reply with one short sentence telling the visitor the booking form is now open.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  async execute() {
    return { ok: true };
  },
};
