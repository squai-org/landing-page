/** Floating chat launcher button (bottom-right, >=48x48, pulses on first load). */
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  open: boolean;
  pulse: boolean;
  onClick: () => void;
  label: string;
}

export function ChatBubble({ open, pulse, onClick, label }: ChatBubbleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={open}
      className={cn(
        "fixed bottom-6 right-6 z-[70] flex h-14 w-14 items-center justify-center rounded-full",
        "bg-primary text-primary-foreground shadow-lg shadow-primary/30",
        "transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
      )}
    >
      {pulse && !open && (
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
      )}
      <span className="relative">
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </span>
    </button>
  );
}
