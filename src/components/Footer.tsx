import SquaiLogo from "./SquaiLogo";
import { content, type Lang } from "@/lib/content";

interface FooterProps {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const Footer = ({ lang, setLang }: FooterProps) => {
  const t = content.footer;

  return (
    <footer className="bg-surface relative overflow-hidden">
      {/* Gradient top border */}
      <div className="h-[3px] gradient-bar" />


      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <a href="/" className="hover:opacity-80 transition-opacity">
              <SquaiLogo height={28} />
            </a>
            <p className="text-muted-foreground font-body text-sm mt-3 max-w-xs">
              {t.tagline[lang]}
            </p>
          </div>
          <div className="flex items-center gap-6">
            {t.links[lang].map((label, i) => (
              <a
                key={i}
                href={`#${t.sections[i]}`}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-body text-sm"
              >
                {label}
              </a>
            ))}
            <div className="flex items-center rounded-full border border-border overflow-hidden">
              <button
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 text-xs font-body font-semibold transition-all duration-200 ${
                  lang === "en"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("es")}
                className={`px-2.5 py-1 text-xs font-body font-semibold transition-all duration-200 ${
                  lang === "es"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ES
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground/60 font-body text-xs">{t.copyright}</p>
          <p className="text-muted-foreground/40 font-body text-xs">
            {lang === "en" ? "Illustrations by " : "Ilustraciones por "} 
            <a href="https://storyset.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Storyset.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
