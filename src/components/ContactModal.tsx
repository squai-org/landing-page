import { useState, useCallback, useEffect, useMemo } from "react";
import { t } from "@/lib/content";
import { useLang } from "@/hooks/use-lang";
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
import {
  getAvailability,
  scheduleCall,
  rescheduleCall,
  ApiClientError,
} from "@/services";
import { EMAIL_PATTERN } from "@/constants";

type Step = "date" | "time" | "form" | "success";

const STEP_INDEX: Record<Step, number> = { date: 0, time: 1, form: 2, success: 3 };

function formatSlotLocal(iso: string, lang: "en" | "es"): string {
  return new Date(iso).toLocaleTimeString(lang === "es" ? "es" : "en", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getLocalHour(iso: string): number {
  return new Date(iso).getHours();
}

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRescheduleCompleted?: () => void;
  rescheduleContext?: {
    eventId: string;
    email: string;
  } | null;
}

function isWeekdayAndFuture(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = date.getDay();
  return day !== 0 && day !== 6 && date >= today;
}

const ContactModal = ({ open, onOpenChange, onRescheduleCompleted, rescheduleContext }: ContactModalProps) => {
  const { lang } = useLang();
  const { contactModal: cm } = t(lang);
  const isRescheduleMode = Boolean(rescheduleContext?.eventId && rescheduleContext?.email);

  const [step, setStep] = useState<Step>("date");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<string | undefined>();

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  const [availableSlots, setAvailableSlots] = useState<Record<string, string[]>>({});
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());

  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => {
        setStep("date"); setSelectedDate(undefined); setSelectedSlot(undefined);
        setName(""); setCompany(""); setEmail(""); setDescription("");
        setEmailTouched(false); setPrivacy(false); setSubmitted(false);
        setScheduling(false); setScheduleError(null);
        setAvailableSlots({}); setLoadingSlots(false); setCalendarMonth(new Date());
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !isRescheduleMode || !rescheduleContext) return;
    setEmail(rescheduleContext.email);
    setEmailTouched(true);
  }, [open, isRescheduleMode, rescheduleContext]);

  const fetchAvailability = useCallback(async (month: Date) => {
    setLoadingSlots(true);
    try {
      const y = month.getFullYear();
      const m = month.getMonth();
      const from = format(new Date(y, m, 1), "yyyy-MM-dd");
      const to = format(new Date(y, m + 1, 0), "yyyy-MM-dd");
      const data = await getAvailability(from, to);
      setAvailableSlots((prev) => {
        const slots = data.slots;
        return slots ? { ...prev, ...slots } : prev;
      });
    } catch {
      // server validates on booking
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
      return Object.keys(availableSlots).length > 0 && (availableSlots[dateStr]?.length ?? 0) <= 0;
    },
    [availableSlots],
  );

  const { morningSlots, afternoonSlots } = useMemo(() => {
    if (!selectedDate) return { morningSlots: [] as string[], afternoonSlots: [] as string[] };
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const daySlots = availableSlots[dateStr] ?? [];
    return {
      morningSlots: daySlots.filter((s) => getLocalHour(s) < 12),
      afternoonSlots: daySlots.filter((s) => getLocalHour(s) >= 12),
    };
  }, [selectedDate, availableSlots]);

  const emailError = useCallback((): string | null => {
    if (!emailTouched && !submitted) return null;
    if (!email.trim()) return cm.emailRequired;
    if (!EMAIL_PATTERN.test(email.trim())) return cm.emailInvalid;
    return null;
  }, [email, emailTouched, submitted, cm.emailRequired, cm.emailInvalid]);

  const isValid = isRescheduleMode
    ? EMAIL_PATTERN.test(email.trim()) && privacy
    : name.trim() !== "" &&
      company.trim() !== "" &&
      EMAIL_PATTERN.test(email.trim()) &&
      privacy;

  const privacyError =
    submitted && !privacy ? cm.privacyRequired : null;

  const emailErr = emailError();

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlot(undefined);
    setScheduleError(null);
    if (date) setStep("time");
  };

  const handleTimeSelect = (slot: string) => {
    setSelectedSlot(slot);
    setScheduleError(null);
    setStep("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid || !selectedDate || !selectedSlot) return;

    setScheduling(true);
    setScheduleError(null);

    try {
      if (isRescheduleMode && rescheduleContext) {
        await rescheduleCall({
          eventId: rescheduleContext.eventId,
          email: email.trim(),
          datetime: selectedSlot,
          lang,
        });
        onRescheduleCompleted?.();
      } else {
        await scheduleCall({
          name: name.trim(),
          company: company.trim(),
          email: email.trim(),
          description: description.trim(),
          datetime: selectedSlot,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          lang,
        });
      }

      setStep("success");
    } catch (err) {
      if (err instanceof ApiClientError) {
        if (err.code === "slot_taken") {
          setScheduleError(cm.errorSlotTaken);
          setStep("time");
        } else if (err.code === "forbidden") {
          setScheduleError(cm.errorRescheduleForbidden);
        } else {
          setScheduleError(cm.errorGeneric);
        }
      } else {
        setScheduleError(cm.errorGeneric);
      }
    } finally {
      setScheduling(false);
    }
  };

  const inputCls = "bg-background/60 border-border/60 font-body placeholder:text-muted-foreground/50 focus-visible:ring-primary/60 transition-colors";
  const inputErrCls = "border-destructive/70 focus-visible:ring-destructive/40";

  const dateFmt = selectedDate
    ? format(selectedDate, "EEE, MMM d", { locale: lang === "es" ? esLocale : enUS })
    : "";

  const selectedTimeFmt = selectedSlot ? formatSlotLocal(selectedSlot, lang) : "";

  const stepInfo = [
    { label: cm.stepDateLabel, desc: cm.stepDateDesc },
    { label: cm.stepTimeLabel, desc: cm.stepTimeDesc },
    { label: cm.stepDetailsLabel, desc: cm.stepDetailsDesc },
  ];
  const currentIdx = STEP_INDEX[step];

  const renderStepper = () => {
    if (step === "success") return null;

    const getCircleCls = (done: boolean, active: boolean) => {
      if (done) return "bg-primary text-primary-foreground";
      if (active) return "bg-primary text-primary-foreground ring-[3px] ring-primary/20";
      return "bg-white/10 text-muted-foreground";
    };

    const getLabelCls = (done: boolean, active: boolean) => {
      if (active) return "text-foreground";
      if (done) return "text-primary/80";
      return "text-muted-foreground/60";
    };

    return (
      <nav aria-label={cm.formProgress} className="mb-5">
        <ol className="flex items-start w-full">
          {stepInfo.map((s, i) => {
            const done = i < currentIdx;
            const active = i === currentIdx;
            return (
              <li key={s.label} aria-current={active ? "step" : undefined}
                className={`flex items-start ${i < stepInfo.length - 1 ? "flex-1" : ""}`}>
                <div className="flex flex-col items-center gap-1 min-w-[3rem]">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${getCircleCls(done, active)}`}>
                    {done ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : i + 1}
                  </div>
                  <span className={`text-[10px] font-body font-semibold whitespace-nowrap transition-colors duration-300 ${getLabelCls(done, active)}`}>
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

  const renderContent = () => {
    if (step === "success") {
      return (
        <div className="flex flex-col items-center text-center py-8 space-y-4" role="status" aria-live="polite">
          <div className="rounded-full bg-primary/10 p-4">
            <CheckCircle2 className="h-10 w-10 text-primary" aria-hidden="true" />
          </div>
          <p className="text-muted-foreground font-body text-xl font-bold max-w-xs">
            {cm.successMessage}
          </p>
          <Button variant="hero" onClick={() => onOpenChange(false)} className="mt-2">
            {cm.closeBtn}
          </Button>
        </div>
      );
    }

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
            cell: "flex-1 h-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
          }}
        />
      );
    }

    if (step === "time") {
      const noSlots = !loadingSlots && morningSlots.length === 0 && afternoonSlots.length === 0;

      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setStep("date")}
              aria-label={cm.backToDate}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="text-sm font-body text-foreground font-semibold">
              {cm.selectedDate}: {dateFmt}
            </span>
            <button type="button" onClick={() => setStep("date")}
              className="text-xs text-primary hover:underline font-body ml-auto">
              {cm.changeDate}
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
              <span className="text-sm font-body text-muted-foreground">{cm.loadingAvailability}</span>
            </div>
          )}

          {noSlots && (
            <p className="text-sm font-body text-muted-foreground text-center py-6">{cm.noSlots}</p>
          )}

          {!loadingSlots && morningSlots.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-3 w-3" aria-hidden="true" /> {cm.morning}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {morningSlots.map((slot) => (
                  <button key={slot} type="button" onClick={() => handleTimeSelect(slot)}
                    aria-label={`${formatSlotLocal(slot, lang)} ${dateFmt}`}
                    aria-pressed={selectedSlot === slot}
                    className={`rounded-lg border text-sm font-body font-medium py-2.5 transition-all duration-200 min-h-[44px] ${
                      selectedSlot === slot
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-white/10 bg-white/5 text-foreground hover:border-primary/40 hover:bg-primary/5"
                    }`}>
                    {formatSlotLocal(slot, lang)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loadingSlots && afternoonSlots.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-3 w-3" aria-hidden="true" /> {cm.afternoon}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {afternoonSlots.map((slot) => (
                  <button key={slot} type="button" onClick={() => handleTimeSelect(slot)}
                    aria-label={`${formatSlotLocal(slot, lang)} ${dateFmt}`}
                    aria-pressed={selectedSlot === slot}
                    className={`rounded-lg border text-sm font-body font-medium py-2.5 transition-all duration-200 min-h-[44px] ${
                      selectedSlot === slot
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-white/10 bg-white/5 text-foreground hover:border-primary/40 hover:bg-primary/5"
                    }`}>
                    {formatSlotLocal(slot, lang)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setStep("time")}
            aria-label={cm.backToTime}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="text-sm font-body text-foreground font-semibold">
            {dateFmt} · {selectedTimeFmt}
          </span>
          <button type="button" onClick={() => setStep("date")}
            className="text-xs text-primary hover:underline font-body ml-auto">
            {cm.changeDate}
          </button>
        </div>

        {scheduleError && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3" role="alert" aria-live="assertive">
            <p className="text-xs font-body text-destructive">{scheduleError}</p>
          </div>
        )}

        {!isRescheduleMode && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="c-name" className="text-foreground font-body font-semibold text-sm">
                {cm.nameLabel} <span className="text-destructive">*</span>
              </Label>
              <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)}
                placeholder={cm.namePlaceholder} autoComplete="name"
                className={`${inputCls} ${submitted && !name.trim() ? inputErrCls : ""}`} />
              {submitted && !name.trim() && (
                <p className="text-xs font-body text-destructive">{cm.nameRequired}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="c-company" className="text-foreground font-body font-semibold text-sm">
                {cm.companyLabel} <span className="text-destructive">*</span>
              </Label>
              <Input id="c-company" value={company} onChange={(e) => setCompany(e.target.value)}
                placeholder={cm.companyPlaceholder} autoComplete="organization"
                className={`${inputCls} ${submitted && !company.trim() ? inputErrCls : ""}`} />
              {submitted && !company.trim() && (
                <p className="text-xs font-body text-destructive">{cm.companyRequired}</p>
              )}
            </div>
          </>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="c-email" className="text-foreground font-body font-semibold text-sm">
            {cm.emailLabel} <span className="text-destructive">*</span>
          </Label>
          <Input id="c-email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            placeholder={cm.emailPlaceholder} autoComplete="email"
            readOnly={isRescheduleMode}
            className={`${inputCls} ${emailErr ? inputErrCls : ""}`} />
          {emailErr && (
            <p className="text-xs font-body text-destructive">{emailErr}</p>
          )}
        </div>

        {!isRescheduleMode && (
          <div className="space-y-1.5">
            <Label htmlFor="c-desc" className="text-foreground font-body font-semibold text-sm">
              {cm.descriptionLabel}
            </Label>
            <Textarea id="c-desc" value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder={cm.descriptionPlaceholder} rows={2}
              className={`${inputCls} resize-none`} />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-border/60 accent-primary cursor-pointer" />
            <span className="text-xs font-body text-muted-foreground leading-relaxed select-none">
              {cm.privacyPrefix}
              <a href={`/${lang}/privacy`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{cm.privacyLink}</a>
              {cm.privacySuffix}
            </span>
          </label>
          {privacyError && <p className="text-xs font-body text-destructive pl-6">{privacyError}</p>}
        </div>

        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={scheduling}>
          {scheduling ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {cm.scheduling}
            </span>
          ) : (
            cm.scheduleBtn
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
              {cm.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-body text-sm sm:text-base">
              {cm.description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <fieldset className="px-6 pb-6 pt-2 min-h-[24rem] sm:min-h-[26rem] relative border-0 p-0 m-0"
          aria-label={step === "success" ? cm.bookingConfirmed : stepInfo[STEP_INDEX[step]].desc}>

          {(loadingSlots || scheduling) && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-card/80 backdrop-blur-sm rounded-b-lg">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
                <span className="text-sm font-body text-muted-foreground">
                  {scheduling ? cm.scheduling : cm.loadingAvailability}
                </span>
              </div>
            </div>
          )}

          {renderStepper()}
          {renderContent()}
        </fieldset>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
