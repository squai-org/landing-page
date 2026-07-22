/** A single chat bubble (user or assistant). */
import { memo } from "react";
import { cn } from "@/lib/utils";
import { TypingIndicator } from "./TypingIndicator";
import type { ChatMessage as ChatMessageType } from "./types";

interface ChatMessageProps {
  message: ChatMessageType;
}

// Memoized: during streaming only the active assistant message changes identity
// (see useChatAgent's `apply`), so untouched bubbles skip re-render per token.
export const ChatMessage = memo(function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const showTyping = !isUser && message.pending && message.content.length === 0;

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[85%]", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
            isUser
              ? "rounded-br-md bg-primary text-primary-foreground"
              : "rounded-bl-md bg-card text-card-foreground border border-border",
          )}
        >
          {showTyping ? (
            <TypingIndicator />
          ) : (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          )}
        </div>
      </div>
    </div>
  );
});
