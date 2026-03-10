import { handle } from "hono/vercel";
import app from "./_lib/app.js";

console.log("[api] Function module loaded");

export default handle(app);
