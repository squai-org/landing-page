/**
 * Deterministic, offline provider.
 *
 * Implements the same ModelProvider interface as the real providers but needs no
 * API key or network. It uses simple intent routing over the conversation +
 * landing knowledge to (a) answer info questions, (b) drive the booking tool
 * flow, and (c) decline off-topic/injection requests. This makes the whole agent
 * — and its eval — fully reproducible in CI. Real providers (google/ollama) take
 * over automatically when their API keys are present.
 */
import {
  getLandingKnowledge,
  type AgentLang,
} from "../context/page-content-extractor.js";
import { detectLangFromText } from "../lang.js";
import { EMAIL_PATTERN } from "../../config/constants.js";
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
  /\b(book|schedule|appointment|slots?|availabilit\w*|diagnostic|agendar|cita|reservar|disponib\w*|horario)\b/i;
const OFF_TOPIC =
  /\b(weather|temperature|forecast|capital of|population of|currency of|recipe|cook|bake|stock price|stocks?|bitcoin|crypto|invest|homework|essay|assignment|translate|translation|write (me )?(a|an|some) (poem|code|story|essay|song|haiku|script|python|javascript|java|sql|rust|function|program)|football|soccer|basketball|nba|world cup|movie|film|netflix|tv show|joke|riddle|pun|lyrics|horoscope|who won|who is the president|when did|where is|how tall|how far|square root|derivative|integral|clima|receta|cocina|chiste|adivinanza|capital de|poblaci[oó]n de|traduce|tradúceme|escribe (un|una) (poema|c[oó]digo|cuento|historia|canci[oó]n|ensayo)|pel[ií]cula|deporte|f[uú]tbol|qui[eé]n gan[oó]|cu[aá]l es la capital)\b/i;
const PROMPT_LEAK =
  /\b(system prompt|your (instructions?|rules?|prompt)|reveal|repeat (everything|all)|api[_ -]?key|secret|password)\b/i;

const OFF_TOPIC_REPLY = {
  en: "That's a bit outside what I can help with — I'm the Squai assistant, focused on AI training and booking your free call. Anything I can help with there?",
  es: "Eso está un poco fuera de lo que puedo ayudarte — soy el asistente de Squai, enfocado en formación en IA y en agendar tu llamada gratis. ¿Te ayudo con eso?",
} as const;

const PROMPT_LEAK_REPLY = {
  en: "I can't share my internal setup, but I'm happy to help with anything about Squai or to book you a free call.",
  es: "No puedo compartir mi configuración interna, pero con gusto te ayudo con cualquier cosa de Squai o agendo tu llamada gratis.",
} as const;

function lastUser(messages: ChatMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i].content ?? "";
  }
  return "";
}

function findEmail(messages: ChatMessage[]): string | undefined {
  for (const m of messages) {
    if (m.role !== "user") continue;
    const match = m.content.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
    if (match && EMAIL_PATTERN.test(match[0])) return match[0];
  }
  return undefined;
}

function findName(messages: ChatMessage[]): string | undefined {
  for (const m of messages) {
    if (m.role !== "user") continue;
    const match = m.content.match(
      /\b(?:my name is|i am|i'?m|name'?s|mi nombre es|nombre es|me llamo|soy)\s+([A-Za-zÀ-ÿ]+(?:\s+(?!y\b|and\b|mi\b|my\b|e\b)[A-Za-zÀ-ÿ]+)?)/i,
    );
    if (match) return match[1].trim();
  }
  return undefined;
}

function firstAvailabilityIso(messages: ChatMessage[]): string | undefined {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role === "tool" && m.name === "get_availability") {
      try {
        const parsed = JSON.parse(m.content) as { slots?: { iso: string }[] };
        return parsed.slots?.[0]?.iso;
      } catch {
        return undefined;
      }
    }
  }
  return undefined;
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
      ? `Estos son los precios: ${lines}. La primera llamada de diagnóstico es gratis — ¿te busco un horario?`
      : `Here's the pricing: ${lines}. The first diagnostic call is free, though — want me to find a time?`;
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
      ? "Sí — la llamada de diagnóstico es totalmente gratis, sin compromiso ni discurso de venta. ¿Te reservo un horario?"
      : "Yes — the diagnostic call is completely free, no commitment and no sales pitch. Want me to grab a slot for you?";
  }
  if (/\b(contact|email|reach|correo|contacto)\b/.test(t)) {
    return es
      ? `Puedes escribirnos a ${k.contactEmail}, o te agendo una llamada gratis aquí mismo.`
      : `You can reach us at ${k.contactEmail}, or I can book you a free call right here.`;
  }
  if (/\b(who are you|what (are|is) (you|this|squai)|qué es squai|quién eres)\b/.test(t)) {
    return es
      ? `${k.companyName} forma a profesionales y equipos para usar IA en su trabajo real — sin código ni tecnicismos. ${k.valueProposition} ¿Me cuentas un poco sobre tu trabajo para orientarte mejor?`
      : `${k.companyName} trains professionals and teams to use AI in their real work — no code, no jargon. ${k.valueProposition} Want to tell me a bit about your work so I can point you the right way?`;
  }
  // Default helpful answer.
  return es
    ? `${k.companyName} te ayuda a poner la IA a trabajar en tu día a día — ${k.valueProposition} ¿Hay algo concreto que quieras mejorar con IA? También puedo agendarte una llamada gratis.`
    : `${k.companyName} helps you put AI to work in your actual job — ${k.valueProposition} Is there something specific you'd like to improve with AI? I can also set up a free call.`;
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

    // Booking flow.
    const bookingResolved = hasToolResult(messages, "schedule_call");
    if (bookingResolved) {
      return {
        text:
          lang === "es"
            ? "¡Listo! Te llegará un correo de confirmación con el enlace de la reunión. ¡Nos vemos!"
            : "You're all set — you'll get a confirmation email with the meeting link shortly. Looking forward to it!",
      };
    }

    const wantsBooking = BOOKING_INTENT.test(text);
    const gotAvailability = hasToolResult(messages, "get_availability");

    if (wantsBooking && !gotAvailability) {
      const call: ToolCall = {
        id: "call_get_availability",
        name: "get_availability",
        arguments: {},
      };
      return { toolCalls: [call] };
    }

    if (gotAvailability) {
      const email = findEmail(messages);
      const name = findName(messages);
      const iso = firstAvailabilityIso(messages);
      if (email && name && iso) {
        const call: ToolCall = {
          id: "call_schedule_call",
          name: "schedule_call",
          arguments: { name, email, datetime: iso },
        };
        return { toolCalls: [call] };
      }
      const missing: string[] =
        lang === "es"
          ? [!name && "tu nombre", !email && "tu correo", !iso && "qué hora te sirve"].filter(
              Boolean,
            ) as string[]
          : [!name && "your name", !email && "your email", !iso && "which time works"].filter(
              Boolean,
            ) as string[];
      return {
        text:
          lang === "es"
            ? `Genial — para confirmar, ¿me compartes ${missing.join(" y ")}?`
            : `Great — to lock it in, could you share ${missing.join(" and ")}?`,
      };
    }

    // Information answer.
    return { text: answerInfo(text, lang) };
  }
}
