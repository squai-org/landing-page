/**
 * ChatWidget — the single mount point for the Squai chat agent.
 *
 * Self-contained: manages open/pulse state, detects language from the URL,
 * wires the streaming agent hook, and renders the launcher + window. Mounted
 * once in the app root; it touches no other part of the page. When the agent
 * fires a "scheduling_form" event, useChatAgent dispatches a global window
 * event that the host page (Index.tsx) listens for to open the ContactModal.
 */
import { useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ChatBubble } from "./ChatBubble";
import { ChatWindow } from "./ChatWindow";
import { useChatAgent } from "./useChatAgent";

type Lang = "en" | "es";

const COPY: Record<Lang, {
  title: string;
  subtitle: string;
  placeholder: string;
  greeting: string;
  launcher: string;
  initial: string[];
  followUp: string[];
}> = {
  en: {
    title: "Squai Assistant",
    subtitle: "AI training info & service questions",
    placeholder: "Ask about our services…",
    greeting:
      "Hey! I'm the Squai assistant. I can walk you through our services and how we help you put AI to work. What brings you here?",
    launcher: "Open Squai chat",
    initial: ["What does Squai do?", "How much does it cost?", "Book a free call"],
    followUp: ["Tell me about your services", "Book a free call"],
  },
  es: {
    title: "Asistente de Squai",
    subtitle: "Info de servicios y formación en IA",
    placeholder: "Pregunta por nuestros servicios…",
    greeting:
      "¡Hola! Soy el asistente de Squai. Te cuento sobre nuestros servicios y cómo te ayudamos a usar la IA en tu trabajo. ¿Qué te trae por aquí?",
    launcher: "Abrir chat de Squai",
    initial: ["¿Qué hace Squai?", "¿Cuánto cuesta?", "Agendar llamada gratis"],
    followUp: ["Cuéntame sobre los servicios", "Agendar llamada gratis"],
  },
};

export default function ChatWidget() {
  // Reactive to the route so the chat copy follows the language selector.
  const { pathname } = useLocation();
  const lang: Lang = pathname.startsWith("/en") ? "en" : "es";
  const copy = COPY[lang];
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const { messages, isStreaming, error, send } = useChatAgent(copy.greeting, lang);

  const suggestions = messages.length <= 1 ? copy.initial : copy.followUp;

  const toggle = useCallback(() => {
    setOpen((v) => !v);
    setHasOpened(true);
  }, []);

  // Stable handlers so memoized children (ChatMessage) aren't re-rendered every
  // streaming token by a fresh callback identity.
  const handleSend = useCallback((text: string) => void send(text), [send]);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <AnimatePresence>
        {open && (
          <ChatWindow
            title={copy.title}
            subtitle={copy.subtitle}
            placeholder={copy.placeholder}
            messages={messages}
            suggestions={suggestions}
            isStreaming={isStreaming}
            error={error}
            onSend={handleSend}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
      <ChatBubble open={open} pulse={!hasOpened} onClick={toggle} label={copy.launcher} />
    </>
  );
}
