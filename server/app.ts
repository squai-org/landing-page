import { Hono } from "hono";
import { cors } from "hono/cors";
import { getAllowedOrigins } from "./config/env.js";
import { rateLimiter } from "./middleware/index.js";
import { scheduleRoutes } from "./routes/index.js";
import { HttpStatus, ErrorCode } from "./config/constants.js";
import { getErrorMessage } from "./utils/index.js";

const app = new Hono();

const allowedOrigins = getAllowedOrigins();

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

app.use("*", rateLimiter);

app.route("/api", scheduleRoutes);

app.get("/health", (c) => c.json({ status: "ok" }));

app.all("*", (c) => c.json({ error: ErrorCode.NOT_FOUND }, HttpStatus.NOT_FOUND));

app.onError((err, c) => {
  console.error(
    "Unhandled error:",
    getErrorMessage(err),
  );
  return c.json({ error: ErrorCode.SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR);
});

export default app;
