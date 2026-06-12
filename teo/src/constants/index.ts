/** Canonical site URL used in Open Graph and structured data. */
export const SITE_URL = "https://teo.squai.co";

/** Contact email shown across the site. */
export const CONTACT_EMAIL = "teo@squai.co";

/** Intersection threshold that triggers scroll-based reveal animations. */
export const REVEAL_THRESHOLD = 0.1;

/** JSON-LD structured data for the main landing page. */
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
