/** Incoming message object inside a WhatsApp webhook notification. */
export interface WhatsAppIncomingMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: { body: string };
}

/** `value` object of a webhook change. Incoming messages carry `messages`; delivery receipts carry `statuses`. */
export interface WhatsAppChangeValue {
  messaging_product: string;
  metadata: { display_phone_number: string; phone_number_id: string };
  contacts?: { profile: { name: string }; wa_id: string }[];
  messages?: WhatsAppIncomingMessage[];
  statuses?: unknown[];
}

/** Top-level WhatsApp webhook notification payload. */
export interface WhatsAppWebhookPayload {
  object: string;
  entry?: {
    id: string;
    changes?: { field: string; value: WhatsAppChangeValue }[];
  }[];
}
