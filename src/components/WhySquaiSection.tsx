import { useState, useEffect } from "react";
import { content, type Lang } from "@/lib/content";
import { Users, Globe, Zap, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import AnimatedSection from "./AnimatedSection";

const icons = [Users, Globe, Zap, Rocket];

const illustrations = [
  "/illustrations/team-work-cuate.svg",
  "/illustrations/conversation-cuate.svg",
  "/illustrations/machine-learning-cuate.svg",
  "/illustrations/self-confidence-cuate.svg",
];

// useActiveSection hook — tracks which item is in view
function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { 
          threshold: 0.1, // Trigger as soon as a small part is in the zone
          rootMargin: "-45% 0px -45% 0px" // Trigger when the item enters the middle 10% of the screen
        }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [ids]);

  return activeId;
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const titleVariants = {
  active: {
    opacity: 1,
    y: 0,
    backgroundImage: "linear-gradient(135deg, #7C8CFF, #F2C94C)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  inactive: {
    opacity: 0.15,
    y: 20,
    backgroundImage: "none",
    WebkitBackgroundClip: "unset",
    WebkitTextFillColor: "white",
  }
};

const textVariants = {
  active: { opacity: 1, y: 0 },
  inactive: { opacity: 0.15, y: 10 }
};

const WhySquaiSection = ({ lang }: { lang: Lang }) => {
  const t = content.whySquai;
  const ids = t.items.map((_, i) => `why-squai-item-${i}`);
  const activeId = useActiveSection(ids);

  const activeIndex = ids.indexOf(activeId);

  return (
    <section className="relative">
      <div className="container mx-auto px-4">
        <div className="hidden md:block pt-16">
          <h2 className="font-headline font-black text-3xl md:text-5xl lg:text-[56px] text-center w-full mb-8 text-white">
            {t.title[lang]}
          </h2>
        </div>

        {/* Desktop Layout: Sticky Scroll */}
        <div className="hidden md:flex gap-4 items-start">
          {/* LEFT: Sticky Image Panel */}
          <div className="flex-1 sticky top-0 h-screen flex items-center justify-center overflow-hidden">
            <div className="relative flex items-center justify-center w-full max-w-3xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeId}
                  src={illustrations[activeIndex]}
                  initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-auto object-contain relative z-10"
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Center connector column */}
          <div className="hidden md:flex flex-col items-center w-12 sticky top-0 h-screen">
            {/* Top line */}
            <div className="flex-1 w-[1px] bg-gradient-to-b from-transparent via-[#7C8CFF]/40 to-[#7C8CFF]/40" />
            
            {/* Active icon */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="w-12 h-12 rounded-lg flex items-center justify-center z-10
                           bg-primary/10 shrink-0"
              >
                {(() => {
                  const ActiveIcon = icons[activeIndex];
                  return <ActiveIcon className="text-primary" size={26} />;
                })()}
              </motion.div>
            </AnimatePresence>
            
            {/* Bottom line */}
            <div className="flex-1 w-[1px] bg-gradient-to-b from-[#7C8CFF]/40 via-[#7C8CFF]/40 to-transparent" />
          </div>

          {/* RIGHT: Scrollable Content Column */}
          <div className="flex-1">
            {t.items.map((item, i) => {
              const isActive = activeId === ids[i];
              
              return (
                <div 
                  key={ids[i]} 
                  id={ids[i]} 
                  className="min-h-screen flex flex-col justify-center items-start px-8 md:px-16"
                >
                  <div className="flex flex-col gap-3">
                    <motion.h3
                      className="font-headline font-black text-3xl lg:text-5xl"
                      variants={titleVariants}
                      animate={isActive ? "active" : "inactive"}
                      transition={{ duration: 0.4 }}
                    >
                      {item.title[lang]}
                    </motion.h3>
                    <motion.p 
                      className="font-body text-xl text-muted-foreground leading-relaxed max-w-lg"
                      variants={textVariants}
                      animate={isActive ? "active" : "inactive"}
                      transition={{ duration: 0.4 }}
                    >
                      {item.desc[lang]}
                    </motion.p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE FALLBACK: Vertical Stacked Cards */}
        <div className="md:hidden py-16">
          <AnimatedSection>
            <h2 className="font-headline font-black text-3xl text-center mb-10 text-white">
              {t.title[lang]}
            </h2>
          </AnimatedSection>
          <div className="grid gap-8">
            {t.items.map((item, i) => {
              const Icon = icons[i];
              return (
                <AnimatedSection key={i} delay={i * 0.1}>
                  <div className="bg-[#12152A] rounded-2xl overflow-hidden border border-[rgba(124,140,255,0.15)] p-8 flex flex-col">
                    <div className="w-full h-48 bg-[#E8ECFF] flex items-center justify-center p-2 mb-8 rounded-xl overflow-hidden">
                      <img 
                        src={illustrations[i]} 
                        alt="" 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                      <Icon className="text-primary" size={24} />
                    </div>
                    <h3 className="font-headline font-extrabold text-xl mb-3 text-white">{item.title[lang]}</h3>
                    <p className="text-muted-foreground font-body text-base leading-relaxed">
                      {item.desc[lang]}
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySquaiSection;
