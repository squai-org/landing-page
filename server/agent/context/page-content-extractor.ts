/**
 * Landing knowledge extractor.
 *
 * Single source of truth for everything the chat agent knows about Squai.
 * It derives its facts directly from the localized landing copy in
 * `i18n/locales/*.json` — the exact same content rendered on the page — so the
 * agent can never drift from what visitors actually read. There is deliberately
 * no separate hand-maintained knowledge file.
 */
import en from "../../../i18n/locales/en.json" with { type: "json" };
import es from "../../../i18n/locales/es.json" with { type: "json" };

export type AgentLang = "en" | "es";

export interface KnowledgeService {
  /** Public product name, e.g. "Squai One". */
  name: string;
  /** Who the service is for. */
  audience: string;
  /** Headline price string as shown on the page. */
  price: string;
  /** Extra pricing nuance. */
  priceNote: string;
  /** Bullet points describing what the buyer gets. */
  highlights: string[];
}

export interface KnowledgeFaqItem {
  question: string;
  answer: string;
}

export interface LandingKnowledge {
  companyName: string;
  tagline: string;
  valueProposition: string;
  services: KnowledgeService[];
  faq: KnowledgeFaqItem[];
  ctaText: string;
  contactEmail: string;
  /** Booking constraints surfaced to the agent so it sets expectations. */
  booking: {
    slotMinutes: number;
    businessDays: string;
    timeRanges: string;
    note: string;
  };
}

type Locale = typeof en;

// `en` and `es` share a shape but TS infers them as distinct literal types, so a
// single widening cast here keeps the rest of the file cast-free and honest.
const LOCALES: Record<AgentLang, Locale> = { en, es: es as unknown as Locale };

function buildServices(locale: Locale): KnowledgeService[] {
  return locale.services.tiers.map((tier) => ({
    name: tier.name,
    audience: tier.partnership,
    price: [tier.pricePrefix, tier.price].filter(Boolean).join(" ").trim(),
    priceNote: tier.priceNote,
    highlights: tier.items,
  }));
}

/**
 * Static FAQ copy that has no dedicated section in the localized landing JSON.
 * Kept per-language so the Spanish system prompt is grounded in Spanish text
 * (the dynamic process/different entries already come from the localized copy).
 */
const STATIC_FAQ: Record<AgentLang, Record<"tech" | "free" | "teams" | "sessions", KnowledgeFaqItem>> = {
  en: {
    tech: {
      question: "Do I need a technical background or coding skills?",
      answer:
        "No. Squai teaches AI in plain language, applied to your real work — no code and no jargon. You just need to know your own job; we take it from there.",
    },
    free: {
      question: "Is the first call really free?",
      answer:
        "Yes. The diagnostic (discovery) call is free, with no commitment. We use it to understand how you work and recommend the right service.",
    },
    teams: {
      question: "Do you work with teams and institutions, not just individuals?",
      answer:
        "Yes. Squai One is for individual professionals, Squai Grow is for groups and teams, and Squai Learn is for schools and universities.",
    },
    sessions: {
      question: "Are sessions virtual or in person?",
      answer:
        "Both. Sessions are virtual or in person in select cities, depending on the program and your group's needs.",
    },
  },
  es: {
    tech: {
      question: "¿Necesito conocimientos técnicos o saber programar?",
      answer:
        "No. Squai enseña IA en lenguaje sencillo, aplicada a tu trabajo real — sin código ni tecnicismos. Solo necesitas conocer tu propio trabajo; del resto nos encargamos nosotros.",
    },
    free: {
      question: "¿La primera llamada es realmente gratis?",
      answer:
        "Sí. La llamada de diagnóstico (descubrimiento) es gratuita y sin compromiso. La usamos para entender cómo trabajas y recomendarte el servicio adecuado.",
    },
    teams: {
      question: "¿Trabajan con equipos e instituciones, no solo con personas?",
      answer:
        "Sí. Squai One es para profesionales individuales, Squai Grow es para grupos y equipos, y Squai Learn es para colegios y universidades.",
    },
    sessions: {
      question: "¿Las sesiones son virtuales o presenciales?",
      answer:
        "Ambas. Las sesiones son virtuales o presenciales en ciudades selectas, según el programa y las necesidades de tu grupo.",
    },
  },
};

/** Localized question labels for the entries whose answers come from the page copy. */
const DYNAMIC_FAQ_LABELS: Record<AgentLang, Record<"process" | "different", string>> = {
  en: {
    process: "How does it work / what is the process?",
    different: "What makes Squai different?",
  },
  es: {
    process: "¿Cómo funciona / cuál es el proceso?",
    different: "¿Qué hace diferente a Squai?",
  },
};

/**
 * Synthesizes a short, localized FAQ. Static entries come from {@link STATIC_FAQ};
 * the "process" and "different" answers are derived from the page's own localized
 * "how it works" and "why" sections so the agent never invents facts or drifts
 * from what visitors actually read.
 */
function buildFaq(locale: Locale, lang: AgentLang): KnowledgeFaqItem[] {
  const stat = STATIC_FAQ[lang];
  const labels = DYNAMIC_FAQ_LABELS[lang];
  return [
    stat.tech,
    {
      question: labels.process,
      answer: locale.howItWorks.steps.map((s) => `${s.name}: ${s.description}`).join(" "),
    },
    stat.free,
    stat.teams,
    stat.sessions,
    {
      question: labels.different,
      answer: locale.whySquai.items.map((i) => `${i.title}: ${i.desc}`).join(" "),
    },
  ];
}

const KNOWLEDGE: Record<AgentLang, LandingKnowledge> = {
  en: {
    companyName: "Squai",
    tagline: LOCALES.en.hero.headline,
    valueProposition: LOCALES.en.hero.sub,
    services: buildServices(LOCALES.en),
    faq: buildFaq(LOCALES.en, "en"),
    ctaText: LOCALES.en.ctaSection.cta,
    contactEmail: LOCALES.en.footer.email,
    booking: {
      slotMinutes: 30,
      businessDays: "Monday to Friday",
      timeRanges: "9:00–12:00 and 14:00–17:00 (America/Bogota)",
      note: "Free 30-minute diagnostic call.",
    },
  },
  es: {
    companyName: "Squai",
    tagline: LOCALES.es.hero.headline,
    valueProposition: LOCALES.es.hero.sub,
    services: buildServices(LOCALES.es),
    faq: buildFaq(LOCALES.es, "es"),
    ctaText: LOCALES.es.ctaSection.cta,
    contactEmail: LOCALES.es.footer.email,
    booking: {
      slotMinutes: 30,
      businessDays: "lunes a viernes",
      timeRanges: "9:00–12:00 y 14:00–17:00 (America/Bogota)",
      note: "Llamada de diagnóstico gratis de 30 minutos.",
    },
  },
};

/** Returns the landing knowledge base for the requested language (defaults to English). */
export function getLandingKnowledge(lang: AgentLang = "en"): LandingKnowledge {
  return KNOWLEDGE[lang] ?? KNOWLEDGE.en;
}
