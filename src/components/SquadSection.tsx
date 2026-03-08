import React from "react";
import { content, type Lang } from "@/lib/content";
import { motion } from "framer-motion";

const borderColorMap: Record<string, string> = {
  primary: "border-b-[#7C8CFF]",
  accent: "border-b-[#7C8CFF]",
  secondary: "border-b-[#7C8CFF]",
};

const pillColorMap: Record<string, string> = {
  primary: "border-[rgba(68,212,200,0.3)] text-[#44D4C8]",
  accent: "border-[rgba(68,212,200,0.3)] text-[#44D4C8]",
  secondary: "border-[rgba(68,212,200,0.3)] text-[#44D4C8]",
};

const hoverGlowMap: Record<string, string> = {
  primary: "hover:shadow-[0_0_25px_-5px_#7C8CFF]",
  accent: "hover:shadow-[0_0_25px_-5px_#7C8CFF]",
  secondary: "hover:shadow-[0_0_25px_-5px_#7C8CFF]",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30, 
    scale: 0.94,
    filter: "blur(4px)"
  },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: "blur(0px)",
    transition: { 
      duration: 0.8, 
      ease: [0.21, 1.11, 0.81, 0.99] // Custom "premium" bounce-out
    } 
  },
};

const SquadSection = ({ lang }: { lang: Lang }) => {
  const t = content.squad;

  return (
    <section id="squad" className="py-24 bg-deep relative overflow-hidden">
      <div className="glow-orb-gold w-[400px] h-[400px] -top-32 -right-32" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="font-headline font-black text-3xl md:text-5xl lg:text-[56px] text-center mb-4">
            {t.title[lang]}
          </h2>
          <p className="text-muted-foreground font-body text-lg text-center max-w-2xl mx-auto mb-16">
            {t.sub[lang]}
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {t.members.map((member, i) => {
            const person = t.gallery[i];
            const imgIndex = i + 1;

            return (
              <motion.div
                key={i}
                variants={cardVariants}
                className="flex flex-col h-full group transition-all duration-300 hover:-translate-y-2"
              >
                <div
                  className={`bg-[#12152A] rounded-2xl overflow-hidden border border-[rgba(124,140,255,0.15)] hover:border-[rgba(124,140,255,0.4)] flex flex-col h-full shadow-md ${hoverGlowMap[member.borderColor]}`}
                >
                  {/* Top: Photo (aspect-[3/4]) */}
                  <div className="w-full aspect-[3/4] bg-muted/20 relative flex items-center justify-center overflow-hidden border-b border-[rgba(124,140,255,0.1)]">
                    <img 
                      src={`/${imgIndex}.JPG`} 
                      alt={`${person.name} - ${person.role[lang]}`} 
                      className="w-full h-full object-cover object-top grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105 absolute inset-0 z-10"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src.endsWith('.JPG')) {
                          target.src = `/${imgIndex}.png`;
                        } else {
                          target.style.display = 'none';
                          target.parentElement?.classList.add('bg-[#1A1E38]');
                        }
                      }}
                    />
                    {/* Fallback Avatar */}
                    <div className="text-muted-foreground/30 z-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                  </div>

                  {/* Bottom: Text Content */}
                  <div className={`p-6 flex-1 flex flex-col border-b-4 ${borderColorMap[member.borderColor]}`}>
                    <div className="flex items-end justify-between mb-3 gap-2">
                      <div>
                        <h4 className="font-headline font-bold text-xl lg:text-2xl text-foreground mb-1">
                          {person.name}
                        </h4>
                        <h3 className="font-headline font-semibold text-sm text-primary">
                          {member.role[lang]}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="font-body font-bold text-xs uppercase tracking-wider text-accent mb-4">
                      {member.specialty[lang]}
                    </p>
                    <p className="font-body text-base lg:text-lg text-muted-foreground mb-6 flex-1 leading-relaxed">
                      {member.desc[lang]}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {member.tiers[lang].map((tier) => (
                        <span
                          key={tier}
                          className={`text-xs font-body font-medium px-3 py-1.5 rounded-full border bg-[#1A1E38] ${pillColorMap[member.borderColor]}`}
                        >
                          {tier}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default SquadSection;