import { handle } from "@hono/node-server/vercel";
import app from "./_lib/app.js";

console.log("[api] Function module loaded");

export default handle(app);
