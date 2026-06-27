/**
 * Prompt-injection guard.
 *
 * A fast, deterministic first line of defense that runs BEFORE any model call.
 * It scores the user input against known injection/jailbreak signals and against
 * attempts to exfiltrate the system prompt or smuggle off-domain URLs. When it
 * fires, the agent short-circuits with a safe canned reply and never reaches the
 * model — which makes the security posture independent of the model in use.
 */

export interface InjectionResult {
  isInjection: boolean;
  /** 0..1 confidence that the input is an attack. */
  confidence: number;
  matchedPatterns: string[];
}

interface Signal {
  id: string;
  pattern: RegExp;
  weight: number;
}

/** Instruction-override / jailbreak signals. */
const INSTRUCTION_SIGNALS: Signal[] = [
  { id: "ignore-previous", pattern: /\b(ignore|disregard|forget)\b[^.]{0,40}\b(previous|prior|above|earlier|all)\b[^.]{0,20}\b(instructions?|prompts?|rules?|messages?)\b/i, weight: 0.7 },
  { id: "override-instructions", pattern: /\b(override|bypass|disable|turn off)\b[^.]{0,30}\b(instructions?|rules?|guardrails?|safety|filters?|restrictions?)\b/i, weight: 0.7 },
  { id: "new-instructions", pattern: /\b(new|updated|real|actual)\b[^.]{0,15}\b(instructions?|rules?|system prompt|directive)\b/i, weight: 0.5 },
  { id: "you-are-now", pattern: /\byou are now\b|\bfrom now on you\b|\bact as\b[^.]{0,30}\b(dan|jailbreak|developer mode|unrestricted)\b/i, weight: 0.6 },
  { id: "developer-mode", pattern: /\b(developer mode|jailbreak|dan mode|do anything now|sudo mode|god mode)\b/i, weight: 0.7 },
  { id: "pretend-roleplay", pattern: /\b(pretend|imagine|roleplay|simulate)\b[^.]{0,30}\b(no (rules|restrictions|limits|filters)|unrestricted|without (any )?(rules|limits|restrictions))\b/i, weight: 0.6 },
  // Spanish instruction-override signals (the site is bilingual).
  { id: "ignore-previous-es", pattern: /\b(ignora|ignorá|olvida|olvidá|descarta|desestima|haz caso omiso)\b[^.]{0,40}\b(anterior(es)?|previo|previas?|pasadas?|todas?)\b[^.]{0,20}\b(instruccion(es)?|reglas?|mensajes?|indicaciones?|[oó]rdenes)\b/i, weight: 0.7 },
  { id: "override-es", pattern: /\b(anula|ignora|desactiva|salta|salt[aá]te|omite)\b[^.]{0,30}\b(reglas?|restriccion(es)?|filtros?|l[ií]mites?|seguridad|instruccion(es)?)\b/i, weight: 0.7 },
  { id: "developer-mode-es", pattern: /\b(modo desarrollador|modo dios|modo dan|sin restricciones|sin filtros|sin reglas|sin l[ií]mites)\b/i, weight: 0.6 },
  { id: "roleplay-es", pattern: /\b(act[uú]a como|haz de|finge ser|imagina que eres)\b[^.]{0,30}\b(dan|sin (reglas|restricciones|l[ií]mites|filtros)|ilimitad|no restringid)\w*/i, weight: 0.6 },
];

/** System-prompt / secret exfiltration signals. */
const EXFIL_SIGNALS: Signal[] = [
  { id: "reveal-system-prompt", pattern: /\b(reveal|show|print|repeat|display|output|give me|tell me|reprint|echo)\b[^.]{0,40}\b(system prompt|system message|initial (prompt|instructions?)|your (prompt|instructions?|rules?|guidelines?)|prompt above)\b/i, weight: 0.8 },
  { id: "what-are-instructions", pattern: /\bwhat (are|were) your\b[^.]{0,20}\b(instructions?|rules?|system prompt|guidelines?|directives?)\b/i, weight: 0.6 },
  { id: "verbatim", pattern: /\b(verbatim|word for word|exactly as written|in full)\b[^.]{0,30}\b(prompt|instructions?|message)\b/i, weight: 0.6 },
  { id: "leak-secrets", pattern: /\b(api[_ -]?key|secret|password|token|credentials?|env(ironment)? variables?)\b/i, weight: 0.5 },
  { id: "repeat-everything-above", pattern: /\brepeat\b[^.]{0,20}\b(everything|all)\b[^.]{0,15}\babove\b/i, weight: 0.7 },
  { id: "reveal-system-prompt-es", pattern: /\b(revela|revel[aá]me|muestra|mu[eé]strame|imprime|impr[ií]meme|repite|dime|comparte|ens[eé][nñ]ame)\b[^.]{0,40}\b(system prompt|prompt(\s+del\s+sistema)?|sistema|instruccion(es)?|reglas?|configuraci[oó]n|directrices)\b/i, weight: 0.8 },
  { id: "leak-secrets-es", pattern: /\b(clave|contrase[nñ]a|secreto|credencial(es)?|variables? de entorno)\b/i, weight: 0.5 },
];

/** Off-domain URL injection (asking the agent to push external links/redirects). */
const URL_SIGNALS: Signal[] = [
  { id: "off-domain-url", pattern: /https?:\/\/(?!(?:[a-z0-9-]+\.)*squai\.(?:io|co)\b)[a-z0-9.-]+/i, weight: 0.4 },
  { id: "link-injection", pattern: /\b(send|share|post|click|visit|go to|redirect (me )?to)\b[^.]{0,20}https?:\/\//i, weight: 0.3 },
];

const ALL_SIGNALS = [...INSTRUCTION_SIGNALS, ...EXFIL_SIGNALS, ...URL_SIGNALS];

const THRESHOLD = 0.5;

/** Scans a single user message for injection signals. */
export function detectInjection(input: string): InjectionResult {
  const text = (input ?? "").slice(0, 4000);
  const matched: string[] = [];
  let score = 0;

  for (const signal of ALL_SIGNALS) {
    if (signal.pattern.test(text)) {
      matched.push(signal.id);
      score += signal.weight;
    }
  }

  const confidence = Math.min(1, score);
  return {
    isInjection: confidence >= THRESHOLD,
    confidence,
    matchedPatterns: matched,
  };
}

/** Safe reply returned when an injection attempt is blocked. Never leaks rules. */
export function safeRefusal(lang: "en" | "es" = "en"): string {
  return lang === "es"
    ? "Estoy aquí para ayudarte con preguntas sobre Squai y para agendar una llamada gratuita. ¿En qué te puedo ayudar con eso?"
    : "I'm here to help with questions about Squai and to book a free call. How can I help you with that?";
}
