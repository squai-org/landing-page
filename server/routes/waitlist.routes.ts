import { Hono } from "hono";
import { handleWaitlist } from "../controllers/index.js";

export const waitlistRoutes = new Hono();

waitlistRoutes.post("/waitlist", handleWaitlist);
