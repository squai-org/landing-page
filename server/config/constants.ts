/** Standard HTTP status codes used in API responses. */
export const HttpStatus = {
  OK: 200,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/** Domain-specific error codes returned in API error payloads. */
export const ErrorCode = {
  VALIDATION: "validation",
  SLOT_TAKEN: "slot_taken",
  FORBIDDEN: "forbidden",
  CALENDAR_PERMISSION: "calendar_permission",
  SERVER_ERROR: "server_error",
  OAUTH_ERROR: "oauth_error",
  OAUTH_NOT_CONFIGURED: "oauth_not_configured",
  OAUTH_EXCHANGE_FAILED: "oauth_exchange_failed",
  MISSING_REFRESH_TOKEN: "missing_refresh_token",
  NOT_FOUND: "not_found",
  RATE_LIMIT: "rate_limit",
} as const;

/** Rate limit window duration in milliseconds. */
export const RATE_WINDOW_MS = 60_000;
/** Maximum requests allowed per rate limit window. */
export const RATE_MAX = 10;
/** Interval in milliseconds between rate limit map cleanups. */
export const RATE_CLEANUP_INTERVAL_MS = 300_000;

/** Maps supported language codes to ICU locale identifiers. */
export const INTL_LOCALE: Record<string, string> = {
  es: "es-CO",
  en: "en-US",
} as const;

/** Validates basic email format. */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Matches HTML tags for input sanitization. */
export const HTML_TAG_PATTERN = /<[^>]*>/g;
/** Validates Google Calendar event ID format (5-1024 alphanumeric chars). */
export const EVENT_ID_PATTERN = /^[a-z0-9]{5,1024}$/i;
/** Validates YYYY-MM-DD date format. */
export const DATE_FORMAT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
