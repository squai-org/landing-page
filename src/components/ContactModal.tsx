import { useState, useCallback, useEffect, Fragment } from "react";
import { content, type Lang } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Check,
  ChevronLeft,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { es as esLocale, enUS } from "date-fns/locale";

const API_URL = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? "http://localhost:3001" : "");

type Step = "date" | "time" | "form" | "success";

const STEP_INDEX: Record<Step, number> = { date: 0, time: 1, form: 2, success: 3 };

// STEP_INFO built inside component from content.ts

// Morning 9:00–12:00, Afternoon 14:00–17:00, 30-min slots
const MORNING_SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
const AFTERNOON_SLOTS = ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];
const ALL_SLOTS = [...MORNING_SLOTS, ...AFTERNOON_SLOTS];

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lang: Lang;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isWeekdayAndFuture(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = date.getDay();
  return day !== 0 && day !== 6 && date >= today;
}

const ContactModal = ({ open, onOpenChange, lang }: ContactModalProps) => {
  const t = content.contactModal;

  // ── Step flow ──
  const [step, setStep] = useState<Step>("date");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();

  // ── Form state ──
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  // ── Availability ──
  const [busySlots, setBusySlots] = useState<Record<string, string[]>>({});
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());

  // ── Reset on close ──
  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => {
        setStep("date"); setSelectedDate(undefined); setSelectedTime(undefined);
        setName(""); setCompany(""); setEmail(""); setDescription("");
        setEmailTouched(false); setPrivacy(false); setSubmitted(false);
        setScheduling(false); setScheduleError(null);
        setBusySlots({}); setLoadingSlots(false); setCalendarMonth(new Date());
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  // ── Availability fetch ──
  const fetchAvailability = useCallback(async (month: Date) => {
    setLoadingSlots(true);
    try {
      const y = month.getFullYear();
      const m = month.getMonth();
      const from = format(new Date(y, m, 1), "yyyy-MM-dd");
      const to = format(new Date(y, m + 1, 0), "yyyy-MM-dd");
      const res = await fetch(`${API_URL}/api/availability?from=${from}&to=${to}`);
      if (res.ok) {
        const data = await res.json();
        setBusySlots((prev) => ({ ...prev, ...(data.busy ?? {}) }));
      }
    } catch {
      // Fetch failed — slots appear available; server validates on booking
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchAvailability(calendarMonth);
  }, [open, calendarMonth, fetchAvailability]);

  const isDayFullyBooked = useCallback(
    (date: Date): boolean => {
      const dateStr = format(date, "yyyy-MM-dd");
      const busy = busySlots[dateStr];
      return !!busy && ALL_SLOTS.every((s) => busy.includes(s));
    },
    [busySlots],
  );

  // ── Validation ──
  const emailError = useCallback((): string | null => {
    if (!emailTouched && !submitted) return null;
    if (!email.trim()) return t.emailRequired[lang];
    if (!EMAIL_REGEX.test(email.trim())) return t.emailInvalid[lang];
    return null;
  }, [email, emailTouched, submitted, lang, t]);

  const isValid =
    name.trim() !== "" &&
    company.trim() !== "" &&
    EMAIL_REGEX.test(email.trim()) &&
    privacy;

  const privacyError =
    submitted && !privacy ? t.privacyRequired[lang] : null;

  const emailErr = emailError();

  // ── Handlers ──
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
    setScheduleError(null);
    if (date) setStep("time");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setScheduleError(null);
    setStep("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid || !selectedDate || !selectedTime) return;

    setScheduling(true);
    setScheduleError(null);

    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const res = await fetch(`${API_URL}/api/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          company: company.trim(),
          email: email.trim(),
          description: description.trim(),
          date: dateStr,
          time: selectedTime,
          lang,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "slot_taken") {
          setScheduleError(t.errorSlotTaken[lang]);
          setStep("time");
        } else {
          setScheduleError(t.errorGeneric[lang]);
        }
        return;
      }

      setStep("success");
    } catch {
      setScheduleError(t.errorGeneric[lang]);
    } finally {
      setScheduling(false);
    }
  };

  // ── Styles ──
  const inputCls = "bg-background/60 border-border/60 font-body placeholder:text-muted-foreground/50 focus-visible:ring-primary/60 transition-colors";
  const inputErrCls = "border-destructive/70 focus-visible:ring-destructive/40";

  const dateFmt = selectedDate
    ? format(selectedDate, "EEE, MMM d", { locale: lang === "es" ? esLocale : enUS })
    : "";

  // ── Step indicator ──
  const stepInfo = [
    { label: t.stepDateLabel[lang], desc: t.stepDateDesc[lang] },
    { label: t.stepTimeLabel[lang], desc: t.stepTimeDesc[lang] },
    { label: t.stepDetailsLabel[lang], desc: t.stepDetailsDesc[lang] },
  ];
  const currentIdx = STEP_INDEX[step];

  const renderStepper = () => {
    if (step === "success") return null;
    return (
      <nav aria-label={t.formProgress[lang]} className="mb-5">
        <ol className="flex items-start w-full">
          {stepInfo.map((s, i) => {
            const done = i < currentIdx;
            const active = i === currentIdx;
            return (
              <li key={i} aria-current={active ? "step" : undefined}
                className={`flex items-start ${i < stepInfo.length - 1 ? "flex-1" : ""}`}>
                <div className="flex flex-col items-center gap-1 min-w-[3rem]">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${
                    done ? "bg-primary text-primary-foreground" :
                    active ? "bg-primary text-primary-foreground ring-[3px] ring-primary/20" :
                    "bg-white/10 text-muted-foreground"
                  }`}>
                    {done ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : i + 1}
                  </div>
                  <span className={`text-[10px] font-body font-semibold whitespace-nowrap transition-colors duration-300 ${
                    active ? "text-foreground" : done ? "text-primary/80" : "text-muted-foreground/60"
                  }`}>
                    {s.label}
                  </span>
                </div>
                {i < stepInfo.length - 1 && (
                  <div aria-hidden="true" className={`flex-1 h-px mt-3.5 mx-2 transition-colors duration-300 ${
                    i < currentIdx ? "bg-primary/60" : "bg-white/10"
                  }`} />
                )}
              </li>
            );
          })}
        </ol>
        <p className="text-muted-foreground font-body text-xs text-center mt-3" aria-live="polite">
          {stepInfo[currentIdx].desc}
        </p>
      </nav>
    );
  };

  // ── Render per step ──
  const renderContent = () => {
    // ── SUCCESS ──
    if (step === "success") {
      return (
        <div className="flex flex-col items-center text-center py-8 space-y-4" role="status" aria-live="polite">
          <div className="rounded-full bg-primary/10 p-4">
            <CheckCircle2 className="h-10 w-10 text-primary" aria-hidden="true" />
          </div>
          <h3 className="font-headline font-bold text-xl text-foreground">
            {t.successTitle[lang]}
          </h3>
          <p className="text-muted-foreground font-body text-sm max-w-xs">
            {t.successMessage[lang]}
          </p>
          <Button variant="hero" onClick={() => onOpenChange(false)} className="mt-2">
            {t.closeBtn[lang]}
          </Button>
        </div>
      );
    }

    // ── DATE ──
    if (step === "date") {
      return (
        <CalendarComponent
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={(date) => !isWeekdayAndFuture(date) || isDayFullyBooked(date)}
          month={calendarMonth}
          onMonthChange={setCalendarMonth}
          locale={lang === "es" ? esLocale : enUS}
          className="rounded-xl border border-white/10 bg-background/40 w-full"
          classNames={{
            months: "flex flex-col w-full",
            month: "space-y-4 w-full",
            table: "w-full border-collapse space-y-1",
            head_row: "flex w-full",
            head_cell: "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "flex-1 h-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          }}
        />
      );
    }

    // ── TIME ──
    if (step === "time") {
      const dateBusy = selectedDate ? busySlots[format(selectedDate, "yyyy-MM-dd")] ?? [] : [];
      const availMorning = MORNING_SLOTS.filter((s) => !dateBusy.includes(s));
      const availAfternoon = AFTERNOON_SLOTS.filter((s) => !dateBusy.includes(s));
      const noSlots = !loadingSlots && availMorning.length === 0 && availAfternoon.length === 0;

      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setStep("date")}
              aria-label={t.backToDate[lang]}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="text-sm font-body text-foreground font-semibold">
              {t.selectedDate[lang]}: {dateFmt}
            </span>
            <button type="button" onClick={() => setStep("date")}
              className="text-xs text-primary hover:underline font-body ml-auto">
              {t.changeDate[lang]}
            </button>
          </div>

          {scheduleError && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3" role="alert" aria-live="assertive">
              <p className="text-xs font-body text-destructive">{scheduleError}</p>
            </div>
          )}

          {loadingSlots && (
            <div className="flex items-center justify-center gap-2 py-6">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />
              <span className="text-sm font-body text-muted-foreground">{t.loadingAvailability[lang]}</span>
            </div>
          )}

          {noSlots && (
            <p className="text-sm font-body text-muted-foreground text-center py-6">{t.noSlots[lang]}</p>
          )}

          {!loadingSlots && availMorning.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-3 w-3" aria-hidden="true" /> {t.morning[lang]}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {availMorning.map((slot) => (
                  <button key={slot} type="button" onClick={() => handleTimeSelect(slot)}
                    aria-label={`${slot} ${dateFmt}`}
                    aria-pressed={selectedTime === slot}
                    className={`rounded-lg border text-sm font-body font-medium py-2.5 transition-all duration-200 min-h-[44px] ${
                      selectedTime === slot
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-white/10 bg-white/5 text-foreground hover:border-primary/40 hover:bg-primary/5"
                    }`}>
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loadingSlots && availAfternoon.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-3 w-3" aria-hidden="true" /> {t.afternoon[lang]}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {availAfternoon.map((slot) => (
                  <button key={slot} type="button" onClick={() => handleTimeSelect(slot)}
                    aria-label={`${slot} ${dateFmt}`}
                    aria-pressed={selectedTime === slot}
                    className={`rounded-lg border text-sm font-body font-medium py-2.5 transition-all duration-200 min-h-[44px] ${
                      selectedTime === slot
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-white/10 bg-white/5 text-foreground hover:border-primary/40 hover:bg-primary/5"
                    }`}>
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // ── FORM ──
    return (
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Back + date/time summary */}
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setStep("time")}
            aria-label={t.backToTime[lang]}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="text-sm font-body text-foreground font-semibold">
            {dateFmt} · {selectedTime}
          </span>
          <button type="button" onClick={() => setStep("date")}
            className="text-xs text-primary hover:underline font-body ml-auto">
            {t.changeDate[lang]}
          </button>
        </div>

        {scheduleError && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3" role="alert" aria-live="assertive">
            <p className="text-xs font-body text-destructive">{scheduleError}</p>
          </div>
        )}

        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="c-name" className="text-foreground font-body font-semibold text-sm">
            {t.nameLabel[lang]} <span className="text-destructive">*</span>
          </Label>
          <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)}
            placeholder={t.namePlaceholder[lang]} autoComplete="name"
            className={`${inputCls} ${submitted && !name.trim() ? inputErrCls : ""}`} />
          {submitted && !name.trim() && (
            <p className="text-xs font-body text-destructive">{t.nameRequired[lang]}</p>
          )}
        </div>

        {/* Company */}
        <div className="space-y-1.5">
          <Label htmlFor="c-company" className="text-foreground font-body font-semibold text-sm">
            {t.companyLabel[lang]} <span className="text-destructive">*</span>
          </Label>
          <Input id="c-company" value={company} onChange={(e) => setCompany(e.target.value)}
            placeholder={t.companyPlaceholder[lang]} autoComplete="organization"
            className={`${inputCls} ${submitted && !company.trim() ? inputErrCls : ""}`} />
          {submitted && !company.trim() && (
            <p className="text-xs font-body text-destructive">{t.companyRequired[lang]}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="c-email" className="text-foreground font-body font-semibold text-sm">
            {t.emailLabel[lang]} <span className="text-destructive">*</span>
          </Label>
          <Input id="c-email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            placeholder={t.emailPlaceholder[lang]} autoComplete="email"
            className={`${inputCls} ${emailErr ? inputErrCls : ""}`} />
          {emailErr && (
            <p className="text-xs font-body text-destructive">{emailErr}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="c-desc" className="text-foreground font-body font-semibold text-sm">
            {t.descriptionLabel[lang]}
          </Label>
          <Textarea id="c-desc" value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder={t.descriptionPlaceholder[lang]} rows={2}
            className={`${inputCls} resize-none`} />
        </div>

        {/* Privacy */}
        <div className="space-y-1.5">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-border/60 accent-primary cursor-pointer" />
            <span className="text-xs font-body text-muted-foreground leading-relaxed select-none">
              {t.privacyPrefix[lang]}
              <a href={`/${lang}/privacy`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{t.privacyLink[lang]}</a>
              {t.privacySuffix[lang]}
            </span>
          </label>
          {privacyError && <p className="text-xs font-body text-destructive pl-6">{privacyError}</p>}
        </div>

        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={scheduling}>
          {scheduling ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t.scheduling[lang]}
            </span>
          ) : (
            t.scheduleBtn[lang]
          )}
        </Button>
      </form>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-primary/20 bg-card/95 backdrop-blur-xl shadow-2xl shadow-primary/10 sm:max-w-lg p-0 gap-0 overflow-hidden max-h-[90dvh] sm:max-h-[90vh] overflow-y-auto">
        <div className="absolute inset-x-0 top-0 h-1 rounded-t-lg gradient-bar z-10" />

        <div className="px-6 pt-8 pb-2">
          <DialogHeader>
            <DialogTitle className="font-headline font-black text-xl sm:text-2xl gradient-wave-text pb-1">
              {t.title[lang]}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-body text-sm sm:text-base">
              {t.description[lang]}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 pt-2 min-h-[24rem] sm:min-h-[26rem]" role="group"
          aria-label={step !== "success" ? stepInfo[STEP_INDEX[step]].desc : t.bookingConfirmed[lang]}>
          {renderStepper()}
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
