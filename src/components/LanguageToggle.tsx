import type { Lang } from "@/i18n/types";

interface LanguageToggleProps {
  lang: Lang;
  onChangeLang: (lang: Lang) => void;
  variant: "pill" | "inline";
  ariaLabelEn?: string;
  ariaLabelEs?: string;
}

const pillBase =
  "px-4 py-2 min-h-[44px] min-w-[44px] text-xs font-body font-bold transition-all duration-300 rounded-full";
const pillActive = "bg-primary text-primary-foreground shadow-lg";
const pillInactive = "text-muted-foreground hover:text-foreground";

const inlineBase =
  "min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors duration-200";
const inlineActive = "text-foreground";
const inlineInactive = "text-muted-foreground/50 hover:text-muted-foreground";

const LanguageToggle = ({
  lang,
  onChangeLang,
  variant,
  ariaLabelEn,
  ariaLabelEs,
}: LanguageToggleProps) => {
  if (variant === "inline") {
    return (
      <div className="hidden md:flex items-center gap-2 font-body text-sm font-semibold tracking-wider">
        <button
          onClick={() => onChangeLang("en")}
          aria-label={ariaLabelEn}
          className={`${inlineBase} ${lang === "en" ? inlineActive : inlineInactive}`}
        >
          EN
        </button>
        <span className="text-white/10">|</span>
        <button
          onClick={() => onChangeLang("es")}
          aria-label={ariaLabelEs}
          className={`${inlineBase} ${lang === "es" ? inlineActive : inlineInactive}`}
        >
          ES
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center rounded-full border border-white/10 bg-white/5 overflow-hidden p-0.5">
      <button
        onClick={() => onChangeLang("en")}
        aria-label={ariaLabelEn}
        className={`${pillBase} ${lang === "en" ? pillActive : pillInactive}`}
      >
        EN
      </button>
      <button
        onClick={() => onChangeLang("es")}
        aria-label={ariaLabelEs}
        className={`${pillBase} ${lang === "es" ? pillActive : pillInactive}`}
      >
        ES
      </button>
    </div>
  );
};

export default LanguageToggle;
