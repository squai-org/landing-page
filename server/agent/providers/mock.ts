/**
 * Deterministic, offline provider.
 *
 * Implements the same ModelProvider interface as OmniRoute but needs no API key
 * or network. It uses simple intent routing over the conversation + landing
 * knowledge to (a) answer info questions, (b) trigger the on-page scheduling
 * form via the open_scheduling_form tool, and (c) decline off-topic / injection
 * requests. This makes the whole agent — and its eval — fully reproducible in
 * CI. The real OmniRoute provider takes over automatically when
 * OMNIROUTE_API_KEY is present.
 */
import {
  getLandingKnowledge,
  type AgentLang,
} from "../context/page-content-extractor.js";
import { detectLangFromText } from "../lang.js";
import type {
  ChatMessage,
  GenerateInput,
  ModelProvider,
  ModelResponse,
  ToolCall,
} from "../types.js";

// Booking requires an explicit booking verb/noun — NOT the bare word "call",
// which collides with info questions like "is the first call free?".
const BOOKING_INTENT =
  /\b(book|schedule|appointment|slots?|availabilit\w*|diagnostic|reserve|agendar|cita|reservar|disponib\w*|horario|programar)\b/i;
const OFF_TOPIC =
  /\b(weather|temperature|forecast|capital of|population of|currency of|recipe|cook|bake|stock price|stocks?|bitcoin|crypto|invest|homework|essay|assignment|translate|translation|write (me )?(a|an|some) (poem|code|story|essay|song|haiku|script|python|javascript|java|sql|rust|function|program)|football|soccer|basketball|nba|world cup|movie|film|netflix|tv show|joke|riddle|pun|lyrics|horoscope|who won|who is the president|when did|where is|how tall|how far|square root|derivative|integral|clima|receta|cocina|chiste|adivinanza|capital de|poblaci[oó]n de|traduce|tradúceme|escribe (un|una) (poema|c[oó]digo|cuento|historia|canci[oó]n|ensayo)|pel[ií]cula|deporte|f[uú]tbol|qui[eé]n gan[oó]|cu[aá]l es la capital)\b/i;
const PROMPT_LEAK =
  /\b(system prompt|your (instructions?|rules?|prompt)|reveal|repeat (everything|all)|api[_ -]?key|secret|password)\b/i;

const OFF_TOPIC_REPLY = {
  en: "That's a bit outside what I can help with — I'm the Squai assistant, focused on AI training and Squai's services. Anything I can help with there?",
  es: "Eso está un poco fuera de lo que puedo ayudarte — soy el asistente de Squai, enfocado en formación en IA y en los servicios de Squai. ¿Te ayudo con eso?",
} as const;

const PROMPT_LEAK_REPLY = {
  en: "I can't share my internal setup, but I'm happy to help with anything about Squai's services.",
  es: "No puedo compartir mi configuración interna, pero con gusto te ayudo con cualquier cosa de los servicios de Squai.",
} as const;

const FORM_OPENED_REPLY = {
  en: "I've opened the scheduling form for you — pick a time that works and it'll take it from there.",
  es: "Te abrí el formulario de agenda — elige el horario que te sirva y desde ahí continúa.",
} as const;

function lastUser(messages: ChatMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i].content ?? "";
  }
  return "";
}

function hasToolResult(messages: ChatMessage[], name: string): boolean {
  return messages.some((m) => m.role === "tool" && m.name === name);
}

function answerInfo(text: string, lang: AgentLang): string {
  const k = getLandingKnowledge(lang);
  const t = text.toLowerCase();
  const es = lang === "es";

  if (/\b(price|pricing|cost|how much|cuánto|cuesta|precio)\b/.test(t)) {
    const lines = k.services
      .map((s) => `${s.name}: ${s.price}${s.priceNote ? ` (${s.priceNote})` : ""}`)
      .join(". ");
    return es
      ? `Estos son los precios: ${lines}. La primera llamada de diagnóstico es gratis — cuando quieras, te abro el formulario para agendarla.`
      : `Here's the pricing: ${lines}. The first diagnostic call is free — whenever you're ready, I can open the form to schedule it.`;
  }
  if (/\b(service|services|offer|plans?|servicio|servicios|ofrecen)\b/.test(t)) {
    const lines = k.services.map((s) => `${s.name} — ${s.audience}`).join("; ");
    return es
      ? `Tenemos tres: ${lines}. ¿Cuál se acerca más a tu situación?`
      : `We have three: ${lines}. Which one sounds closest to your situation?`;
  }
  if (/\b(how (it|does it) work|process|proceso|cómo funciona|steps?)\b/.test(t)) {
    return k.faq.find((f) => f.question.toLowerCase().includes("process"))?.answer ??
      k.valueProposition;
  }
  if (/\b(code|coding|technical|jargon|background|programm|código|técnic)\b/.test(t)) {
    return k.faq[0].answer;
  }
  if (/\b(different|why|special|better|por qué|diferente)\b/.test(t)) {
    return k.faq.find((f) => f.question.toLowerCase().includes("different"))?.answer ??
      k.valueProposition;
  }
  if (/\b(free|gratis|cost nothing|no charge)\b/.test(t)) {
    return es
      ? "Sí — la llamada de diagnóstico es totalmente gratis, sin compromiso ni discurso de venta. Cuando quieras agendarla, dímelo y te abro el formulario."
      : "Yes — the diagnostic call is completely free, no commitment and no sales pitch. Whenever you're ready to book, just say the word and I'll open the form for you.";
  }
  if (/\b(contact|email|reach|correo|contacto)\b/.test(t)) {
    return es
      ? `Puedes escribirnos a ${k.contactEmail}, o te abro el formulario de agenda cuando quieras.`
      : `You can reach us at ${k.contactEmail}, or I can open the scheduling form whenever you're ready.`;
  }
  if (/\b(who are you|what (are|is) (you|this|squai)|qué es squai|quién eres)\b/.test(t)) {
    return es
      ? `${k.companyName} forma a profesionales y equipos para usar IA en su trabajo real — sin código ni tecnicismos. ${k.valueProposition} ¿Me cuentas un poco sobre tu trabajo para orientarte mejor?`
      : `${k.companyName} trains professionals and teams to use AI in their real work — no code, no jargon. ${k.valueProposition} Want to tell me a bit about your work so I can point you the right way?`;
  }
  // Default helpful answer.
  return es
    ? `${k.companyName} te ayuda a poner la IA a trabajar en tu día a día — ${k.valueProposition} ¿Hay algo concreto que quieras mejorar con IA?`
    : `${k.companyName} helps you put AI to work in your actual job — ${k.valueProposition} Is there something specific you'd like to improve with AI?`;
}

export class MockProvider implements ModelProvider {
  readonly name = "mock";

  async generate(input: GenerateInput): Promise<ModelResponse> {
    const { messages } = input;
    const text = lastUser(messages);
    const lang: AgentLang = detectLangFromText(text);

    // Safety nets (the route also runs the injection guard first).
    if (PROMPT_LEAK.test(text)) {
      return { text: PROMPT_LEAK_REPLY[lang] ?? PROMPT_LEAK_REPLY.en };
    }
    if (OFF_TOPIC.test(text) && !BOOKING_INTENT.test(text)) {
      return { text: OFF_TOPIC_REPLY[lang] ?? OFF_TOPIC_REPLY.en };
    }

    // Scheduling flow: fire the UI hook once, then confirm in one sentence.
    const alreadyOpened = hasToolResult(messages, "open_scheduling_form");
    if (BOOKING_INTENT.test(text) && !alreadyOpened) {
      const call: ToolCall = {
        id: "call_open_scheduling_form",
        name: "open_scheduling_form",
        arguments: {},
      };
      return { toolCalls: [call] };
    }
    if (alreadyOpened) {
      return { text: FORM_OPENED_REPLY[lang] ?? FORM_OPENED_REPLY.en };
    }

    // Information answer.
    return { text: answerInfo(text, lang) };
  }
}
