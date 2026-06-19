import { EMAIL_PATTERN } from "../config/constants.js";
import { WAITLIST_AGE_ENTRIES, MAX_CHILD_AGES } from "../config/waitlist.js";

export interface WaitlistBody {
  email: string;
  childAges: number[];
}

export type WaitlistValidationResult =
  | { data: WaitlistBody; error?: never }
  | { data?: never; error: string };

export function validateWaitlistBody(body: unknown): WaitlistValidationResult {
  if (!body || typeof body !== "object") return { error: "Solicitud inválida" };

  const raw = body as Record<string, unknown>;
  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  if (!email || !EMAIL_PATTERN.test(email)) return { error: "Debe ingresar un correo electrónico válido" };

  const rawAges = Array.isArray(raw.childAges) ? raw.childAges : [];
  const childAges = [
    ...new Set(
      rawAges.filter((age): age is number => typeof age === "number" && Number.isInteger(age)),
    ),
  ];

  if (childAges.length === 0) return { error: "Se requiere al menos una edad de niño" };
  if (childAges.length > MAX_CHILD_AGES) return { error: "Demasiadas edades de niños" };
  if (!childAges.every((age) => age in WAITLIST_AGE_ENTRIES)) return { error: "Edad de niño inválida" };

  return { data: { email, childAges } };
}
