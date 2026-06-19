export const SITE_URL = "https://teo.squai.io";
export const CONTACT_EMAIL = "teo@squai.io";
export const REVEAL_THRESHOLD = 0.1;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const WAITLIST_AGE_OPTIONS = [6, 7, 8, 9, 10, 11] as const;
export const MAX_CHILD_AGES = 10;
export const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Teo",
  description:
    "Servicio de tutoría académica por WhatsApp para niños de 1° a 5° de primaria",
  url: SITE_URL,
  areaServed: "Colombia",
  availableLanguage: ["Spanish"],
  provider: {
    "@type": "Organization",
    name: "Squai S.A.S.",
    email: CONTACT_EMAIL,
  },
} as const;
