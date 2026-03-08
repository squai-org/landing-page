import { content, type Lang } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Check, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";

const borderColors: Record<string, string> = {
  primary: "border-t-[hsl(233,100%,74%)]",
  accent: "border-t-[hsl(43,87%,63%)] border-[hsl(43,87%,63%,0.3)]",
  secondary: "border-t-[hsl(175,58%,55%)]",
};

const hoverGlows: Record<string, string> = {
  primary: "hover:shadow-[0_0_30px_-5px_hsl(233,100%,74%,0.15)]",
  accent: "hover:shadow-[0_0_30px_-5px_hsl(43,87%,63%,0.2)]",
  secondary: "hover:shadow-[0_0_30px_-5px_hsl(175,58%,55%,0.15)]",
};

const slideDirections = [-1, 0, 1]; // left, center, right

const ServicesSection = ({ lang }: { lang: Lang }) => {
  const t = content.services;

  return (
    <section id="services" className="py-16 relative">

      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-headline font-black text-3xl md:text-5xl lg:text-[56px] text-center mb-10"
        >
          {t.title[lang]}
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-6 max-w-7xl mx-auto items-start">
          {t.tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: slideDirections[i] * 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: i * 0.15, ease: "easeOut" }}
            >
              <div
                className={`relative bg-[#12152A] rounded-xl border border-[rgba(124,140,255,0.15)] hover:border-[rgba(124,140,255,0.4)] border-t-4 ${borderColors[tier.borderColor]} ${hoverGlows[tier.borderColor]} transition-all duration-200 hover:-translate-y-1 h-full flex flex-col ${
                  tier.popular ? "lg:scale-[1.03]" : ""
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 right-6 bg-accent text-accent-foreground text-xs font-body font-bold px-4 py-1 rounded-full">
                    {lang === "en" ? "Most Popular" : "Más Popular"}
                  </div>
                )}

                <div className="p-8 flex flex-col h-full text-center">
                  <p className="text-primary font-body font-semibold text-[10px] uppercase tracking-[0.2em] mb-4">
                    {tier.label[lang]}
                  </p>
                  <h3 className="font-headline font-black text-2xl lg:text-3xl mb-4">{tier.name[lang]}</h3>

                  <div className="mb-6 h-20 flex flex-col justify-center">
                    <div className="flex items-center justify-center gap-2">
                       {tier.pricePrefix[lang] && (
                        <p className="font-body font-semibold text-sm text-accent">{tier.pricePrefix[lang]}</p>
                       )}
                       <p className="font-headline font-black text-4xl text-primary">{tier.price}</p>
                    </div>
                    <p className="font-body font-medium text-xs text-muted-foreground mt-2">{tier.priceNote[lang]}</p>
                  </div>

                  <Button variant="cta" className="w-full mb-8 h-12 text-base font-bold shrink-0" asChild>
                    <a href="#contact">{tier.cta[lang]}</a>
                  </Button>

                  <p className="text-accent font-body font-light text-sm italic leading-relaxed mb-8 px-2 min-h-[60px]">
                    {tier.partnership[lang]}
                  </p>

                  <div className="w-full h-px bg-white/5 mb-8" />

                  <div className="flex-1 text-left">
                    <p className="font-body font-semibold text-xs uppercase tracking-wider text-foreground mb-5">
                      {lang === "en" ? "What you get:" : "Lo que obtienes:"}
                    </p>
                    <ul className="space-y-4 mb-8">
                      {tier.items[lang].map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-muted-foreground font-body text-sm lg:text-base leading-snug">
                          <Check className="text-primary mt-1 shrink-0" size={16} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex flex-wrap justify-between gap-y-2 mt-auto">
                    <div className="flex items-center gap-2 text-muted-foreground font-body text-xs">
                       <Clock size={12} className="text-primary" />
                       {tier.duration[lang]}
                    </div>
                    <div className="flex items-center gap-2 text-[#666E9A] font-body text-xs italic">
                       <Users size={12} />
                       {tier.squadAssigned[lang]}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;