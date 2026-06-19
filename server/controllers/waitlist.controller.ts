import type { Context } from "hono";
import { validateWaitlistBody } from "../validators/index.js";
import { submitWaitlistToGoogleForm } from "../services/index.js";
import { HttpStatus, ErrorCode } from "../config/constants.js";
import { getErrorMessage } from "../utils/index.js";

/**
 * Handles POST /api/waitlist.
 *
 * Validates the request body and forwards the signup to the Google Form
 * backing the Teo waitlist.
 *
 * @param c - Hono request context with JSON body.
 * @returns 200 `{ success: true }` on success.
 * @returns 400 if validation fails.
 * @returns 500 if the Google Form submission fails.
 */
export async function handleWaitlist(c: Context) {
  const body = await c.req.json().catch(() => null);
  const result = validateWaitlistBody(body);

  if (result.error) {
    return c.json({ error: ErrorCode.VALIDATION, message: result.error }, HttpStatus.BAD_REQUEST);
  }

  try {
    await submitWaitlistToGoogleForm(result.data.email, result.data.childAges);
    return c.json({ success: true });
  } catch (err: unknown) {
    console.error("[waitlist] Error:", getErrorMessage(err));
    return c.json({ error: ErrorCode.SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
