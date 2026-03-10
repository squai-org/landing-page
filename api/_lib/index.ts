/**
 * Local development entry point.
 * Starts a persistent Node.js server with @hono/node-server.
 * On Vercel, the app is served via api/index.ts (serverless adapter).
 */
import "dotenv/config";
import { serve } from "@hono/node-server";
import app from "./app";

const port = parseInt(process.env.PORT ?? "3001", 10);

serve({ fetch: app.fetch, port }, () => {
  console.log(`API server running on http://localhost:${port}`);
});
