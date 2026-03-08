import { content, type Lang } from "@/lib/content";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";

const CtaSection = ({ lang }: { lang: Lang }) => {
  const t = content.ctaSection;

  return (
    <section className="py-16 relative">

      <div className="container mx-auto px-4 text-center relative z-10">
        <AnimatedSection>
          <div className="w-full max-w-[300px] sm:max-w-md md:max-w-xl mx-auto -mb-4 sm:-mb-8 flex items-center justify-center p-0">
            <img src="/illustrations/completed-cuate.svg" alt="" className="w-full h-auto object-contain transform translate-y-6 sm:translate-y-10" />
          </div>
          <h2 className="font-headline font-black text-3xl md:text-5xl lg:text-[56px] mb-6 gradient-wave-text pb-2">
            {t.headline[lang]}
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <p className="text-muted-foreground font-body text-lg lg:text-xl max-w-xl mx-auto mb-10">
            {t.sub[lang]}
          </p>
          <Button variant="cta" size="lg">
            {t.cta[lang]}
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CtaSection;
