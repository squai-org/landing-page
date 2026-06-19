import { useEffect, useRef, useState } from "react";
import { t } from "@/lib/content";
import { EMAIL_PATTERN, WAITLIST_AGE_OPTIONS, MAX_CHILD_AGES } from "@/constants";
import { joinWaitlist } from "@/services/waitlist.service";
import { ApiClientError } from "@/services/api-client";

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note?: string;
}

let nextRowId = 0;

const WaitlistModal = ({ open, onOpenChange, note }: Readonly<WaitlistModalProps>) => {
  const { waitlistModal: wl } = t();

  const emailRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [ageRows, setAgeRows] = useState<{ id: number; age: number | "" }[]>([
    { id: nextRowId++, age: "" },
  ]);
  const [ageError, setAgeError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    emailRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open) return;
    setEmail("");
    setEmailError("");
    setAgeRows([{ id: nextRowId++, age: "" }]);
    setAgeError("");
    setSubmitting(false);
    setSuccess(false);
    setServerError("");
  }, [open]);

  if (!open) return null;

  const addAgeRow = () => {
    if (ageRows.length >= MAX_CHILD_AGES) return;
    setAgeRows((rows) => [...rows, { id: nextRowId++, age: "" }]);
  };

  const removeAgeRow = (id: number) => {
    setAgeRows((rows) => rows.filter((row) => row.id !== id));
  };

  const updateAgeRow = (id: number, age: number) => {
    setAgeRows((rows) => rows.map((row) => (row.id === id ? { ...row, age } : row)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const isEmailValid = EMAIL_PATTERN.test(trimmedEmail);
    setEmailError(trimmedEmail ? (isEmailValid ? "" : wl.emailInvalid) : wl.emailRequired);

    const childAges = [...new Set(ageRows.map((row) => row.age).filter((age): age is number => age !== ""))];
    setAgeError(childAges.length === 0 ? wl.ageRequired : "");

    if (!isEmailValid || childAges.length === 0) return;

    setServerError("");
    setSubmitting(true);
    try {
      await joinWaitlist({ email: trimmedEmail, childAges });
      setSuccess(true);
    } catch (err) {
      setServerError(err instanceof ApiClientError ? err.message : wl.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="waitlist-overlay" onClick={() => onOpenChange(false)}>
      <div
        className="waitlist-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="waitlist-title"
        onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="waitlist-close"
          aria-label={wl.closeAriaLabel}
          onClick={() => onOpenChange(false)}>
          ×
        </button>

        {success ? (
          <div className="wl-success">
            <div className="wl-success-icon">✓</div>
            <h2 className="waitlist-title" id="waitlist-title">{wl.successTitle}</h2>
            <p className="waitlist-desc">{wl.successMessage}</p>
            <button type="button" className="btn-primary" onClick={() => onOpenChange(false)}>
              {wl.closeBtn}
            </button>
          </div>
        ) : (
          <>
            {note && <div className="wl-note">{note}</div>}
            <h2 className="waitlist-title" id="waitlist-title">{wl.title}</h2>
            <p className="waitlist-desc">{wl.description}</p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="wl-field">
                <label className="wl-label" htmlFor="waitlist-email">{wl.emailLabel}</label>
                <input
                  ref={emailRef}
                  id="waitlist-email"
                  type="email"
                  className="wl-input"
                  placeholder={wl.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                {emailError && <span className="wl-error">{emailError}</span>}
              </div>

              <div className="wl-field">
                <span className="wl-label">{wl.childAgeLabel}</span>
                <div className="wl-ages">
                  {ageRows.map((row) => (
                    <div className="wl-age-row" key={row.id}>
                      <select
                        className="wl-age-select"
                        value={row.age}
                        onChange={(e) => updateAgeRow(row.id, Number(e.target.value))}>
                        <option value="" disabled>{wl.agePlaceholder}</option>
                        {WAITLIST_AGE_OPTIONS.map((age) => (
                          <option key={age} value={age}>{age} años</option>
                        ))}
                      </select>
                      {ageRows.length > 1 && (
                        <button
                          type="button"
                          className="wl-age-remove"
                          aria-label={wl.removeAgeAriaLabel}
                          onClick={() => removeAgeRow(row.id)}>
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {ageError && <span className="wl-error">{ageError}</span>}
                {ageRows.length < MAX_CHILD_AGES ? (
                  <button type="button" className="wl-add-age-btn" onClick={addAgeRow}>
                    {wl.addAgeBtn}
                  </button>
                ) : (
                  <span className="wl-error">{wl.maxAgesReached}</span>
                )}
              </div>

              {serverError && <span className="wl-error wl-server-error">{serverError}</span>}

              <button type="submit" className="btn-primary wl-submit" disabled={submitting}>
                {submitting ? wl.submitting : wl.submitBtn}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default WaitlistModal;
