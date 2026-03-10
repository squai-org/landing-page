import { handle } from "hono/vercel";
import app from "./_lib/app";

export default handle(app);
