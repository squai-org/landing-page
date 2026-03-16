/** Canonical site URL used in Open Graph and structured data. */
export const SITE_URL = "https://heysquai.vercel.app";

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
  description: "AI implementation consultancy for growing teams in Latin America",
  url: SITE_URL,
  areaServed: "Latin America",
  availableLanguage: ["Spanish", "English"],
} as const;
