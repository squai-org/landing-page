import { content, type Lang } from "@/lib/content";
import { BrainCircuit, Sparkles, Building2 } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const cardStyles = [
  {
    icon: BrainCircuit,
    color: "primary",
    borderClass: "hover:border-primary/40",
    shadowClass: "hover:shadow-[0_0_30px_-5px_hsl(var(--primary)_/_0.2)]",
    iconBgClass: "bg-primary/10 group-hover:bg-primary/20",
    iconTextClass: "text-primary",
    titleGradient: "from-primary to-primary/50",
    illustration: "/illustrations/questions-cuate.svg",
  },
  {
    icon: Sparkles,
    color: "secondary",
    borderClass: "hover:border-secondary/40",
    shadowClass: "hover:shadow-[0_0_30px_-5px_hsl(var(--secondary)_/_0.2)]",
    iconBgClass: "bg-secondary/10 group-hover:bg-secondary/20",
    iconTextClass: "text-secondary",
    titleGradient: "from-secondary to-secondary/50",
    illustration: "/illustrations/artificial-intelligence-cuate.svg",
  },
  {
    icon: Building2,
    color: "accent",
    borderClass: "hover:border-accent/40",
    shadowClass: "hover:shadow-[0_0_30px_-5px_hsl(var(--accent)_/_0.2)]",
    iconBgClass: "bg-accent/10 group-hover:bg-accent/20",
    iconTextClass: "text-accent",
    titleGradient: "from-accent to-accent/50",
    illustration: "/illustrations/savings-cuate.svg",
  }
];

const ProblemSection = ({ lang }: { lang: Lang }) => {
  const t = content.problems;

  return (
    <section className="py-10 sm:py-16 relative">

      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        <AnimatedSection>
          <h2 className="font-headline font-black text-[1.75rem] sm:text-3xl md:text-5xl lg:text-[56px] text-center mb-8 sm:mb-10 px-2">
            {t.title[lang]}
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-7xl mx-auto">
          {t.items.map((item, i) => {
            const style = cardStyles[i];
            const Icon = style.icon;
            
            return (
              <AnimatedSection key={i} delay={i * 0.12}>
                <div className={`bg-[#12152A] rounded-2xl overflow-hidden border border-[rgba(124,140,255,0.15)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_25px_-5px_hsl(233,100%,74%,0.15)] group h-full flex flex-col`}>
                  {/* Illustration */}
                  <div className="w-full h-40 sm:h-48 bg-[#E8ECFF] flex items-center justify-center p-2 border-b border-[rgba(124,140,255,0.1)] relative">
                    <img 
                      src={style.illustration} 
                      alt={item.title[lang]}
                      width="400"
                      height="320"
                      className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-5 sm:p-8 flex flex-col flex-1">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-4 sm:mb-5 transition-colors ${style.iconBgClass}`}>
                    <Icon className={style.iconTextClass} size={22} />
                  </div>
                  <h3 className={`font-headline font-bold text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3 text-transparent bg-clip-text bg-gradient-to-r ${style.titleGradient}`}>
                    {item.title[lang]}
                  </h3>
                  <p className="text-muted-foreground font-body text-sm sm:text-base lg:text-lg leading-relaxed group-hover:text-foreground transition-colors">
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

export default ProblemSection;
