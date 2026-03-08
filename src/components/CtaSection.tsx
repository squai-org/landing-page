import { content, type Lang } from "@/lib/content";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";

const CtaSection = ({ lang }: { lang: Lang }) => {
  const t = content.ctaSection;

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-surface-light">
      {/* Smoother Qovery-style easing transition from dark section */}
      <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none z-10 gradient-easing-t rotate-180 opacity-60" />
      
      {/* Background glow blob at transition */}
      <div className="glow-blob w-[600px] h-[400px] -top-48 left-0 bg-accent/10 blur-[120px]" />
      <div className="absolute inset-0 dot-grid opacity-[0.2]" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <AnimatedSection>
          <div className="w-80 h-80 mx-auto mb-8 flex items-center justify-center p-0">
            <img src="/illustrations/completed-cuate.svg" alt="" className="w-full h-full object-contain" />
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
