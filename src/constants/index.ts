/** Canonical site URL used in Open Graph and structured data. */
export const SITE_URL = "https://squai.io";

/** Open Graph social share image URL. */
export const OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/YGktk21auYRi2XgzqQtnZjjqIc12/social-images/social-1772750720767-Squai_logo_(1).webp";

/** Validates basic email format for client-side form validation. */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Default framer-motion animation duration in seconds. */
export const ANIMATION_DURATION = 0.6;
/** Viewport margin offset for triggering scroll-based animations. */
export const ANIMATION_VIEWPORT_MARGIN = "-80px";
/** Scroll position in pixels that triggers the navbar compact style. */
export const SCROLL_THRESHOLD = 20;

/** JSON-LD structured data for the main landing page. */
export const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Squai",
  description:
    "Squai trains professionals and teams to use AI in their real work, with no code and no jargon. Services include 1:1 AI training, group training programs, and tailored AI training for schools and universities across Latin America.",
  url: SITE_URL,
  image: OG_IMAGE,
  email: "team@squai.io",
  areaServed: ["Latin America", "Colombia"],
  availableLanguage: ["Spanish", "English"],
  serviceType: ["AI training", "AI consulting"],
  knowsAbout: [
    "Artificial intelligence training",
    "AI consulting",
    "AI adoption for teams",
    "AI training for educational institutions",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "AI services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Squai One — 1:1 AI training for professionals",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Squai Grow — AI training programs for groups",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Squai Learn — AI training for schools and universities",
        },
      },
    ],
  },
} as const;
