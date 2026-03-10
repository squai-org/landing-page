import { Hono } from "hono";
import { cors } from "hono/cors";
import { scheduleRoute } from "./schedule.js";

const app = new Hono();

// CORS — only needed when frontend runs on a different origin (local dev).
// On Vercel the API is same-origin, so CORS headers are unnecessary.
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

if (allowedOrigins.length > 0) {
  app.use(
    "/api/*",
    cors({
      origin: allowedOrigins,
      allowMethods: ["GET", "POST", "OPTIONS"],
      allowHeaders: ["Content-Type"],
      maxAge: 86400,
    }),
  );
}

// ── Rate limiter (in-memory, per IP) ────────────────────────────────────
// Note: effective for long-running servers (local dev). On serverless each
// invocation may be a new instance, so this won't enforce limits reliably.
const RATE_WINDOW_MS = 60_000; // 1 minute
const RATE_MAX = 10; // max requests per window
const hits = new Map<string, { count: number; resetAt: number }>();

app.use("/api/*", async (c, next) => {
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
        { error: "rate_limit", message: "Too many requests. Please try again later." },
        429,
      );
    }
  }

  await next();
});

// Periodic cleanup — only useful for long-running processes
if (!process.env.VERCEL) {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of hits) {
      if (now > v.resetAt) hits.delete(k);
    }
  }, 300_000);
}

app.route("/api", scheduleRoute);

app.get("/health", (c) => c.json({ status: "ok" }));

// Global error handler — ensures Vercel always gets a response
app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json({ error: "server_error" }, 500);
});

export default app;
