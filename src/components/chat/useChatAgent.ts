/**
 * Chat agent hook. Owns the conversation state and streams responses from the
 * /api/agent SSE endpoint, accumulating tokens into the active assistant message
 * and surfacing availability slots and contextual suggestions.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import type { AgentEvent, AvailabilitySlot, ChatMessage } from "./types";

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `m${idCounter}_${Date.now()}`;
}

interface UseChatAgent {
  messages: ChatMessage[];
  isStreaming: boolean;
  error: string | null;
  send: (text: string) => Promise<void>;
  bookSlot: (slot: AvailabilitySlot) => Promise<void>;
}

export function useChatAgent(greeting: string, lang: "en" | "es"): UseChatAgent {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: nextId(), role: "assistant", content: greeting },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Latest history without making `send` depend on `messages` — otherwise the
  // callback (and the handlers built on it) would get a new identity on every
  // streamed token, re-rendering memoized children for nothing.
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const streamingRef = useRef(isStreaming);
  streamingRef.current = isStreaming;

  // Abort any in-flight stream on unmount to avoid setState on an unmounted tree.
  useEffect(() => () => abortRef.current?.abort(), []);

  // Keep the greeting in sync with the active language — but only while the
  // conversation hasn't started yet (don't rewrite an in-progress chat).
  useEffect(() => {
    setMessages((prev) =>
      prev.length === 1 && prev[0].role === "assistant"
        ? [{ ...prev[0], content: greeting }]
        : prev,
    );
  }, [greeting]);

  const run = useCallback(
    async (history: ChatMessage[], selectedSlotIso?: string) => {
      setIsStreaming(true);
      setError(null);
      const assistantId = nextId();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", pending: true },
      ]);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(`${API_BASE}/api/agent`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
          body: JSON.stringify({
            messages: history.map((m) => ({ role: m.role, content: m.content })),
            sessionId: "web",
            lang,
            selectedSlotIso,
          }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error(`Request failed (${res.status})`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        const apply = (event: AgentEvent) => {
          // Note: provider "error" events are intentionally NOT surfaced to the
          // user — the server already streams a friendly, localized fallback
          // message as tokens. Raw provider errors must never reach the UI.
          setMessages((prev) =>
            prev.map((m) => {
              if (m.id !== assistantId) return m;
              if (event.type === "token") return { ...m, content: m.content + event.value };
              if (event.type === "availability") return { ...m, slots: event.slots };
              return m;
            }),
          );
        };

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const frames = buffer.split("\n\n");
          buffer = frames.pop() ?? "";
          for (const frame of frames) {
            const line = frame.split("\n").find((l) => l.startsWith("data:"));
            if (!line) continue;
            const json = line.slice(5).trim();
            if (!json) continue;
            try {
              apply(JSON.parse(json) as AgentEvent);
            } catch {
              /* ignore malformed frame */
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError(
            lang === "es"
              ? "Problema de conexión. Inténtalo de nuevo."
              : "Connection problem. Please try again.",
          );
        }
      } finally {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, pending: false } : m)),
        );
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [lang],
  );

  const send = useCallback(
    async (text: string, selectedSlotIso?: string) => {
      const trimmed = text.trim();
      if (!trimmed || streamingRef.current) return;
      const userMsg: ChatMessage = { id: nextId(), role: "user", content: trimmed };
      const history = [...messagesRef.current, userMsg];
      setMessages(history);
      await run(history, selectedSlotIso);
    },
    [run],
  );

  const bookSlot = useCallback(
    async (slot: AvailabilitySlot) => {
      // Natural, localized message for the chat; the ISO is sent out-of-band.
      const text =
        lang === "es"
          ? `Me gustaría agendar el ${slot.label}.`
          : `I'd like to book ${slot.label}.`;
      await send(text, slot.iso);
    },
    [send, lang],
  );

  return { messages, isStreaming, error, send, bookSlot };
}
