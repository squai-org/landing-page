import { content, type Lang } from "@/lib/content";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";

const CtaSection = ({ lang, onOpenContact }: { lang: Lang; onOpenContact: () => void }) => {
  const t = content.ctaSection;

  return (
    <section className="py-10 sm:py-16 relative">

      <div className="container mx-auto px-5 sm:px-6 text-center relative z-10">
        <AnimatedSection>
          <div className="w-full max-w-[220px] sm:max-w-[300px] md:max-w-xl mx-auto mb-2 md:mb-4 flex items-center justify-center p-0">
            <img src="/illustrations/completed-cuate.svg" alt="Task completed illustration" width="600" height="600" loading="lazy" decoding="async" className="w-full h-auto object-contain" />
          </div>
          <h2 className="font-headline font-black text-[1.75rem] sm:text-3xl md:text-5xl lg:text-[56px] mb-4 sm:mb-6 gradient-wave-text pb-2 px-2">
            {t.headline[lang]}
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <p className="text-muted-foreground font-body text-base sm:text-lg lg:text-xl max-w-xl mx-auto mb-8 sm:mb-10 px-2">
            {t.sub[lang]}
          </p>
          <Button variant="cta" size="lg" onClick={onOpenContact}>
            {t.cta[lang]}
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CtaSection;
