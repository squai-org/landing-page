import { t } from "@/lib/content";
import { useLang } from "@/hooks/use-lang";
import SeoHead from "@/components/SeoHead";
import LanguageToggle from "@/components/LanguageToggle";
import GradientBackground from "@/layouts/GradientBackground";
import SquaiLogo from "@/components/SquaiLogo";

const Privacy = () => {
  const { lang, setLang } = useLang();
  const { privacy: priv } = t(lang);

  return (
    <div className="min-h-screen relative overflow-x-clip">
      <SeoHead
        title={{
          en: "Privacy Policy — Squai",
          es: "Política de Privacidad — Squai",
        }}
        description={{
          en: "Read Squai's privacy policy. Learn how we collect, use, and protect your data as an AI implementation consultancy.",
          es: "Lee la política de privacidad de Squai. Conoce cómo recopilamos, usamos y protegemos tus datos como consultoría de IA.",
        }}
        path="/privacy"
      />
      <GradientBackground />
      <div className="relative z-10">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0C1A]/80 backdrop-blur-md border-b border-white/5 py-4">
          <div className="container mx-auto flex items-center justify-between px-5 sm:px-6 md:px-8">
            <a href={`/${lang}`} className="hover:opacity-80 transition-opacity flex-shrink-0">
              <SquaiLogo height={32} />
            </a>
            <LanguageToggle
              lang={lang}
              onChangeLang={setLang}
              variant="pill"
              ariaLabelEn={priv.switchToEnglish}
              ariaLabelEs={priv.switchToSpanish}
            />
          </div>
        </nav>

        <main className="container mx-auto px-5 sm:px-6 md:px-8 pt-28 pb-16 sm:pb-24 max-w-3xl">
          <h1 className="font-headline font-black text-3xl md:text-5xl text-white mb-3">
            {priv.title}
          </h1>
          <p className="text-muted-foreground font-body text-sm mb-12">
            {priv.lastUpdated}
          </p>

          <div className="space-y-10">
            {priv.sections.map((section, i) => (
              <section key={section.heading}>
                <h2 className="font-headline font-extrabold text-xl text-white mb-3">
                  {section.heading}
                </h2>
                <p className="text-muted-foreground font-body text-base leading-relaxed">
                  {section.body}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-border">
            <a
              href={`/${lang}`}
              className="text-primary hover:underline font-body text-sm transition-colors min-h-[44px] inline-flex items-center"
            >
              {priv.backHome}
            </a>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Privacy;
