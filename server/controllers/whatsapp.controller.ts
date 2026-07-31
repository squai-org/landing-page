import type { Context } from "hono";
import { HttpStatus, ErrorCode } from "../config/constants.js";
import {
  getWhatsAppVerifyToken,
  getWhatsAppAppSecret,
  WHATSAPP_DEDUPE_MAX,
} from "../config/whatsapp.js";
import { verifyWhatsAppSignature, sendWhatsAppTextMessage } from "../services/index.js";
import { getErrorMessage } from "../utils/index.js";
import type { WhatsAppIncomingMessage, WhatsAppWebhookPayload } from "../types/index.js";

/**
 * Message IDs already processed, to absorb Meta's webhook redeliveries.
 * In-memory only: serverless cold starts reset it, which is acceptable
 * because replies are idempotent in practice.
 */
const processedMessageIds = new Set<string>();

function markProcessed(id: string): void {
  if (processedMessageIds.size >= WHATSAPP_DEDUPE_MAX) {
    const oldest = processedMessageIds.values().next().value;
    if (oldest) processedMessageIds.delete(oldest);
  }
  processedMessageIds.add(id);
}

/** Flattens all incoming messages out of a webhook payload, ignoring status-only notifications. */
function extractIncomingMessages(payload: WhatsAppWebhookPayload): WhatsAppIncomingMessage[] {
  return (payload.entry ?? [])
    .flatMap((entry) => entry.changes ?? [])
    .filter((change) => change.field === "messages")
    .flatMap((change) => change.value.messages ?? []);
}

/**
 * Handles GET /api/whatsapp/webhook — Meta's webhook verification handshake.
 *
 * Meta calls this once when the callback URL is saved in the App Dashboard,
 * sending `hub.mode=subscribe`, `hub.verify_token` and `hub.challenge`.
 *
 * @param c - Hono request context with the `hub.*` query params.
 * @returns 200 with the raw `hub.challenge` value when the token matches.
 * @returns 403 if the token does not match or the endpoint is not configured.
 */
export function handleWhatsAppVerification(c: Context) {
  const mode = c.req.query("hub.mode");
  const token = c.req.query("hub.verify_token");
  const challenge = c.req.query("hub.challenge");
  const verifyToken = getWhatsAppVerifyToken();

  if (mode === "subscribe" && verifyToken && token === verifyToken && challenge) {
    return c.text(challenge, HttpStatus.OK);
  }

  return c.json({ error: ErrorCode.FORBIDDEN }, HttpStatus.FORBIDDEN);
}

/**
 * Handles POST /api/whatsapp/webhook — incoming WhatsApp event notifications.
 *
 * Validates the `X-Hub-Signature-256` HMAC before trusting the payload, then
 * auto-replies to each new incoming text message. Always returns 200 for
 * authentic payloads so Meta does not retry or disable the subscription;
 * per-message send failures are logged instead of surfaced.
 *
 * @param c - Hono request context with the raw webhook body.
 * @returns 200 `{ success: true }` for authentic payloads.
 * @returns 401 if the signature is missing or invalid.
 * @returns 400 if the body is not valid JSON.
 * @returns 500 if WHATSAPP_APP_SECRET is not configured.
 */
export async function handleWhatsAppWebhook(c: Context) {
  const appSecret = getWhatsAppAppSecret();
  if (!appSecret) {
    console.error("[whatsapp] WHATSAPP_APP_SECRET env var is not set");
    return c.json({ error: ErrorCode.SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  const rawBody = await c.req.text();
  const signature = c.req.header("x-hub-signature-256");
  if (!verifyWhatsAppSignature(rawBody, signature, appSecret)) {
    return c.json({ error: ErrorCode.INVALID_SIGNATURE }, HttpStatus.UNAUTHORIZED);
  }

  let payload: WhatsAppWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as WhatsAppWebhookPayload;
  } catch {
    return c.json({ error: ErrorCode.VALIDATION }, HttpStatus.BAD_REQUEST);
  }

  for (const message of extractIncomingMessages(payload)) {
    if (processedMessageIds.has(message.id)) continue;
    markProcessed(message.id);

    if (message.type !== "text" || !message.text?.body) continue;

    try {
      await sendWhatsAppTextMessage(
        message.from,
        "Este es un bot para comunicaciones automáticas de los eventos de Squai. Si quieres conocer más de nosotros puedes visitar: https://www.squai.io/es o escribirnos a team@squai.io",
      );
    } catch (err: unknown) {
      console.error("[whatsapp] Reply failed:", getErrorMessage(err));
    }
  }

  return c.json({ success: true });
}
