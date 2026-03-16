import type { MiddlewareHandler } from "hono";
import { RATE_WINDOW_MS, RATE_MAX, RATE_CLEANUP_INTERVAL_MS, ErrorCode, HttpStatus } from "../config/constants.js";

const hits = new Map<string, { count: number; resetAt: number }>();

/** IP-based rate limiter middleware ({@link RATE_MAX} requests per {@link RATE_WINDOW_MS} window). */
export const rateLimiter: MiddlewareHandler = async (c, next) => {
  const ip =
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
    c.req.header("x-real-ip") ||
    "unknown";
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
  } else {
    entry.count++;
    if (entry.count > RATE_MAX) {
      c.header("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
      return c.json(
        {
          error: ErrorCode.RATE_LIMIT,
          message: "Too many requests. Please try again later.",
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  await next();
};

/** Starts a periodic cleanup of expired rate limit entries. */
export function startRateLimitCleanup(intervalMs = RATE_CLEANUP_INTERVAL_MS): NodeJS.Timeout {
  return setInterval(() => {
    const now = Date.now();
    for (const [k, v] of hits) {
      if (now > v.resetAt) hits.delete(k);
    }
  }, intervalMs);
}
