import { Hono } from "hono";
import { cors } from "hono/cors";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { scheduleRoute } from "./schedule.js";

const app = new Hono();

const currentDir = dirname(fileURLToPath(import.meta.url));
const apiEnvPath = resolve(currentDir, "..", ".env");
if (existsSync(apiEnvPath)) {
  loadEnv({ path: apiEnvPath, override: false });
} else {
  loadEnv();
}

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

if (allowedOrigins.length > 0) {
  app.use(
    "*",
    cors({
      origin: allowedOrigins,
      allowMethods: ["GET", "POST", "OPTIONS"],
      allowHeaders: ["Content-Type"],
      maxAge: 86400,
    }),
  );
}

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 10;
const hits = new Map<string, { count: number; resetAt: number }>();

app.use("*", async (c, next) => {
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

app.all("*", (c) => {
  return c.json({ error: "not_found" }, 404);
});


app.onError((err, c) => {
  console.error("Unhandled error:", err instanceof Error ? err.message : "unknown");
  return c.json({ error: "server_error" }, 500);
});

export default app;
