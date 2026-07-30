/** Default WhatsApp Cloud API (Graph API) version. */
const DEFAULT_WHATSAPP_API_VERSION = "v25.0";

/** Maximum number of processed message IDs kept in memory for webhook deduplication. */
export const WHATSAPP_DEDUPE_MAX = 1000;

/** Returns the token used to answer Meta's webhook verification handshake, or empty string if not configured. */
export function getWhatsAppVerifyToken(): string {
  return process.env.WHATSAPP_VERIFY_TOKEN?.trim() ?? "";
}

/** Returns the permanent System User access token for the Cloud API, or empty string if not configured. */
export function getWhatsAppAccessToken(): string {
  return process.env.WHATSAPP_ACCESS_TOKEN?.trim() ?? "";
}

/** Returns the Meta app secret used to validate webhook payload signatures, or empty string if not configured. */
export function getWhatsAppAppSecret(): string {
  return process.env.WHATSAPP_APP_SECRET?.trim() ?? "";
}

/** Returns the business phone number ID that sends messages, or empty string if not configured. */
export function getWhatsAppPhoneNumberId(): string {
  return process.env.WHATSAPP_PHONE_NUMBER_ID?.trim() ?? "";
}

/** Returns the Graph API version to use for Cloud API calls. */
export function getWhatsAppApiVersion(): string {
  return process.env.WHATSAPP_API_VERSION?.trim() || DEFAULT_WHATSAPP_API_VERSION;
}

/** Builds the Cloud API messages endpoint URL for the configured phone number. */
export function getWhatsAppMessagesUrl(): string {
  return `https://graph.facebook.com/${getWhatsAppApiVersion()}/${getWhatsAppPhoneNumberId()}/messages`;
}
