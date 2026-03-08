import { useState, useCallback, useEffect } from "react";
import { content, type Lang } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lang: Lang;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactModal = ({ open, onOpenChange, lang }: ContactModalProps) => {
  const t = content.contactModal;

  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Reset form state when modal closes
  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => {
        setEmail("");
        setDescription("");
        setEmailTouched(false);
        setSubmitted(false);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  const emailError = useCallback((): string | null => {
    if (!emailTouched && !submitted) return null;
    if (!email.trim()) return t.emailRequired[lang];
    if (!EMAIL_REGEX.test(email.trim())) return t.emailInvalid[lang];
    return null;
  }, [email, emailTouched, submitted, lang, t]);

  const isValid = email.trim() !== "" && EMAIL_REGEX.test(email.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    // No submit action — intentionally empty
    onOpenChange(false);
  };

  const error = emailError();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-primary/20 bg-card/95 backdrop-blur-xl shadow-2xl shadow-primary/10 sm:max-w-md">
        {/* Gradient top accent bar */}
        <div className="absolute inset-x-0 top-0 h-1 rounded-t-lg gradient-bar" />

        <DialogHeader className="pt-2">
          <DialogTitle className="font-headline font-black text-xl sm:text-2xl gradient-wave-text pb-1">
            {t.title[lang]}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-body text-sm sm:text-base">
            {t.description[lang]}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-5 mt-2">
          {/* Email field */}
          <div className="space-y-2">
            <Label
              htmlFor="contact-email"
              className="text-foreground font-body font-semibold text-sm"
            >
              {t.emailLabel[lang]}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contact-email"
              type="email"
              placeholder={t.emailPlaceholder[lang]}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              autoComplete="email"
              className={`bg-background/60 border-border/60 font-body placeholder:text-muted-foreground/50 focus-visible:ring-primary/60 transition-colors ${
                error
                  ? "border-destructive/70 focus-visible:ring-destructive/40"
                  : ""
              }`}
            />
            <div
              className={`text-xs font-body text-destructive transition-all duration-200 ${
                error
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-1 pointer-events-none"
              }`}
              role="alert"
              aria-live="polite"
            >
              {error || "\u00A0"}
            </div>
          </div>

          {/* Description field */}
          <div className="space-y-2">
            <Label
              htmlFor="contact-description"
              className="text-foreground font-body font-semibold text-sm"
            >
              {t.descriptionLabel[lang]}
            </Label>
            <Textarea
              id="contact-description"
              placeholder={t.descriptionPlaceholder[lang]}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="bg-background/60 border-border/60 font-body placeholder:text-muted-foreground/50 focus-visible:ring-primary/60 resize-none transition-colors"
            />
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full"
            disabled={submitted && !isValid}
          >
            {t.submit[lang]}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
