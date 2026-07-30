import { Hono } from "hono";
import { handleWhatsAppVerification, handleWhatsAppWebhook } from "../controllers/index.js";

export const whatsappRoutes = new Hono();

whatsappRoutes.get("/whatsapp/webhook", handleWhatsAppVerification);
whatsappRoutes.post("/whatsapp/webhook", handleWhatsAppWebhook);
