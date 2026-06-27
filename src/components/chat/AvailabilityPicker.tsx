/** Visual slot picker. Renders agent-provided slots as tappable chips by day. */
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AvailabilitySlot } from "./types";

interface AvailabilityPickerProps {
  slots: AvailabilitySlot[];
  onPick: (slot: AvailabilitySlot) => void;
  disabled?: boolean;
}

export function AvailabilityPicker({ slots, onPick, disabled }: AvailabilityPickerProps) {
  if (!slots.length) return null;

  const byDate = slots.reduce<Record<string, AvailabilitySlot[]>>((acc, s) => {
    (acc[s.date] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="mt-2 rounded-lg border border-border bg-card/60 p-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Calendar className="h-3.5 w-3.5 text-accent" />
        Pick a time
      </div>
      <div className="space-y-3">
        {Object.entries(byDate).map(([date, daySlots]) => (
          <div key={date}>
            <p className="mb-1 text-xs text-muted-foreground">
              {daySlots[0]?.label.split("·")[0]?.trim() ?? date}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {daySlots.map((slot) => (
                <button
                  key={slot.iso}
                  type="button"
                  disabled={disabled}
                  onClick={() => onPick(slot)}
                  className={cn(
                    "rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground",
                    "transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                  )}
                >
                  {slot.label.split("·")[1]?.trim() ?? slot.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
