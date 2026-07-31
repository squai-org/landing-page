import { createHmac, timingSafeEqual } from "node:crypto";
import {
  getWhatsAppAccessToken,
  getWhatsAppMessagesUrl,
} from "../config/whatsapp.js";

const SIGNATURE_PREFIX = "sha256=";

/**
 * Validates a webhook payload against Meta's `X-Hub-Signature-256` header.
 *
 * Meta signs the raw request body with HMAC SHA-256 using the app secret and
 * sends the hex digest prefixed with `sha256=`.
 *
 * @param rawBody - Raw request body exactly as received (before JSON parsing).
 * @param signatureHeader - Value of the `X-Hub-Signature-256` header.
 * @param appSecret - Meta app secret used as HMAC key.
 * @returns true if the signature is present and matches the payload.
 */
export function verifyWhatsAppSignature(
  rawBody: string,
  signatureHeader: string | undefined,
  appSecret: string,
): boolean {
  if (!signatureHeader?.startsWith(SIGNATURE_PREFIX)) return false;

  const received = signatureHeader.slice(SIGNATURE_PREFIX.length);
  const expected = createHmac("sha256", appSecret).update(rawBody, "utf-8").digest("hex");

  const receivedBuf = Buffer.from(received, "utf-8");
  const expectedBuf = Buffer.from(expected, "utf-8");
  if (receivedBuf.length !== expectedBuf.length) return false;

  return timingSafeEqual(receivedBuf, expectedBuf);
}

/**
 * Sends a free-form text message through the WhatsApp Cloud API.
 *
 * Free-form messages are only delivered inside the 24-hour customer service
 * window opened by the recipient's last message; outside it Meta requires an
 * approved template message.
 *
 * @param to - Recipient WhatsApp phone number (`wa_id`/`from` value from the webhook).
 * @param body - Plain text message content.
 * @returns The WhatsApp message ID assigned to the outbound message.
 * @throws {Error} If the Cloud API responds with a non-2xx status.
 */
export async function sendWhatsAppTextMessage(to: string, body: string): Promise<string> {
  const response = await fetch(getWhatsAppMessagesUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getWhatsAppAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { body },
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`WhatsApp send failed with status ${response.status}: ${detail}`);
  }

  const result = (await response.json()) as { messages?: { id: string }[] };
  return result.messages?.[0]?.id ?? "";
}
