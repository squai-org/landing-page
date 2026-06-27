/** Contextual quick-reply buttons shown beneath the conversation. */
import { cn } from "@/lib/utils";

interface ChatSuggestionsProps {
  suggestions: string[];
  onPick: (text: string) => void;
  disabled?: boolean;
}

export function ChatSuggestions({ suggestions, onPick, disabled }: ChatSuggestionsProps) {
  if (!suggestions.length) return null;
  return (
    <div className="flex flex-wrap gap-2 px-4 pb-2">
      {suggestions.map((s) => (
        <button
          key={s}
          type="button"
          disabled={disabled}
          onClick={() => onPick(s)}
          className={cn(
            "rounded-full border border-primary/40 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary",
            "transition-colors hover:bg-primary/15 disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
