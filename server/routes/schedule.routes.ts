import { Hono } from "hono";
import {
  handleSchedule,
  handleReschedule,
  handleAvailability,
  handleOAuthStart,
  handleOAuthCallback,
  handleOAuthStatus,
} from "../controllers/index.js";

/** Hono route group for scheduling, availability, and OAuth endpoints. */
export const scheduleRoutes = new Hono();

scheduleRoutes.post("/schedule", handleSchedule);
scheduleRoutes.post("/reschedule", handleReschedule);
scheduleRoutes.get("/availability", handleAvailability);
scheduleRoutes.get("/oauth/google/start", handleOAuthStart);
scheduleRoutes.get("/oauth/google/callback", handleOAuthCallback);
scheduleRoutes.get("/oauth/google/status", handleOAuthStatus);
