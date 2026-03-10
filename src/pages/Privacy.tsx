import { content } from "@/lib/content";
import { useLang } from "@/hooks/use-lang";
import SeoHead from "@/components/SeoHead";
import GradientBackground from "@/components/GradientBackground";
import SquaiLogo from "@/components/SquaiLogo";

const Privacy = () => {
  const { lang, setLang } = useLang();
  const t = content.privacy;

  return (
    <div className="min-h-screen relative overflow-x-clip">
      <SeoHead
        lang={lang}
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
        {/* Minimal top bar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0C1A]/80 backdrop-blur-md border-b border-white/5 py-4">
          <div className="container mx-auto flex items-center justify-between px-5 sm:px-6 md:px-8">
            <a href={`/${lang}`} className="hover:opacity-80 transition-opacity flex-shrink-0">
              <SquaiLogo height={32} />
            </a>
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
        </nav>

        {/* Content */}
        <main className="container mx-auto px-5 sm:px-6 md:px-8 pt-28 pb-16 sm:pb-24 max-w-3xl">
          <h1 className="font-headline font-black text-3xl md:text-5xl text-white mb-3">
            {t.title[lang]}
          </h1>
          <p className="text-muted-foreground font-body text-sm mb-12">
            {t.lastUpdated[lang]}
          </p>

          <div className="space-y-10">
            {t.sections.map((section, i) => (
              <section key={i}>
                <h2 className="font-headline font-extrabold text-xl text-white mb-3">
                  {section.heading[lang]}
                </h2>
                <p className="text-muted-foreground font-body text-base leading-relaxed">
                  {section.body[lang]}
                </p>
              </section>
            ))}
          </div>

          {/* Back link */}
          <div className="mt-16 pt-8 border-t border-border">
            <a
              href={`/${lang}`}
              className="text-primary hover:underline font-body text-sm transition-colors min-h-[44px] inline-flex items-center"
            >
              {t.backHome[lang]}
            </a>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Privacy;
