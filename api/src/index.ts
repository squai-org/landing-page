import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { scheduleRoute } from "./schedule.js";

const app = new Hono();

// CORS — allow the landing page origin (configurable via env)
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "http://localhost:8080")
  .split(",")
  .map((o) => o.trim());

app.use(
  "/api/*",
  cors({
    origin: allowedOrigins,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    maxAge: 86400,
  }),
);

// ── Rate limiter (in-memory, per IP) ────────────────────────────────────
const RATE_WINDOW_MS = 60_000; // 1 minute
const RATE_MAX = 10; // max requests per window
const hits = new Map<string, { count: number; resetAt: number }>();

app.use("/api/*", async (c, next) => {
  const ip = c.req.header("x-forwarded-for")?.split(",")[0]?.trim()
    || c.req.header("x-real-ip")
    || "unknown";
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
  } else {
    entry.count++;
    if (entry.count > RATE_MAX) {
      c.header("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
      return c.json({ error: "rate_limit", message: "Too many requests. Please try again later." }, 429);
    }
  }

  await next();
});

// Periodic cleanup of expired entries (every 5 min)
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of hits) {
    if (now > v.resetAt) hits.delete(k);
  }
}, 300_000);

app.route("/api", scheduleRoute);

app.get("/health", (c) => c.json({ status: "ok" }));

const port = parseInt(process.env.PORT ?? "3001", 10);

serve({ fetch: app.fetch, port }, () => {
  console.log(`API server running on http://localhost:${port}`);
});

export default app;
