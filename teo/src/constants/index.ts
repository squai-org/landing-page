export const SITE_URL = "https://teo.squai.io";
export const CONTACT_EMAIL = "teo@squai.io";
export const REVEAL_THRESHOLD = 0.1;
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
