/** Tool registry. Exposes schemas to providers and executors to the agent loop. */
import type { ToolDefinition, ToolSchema } from "../types.js";
import { getAvailabilityTool } from "./get-availability.js";
import { scheduleCallTool } from "./schedule-call.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TOOLS: Record<string, ToolDefinition<any>> = {
  [getAvailabilityTool.schema.name]: getAvailabilityTool,
  [scheduleCallTool.schema.name]: scheduleCallTool,
};

export function getToolSchemas(): ToolSchema[] {
  return Object.values(TOOLS).map((t) => t.schema);
}

export { getAvailabilityTool, scheduleCallTool };
