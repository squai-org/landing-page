import SquaiLogo from "@/components/SquaiLogo";
import LanguageToggle from "@/components/LanguageToggle";
import { t } from "@/lib/content";
import { useLang } from "@/hooks/use-lang";

interface FooterProps {
  onOpenContact?: () => void;
}

const Footer = ({ onOpenContact }: FooterProps) => {
  const { lang, setLang } = useLang();
  const { footer } = t(lang);

  return (
    <footer id="contact" className="relative">
      <div className="h-[3px] gradient-bar" />


      <div className="container mx-auto px-5 sm:px-6 py-8 sm:py-12 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
          <div>
            <a href={`/${lang}`} className="hover:opacity-80 transition-opacity">
              <SquaiLogo height={28} />
            </a>
            <p className="text-muted-foreground font-body text-sm mt-3 max-w-xs">
              {footer.tagline}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex items-center gap-6 flex-wrap">
              {footer.links.map((label, i) => (
                <a
                  key={footer.sections[i]}
                  href={`#${footer.sections[i]}`}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-body text-sm min-h-[44px] inline-flex items-center"
                >
                  {label}
                </a>
              ))}
            </div>
            <LanguageToggle
              lang={lang}
              onChangeLang={setLang}
              variant="pill"
              ariaLabelEn={footer.switchToEnglish}
              ariaLabelEs={footer.switchToSpanish}
            />
          </div>
        </div>
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-muted-foreground/60 font-body text-xs">{footer.copyright}</p>
          <p className="text-muted-foreground/40 font-body text-xs">
            {footer.illustrationsBy} 
            <a href="https://storyset.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors min-h-[44px] inline-flex items-center">Storyset.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
