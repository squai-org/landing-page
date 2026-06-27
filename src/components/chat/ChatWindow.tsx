/**
 * Chat window: fullscreen sheet on mobile, floating overlay on desktop.
 * Renders the conversation, contextual suggestions, and the composer.
 */
import { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChatMessage } from "./ChatMessage";
import { ChatSuggestions } from "./ChatSuggestions";
import type { AvailabilitySlot, ChatMessage as ChatMessageType } from "./types";

interface ChatWindowProps {
  title: string;
  subtitle: string;
  placeholder: string;
  messages: ChatMessageType[];
  suggestions: string[];
  isStreaming: boolean;
  error: string | null;
  onSend: (text: string) => void;
  onPickSlot: (slot: AvailabilitySlot) => void;
  onClose: () => void;
}

export function ChatWindow({
  title,
  subtitle,
  placeholder,
  messages,
  suggestions,
  isStreaming,
  error,
  onSend,
  onPickSlot,
  onClose,
}: ChatWindowProps) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const submit = () => {
    if (!draft.trim() || isStreaming) return;
    onSend(draft);
    setDraft("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      role="dialog"
      aria-label={title}
      className={cn(
        "fixed z-40 flex flex-col overflow-hidden bg-background shadow-2xl",
        "inset-x-0 bottom-0 top-20 rounded-none",
        "sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[600px] sm:max-h-[80vh] sm:w-[400px] sm:rounded-2xl sm:border sm:border-border",
      )}
    >
      {/* Header */}
      <header className="flex items-center justify-between gap-2 border-b border-border bg-card px-4 py-3">
        <div className="min-w-0">
          <p className="truncate font-headline text-sm font-semibold text-foreground">{title}</p>
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <ChatMessage
            key={m.id}
            message={m}
            onPickSlot={onPickSlot}
            pickerDisabled={isStreaming}
          />
        ))}
        {error && (
          <p className="text-center text-xs text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>

      {!isStreaming && (
        <ChatSuggestions suggestions={suggestions} onPick={onSend} disabled={isStreaming} />
      )}

      {/* Composer */}
      <div className="border-t border-border bg-card px-3 py-3">
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            placeholder={placeholder}
            aria-label={placeholder}
            className="max-h-28 min-h-[52px] flex-1 resize-none rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <button
            type="button"
            onClick={submit}
            disabled={!draft.trim() || isStreaming}
            aria-label="Send message"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
