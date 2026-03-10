import SquaiLogo from "./SquaiLogo";
import { content, type Lang } from "@/lib/content";

interface FooterProps {
  lang: Lang;
  setLang: (l: Lang) => void;
  onOpenContact?: () => void;
}

const Footer = ({ lang, setLang, onOpenContact }: FooterProps) => {
  const t = content.footer;

  return (
    <footer id="contact" className="relative">
      {/* Gradient top border */}
      <div className="h-[3px] gradient-bar" />


      <div className="container mx-auto px-5 sm:px-6 py-8 sm:py-12 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
          <div>
            <a href={`/${lang}`} className="hover:opacity-80 transition-opacity">
              <SquaiLogo height={28} />
            </a>
            <p className="text-muted-foreground font-body text-sm mt-3 max-w-xs">
              {t.tagline[lang]}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex items-center gap-6 flex-wrap">
              {t.links[lang].map((label, i) => (
                <a
                  key={t.sections[i]}
                  href={`#${t.sections[i]}`}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-body text-sm min-h-[44px] inline-flex items-center"
                >
                  {label}
                </a>
              ))}
            </div>
            <div className="flex items-center rounded-full border border-white/10 bg-white/5 overflow-hidden p-0.5">
              <button
                onClick={() => setLang("en")}
                aria-label="Switch to English"
                className={`px-4 py-2 min-h-[44px] min-w-[44px] text-xs font-body font-bold transition-all duration-300 rounded-full ${
                  lang === "en"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("es")}
                aria-label="Cambiar a Español"
                className={`px-4 py-2 min-h-[44px] min-w-[44px] text-xs font-body font-bold transition-all duration-300 rounded-full ${
                  lang === "es"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ES
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-muted-foreground/60 font-body text-xs">{t.copyright}</p>
          <p className="text-muted-foreground/40 font-body text-xs">
            {lang === "en" ? "Illustrations by " : "Ilustraciones por "} 
            <a href="https://storyset.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors min-h-[44px] inline-flex items-center">Storyset.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
