import { content, type Lang } from "@/lib/content";
import { Users, Globe, Zap, Rocket } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const icons = [Users, Globe, Zap, Rocket];

const illustrations = [
  "/illustrations/team-work-cuate.svg",
  "/illustrations/conversation-cuate.svg",
  "/illustrations/machine-learning-cuate.svg",
  "/illustrations/self-confidence-cuate.svg",
];

const WhySquaiSection = ({ lang }: { lang: Lang }) => {
  const t = content.whySquai;

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <h2 className="font-headline font-black text-3xl md:text-5xl lg:text-[56px] text-center mb-10">
            {t.title[lang]}
          </h2>
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {t.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-[#12152A] rounded-2xl overflow-hidden border border-[rgba(124,140,255,0.15)] hover:border-[rgba(124,140,255,0.4)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_25px_-5px_hsl(233,100%,74%,0.15)] group h-full flex flex-col">
                  {/* Illustration */}
                  <div className="w-full h-40 bg-[#E8ECFF] flex items-center justify-center p-2">
                    <img 
                      src={illustrations[i]} 
                      alt="" 
                      className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  {/* Content */}
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                      <Icon className="text-primary" size={24} />
                    </div>
                    <h3 className="font-headline font-extrabold text-xl lg:text-2xl mb-3">{item.title[lang]}</h3>
                    <p className="text-muted-foreground font-body text-base lg:text-lg leading-relaxed">
                      {item.desc[lang]}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhySquaiSection;
