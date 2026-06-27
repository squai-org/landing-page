import type { MiddlewareHandler } from "hono";
import { RATE_WINDOW_MS, RATE_MAX, RATE_CLEANUP_INTERVAL_MS, ErrorCode, HttpStatus } from "../config/constants.js";

interface RateBucket {
  windowMs: number;
  max: number;
  hits: Map<string, { count: number; resetAt: number }>;
}

/** Every bucket is registered here so a single cleanup pass can sweep them all. */
const buckets: RateBucket[] = [];

function clientIp(forwarded?: string, realIp?: string): string {
  return forwarded?.split(",")[0]?.trim() || realIp || "unknown";
}

/**
 * Builds an IP-based rate limiter with its own independent bucket. Separate
 * buckets let cheap form routes and the expensive LLM agent route be limited
 * independently (one route's traffic never consumes another's budget).
 */
export function createRateLimiter(
  max = RATE_MAX,
  windowMs = RATE_WINDOW_MS,
): MiddlewareHandler {
  const bucket: RateBucket = { windowMs, max, hits: new Map() };
  buckets.push(bucket);

  return async (c, next) => {
    const ip = clientIp(c.req.header("x-forwarded-for"), c.req.header("x-real-ip"));
    const now = Date.now();
    const entry = bucket.hits.get(ip);

    if (!entry || now > entry.resetAt) {
      bucket.hits.set(ip, { count: 1, resetAt: now + windowMs });
    } else {
      entry.count++;
      if (entry.count > max) {
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
}

/** Global IP-based limiter ({@link RATE_MAX} requests per {@link RATE_WINDOW_MS} window). */
export const rateLimiter: MiddlewareHandler = createRateLimiter();

/** Starts a periodic cleanup of expired rate limit entries across all buckets. */
export function startRateLimitCleanup(intervalMs = RATE_CLEANUP_INTERVAL_MS): NodeJS.Timeout {
  return setInterval(() => {
    const now = Date.now();
    for (const bucket of buckets) {
      for (const [k, v] of bucket.hits) {
        if (now > v.resetAt) bucket.hits.delete(k);
      }
    }
  }, intervalMs);
}
