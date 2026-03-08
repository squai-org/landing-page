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
    <section className="py-16 relative">

      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection>
          <h2 className="font-headline font-black text-3xl md:text-5xl lg:text-[56px] text-center mb-10">
            {t.title[lang]}
          </h2>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {t.items.map((item, i) => {
            const style = cardStyles[i];
            const Icon = style.icon;
            
            return (
              <AnimatedSection key={i} delay={i * 0.12}>
                <div className={`bg-[#12152A] rounded-xl overflow-hidden border border-white/5 transition-all duration-300 hover:-translate-y-1 group h-full flex flex-col ${style.borderClass} ${style.shadowClass}`}>
                  {/* Illustration */}
                  <div className="w-full h-44 bg-[#E8ECFF] flex items-center justify-center p-2 border-b border-white/5">
                    <img 
                      src={style.illustration} 
                      alt={""}
                      className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-5 transition-colors ${style.iconBgClass}`}>
                    <Icon className={style.iconTextClass} size={24} />
                  </div>
                  <h3 className={`font-headline font-bold text-xl lg:text-2xl mb-3 text-transparent bg-clip-text bg-gradient-to-r ${style.titleGradient}`}>
                    {item.title[lang]}
                  </h3>
                  <p className="text-muted-foreground font-body text-lg leading-relaxed group-hover:text-foreground transition-colors">
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
