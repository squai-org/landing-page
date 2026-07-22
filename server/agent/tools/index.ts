/** Tool registry. Exposes schemas to providers and executors to the agent loop. */
import type { ToolDefinition, ToolSchema } from "../types.js";
import { openSchedulingFormTool } from "./open-scheduling-form.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TOOLS: Record<string, ToolDefinition<any>> = {
  [openSchedulingFormTool.schema.name]: openSchedulingFormTool,
};

export function getToolSchemas(): ToolSchema[] {
  return Object.values(TOOLS).map((t) => t.schema);
}

export { openSchedulingFormTool };
