import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";

const currentDir = dirname(fileURLToPath(import.meta.url));
const rootEnvPath = resolve(currentDir, "..", ".env");
const apiEnvPath = resolve(currentDir, "..", "api", ".env");

if (existsSync(rootEnvPath)) {
  loadEnv({ path: rootEnvPath, override: false });
} else if (existsSync(apiEnvPath)) {
  loadEnv({ path: apiEnvPath, override: false });
} else {
  loadEnv();
}

const { default: app } = await import("./app.js");
const { startRateLimitCleanup } = await import("./middleware/index.js");

const { serve } = await import("@hono/node-server");
const port = Number.parseInt(process.env.PORT ?? "3001", 10);

startRateLimitCleanup();

serve({ fetch: app.fetch, port }, () => {
  console.log(`API server running on port ${port}`);
});
