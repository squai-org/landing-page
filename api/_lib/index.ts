import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";

// Load .env BEFORE importing app — ES module imports run eagerly,
// so env vars must be populated before any module reads them.
const currentDir = dirname(fileURLToPath(import.meta.url));
const apiEnvPath = resolve(currentDir, "..", ".env");
if (existsSync(apiEnvPath)) {
  loadEnv({ path: apiEnvPath, override: false });
} else {
  loadEnv();
}

const { default: app } = await import("./app.js");

const { serve } = await import("@hono/node-server");
const port = Number.parseInt(process.env.PORT ?? "3001", 10);

serve({ fetch: app.fetch, port }, () => {
  console.log(`API server running on port ${port}`);
});
