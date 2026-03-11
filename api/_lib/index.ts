/**
 * Local development entry point.
 * Starts a persistent Node.js server with @hono/node-server.
 * On Vercel, the app is served via api/index.ts (serverless adapter).
 */
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { serve } from "@hono/node-server";
import app from "./app.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const apiEnvPath = resolve(currentDir, "..", ".env");
if (existsSync(apiEnvPath)) {
  loadEnv({ path: apiEnvPath, override: false });
} else {
  loadEnv();
}

const port = Number.parseInt(process.env.PORT ?? "3001", 10);

serve({ fetch: app.fetch, port }, () => {
  console.log(`API server running on http://localhost:${port}`);
});
