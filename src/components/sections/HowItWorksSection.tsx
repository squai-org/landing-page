import { t } from "@/lib/content";
import { useLang } from "@/hooks/use-lang";
import { motion } from "framer-motion";

const HowItWorksSection = () => {
  const { lang } = useLang();
  const { howItWorks } = t(lang);
  const stepIcons = [
    <svg width="32" height="32" fill="none" viewBox="0 0 32 32" key="1" className="stroke-current drop-shadow-[0_0_8px_currentColor]"><path d="M16 28c6.627 0 12-5.373 12-12S22.627 4 16 4 4 9.373 4 16c0 2.21.597 4.28 1.64 6.06L4 28l5.94-1.64A11.96 11.96 0 0 0 16 28Z" strokeWidth="2"/><path d="M11 15h10M11 19h6" strokeWidth="2" strokeLinecap="round"/></svg>,
    <svg width="32" height="32" fill="none" viewBox="0 0 32 32" key="2" className="stroke-current drop-shadow-[0_0_8px_currentColor]"><rect x="6" y="6" width="20" height="20" rx="3" strokeWidth="2"/><path d="M10 12h12M10 16h8M10 20h4" strokeWidth="2" strokeLinecap="round"/></svg>,
    <svg width="32" height="32" fill="none" viewBox="0 0 32 32" key="3" className="stroke-current drop-shadow-[0_0_8px_currentColor]"><path d="M16 4l4 8-4 16-4-16 4-8Z" strokeWidth="2"/><circle cx="16" cy="24" r="2" fill="currentColor"/></svg>,
    <svg width="32" height="32" fill="none" viewBox="0 0 32 32" key="4" className="stroke-current drop-shadow-[0_0_8px_currentColor]"><path d="M8 8h16v16H8V8Z" strokeWidth="2"/><path d="M16 16l6 6M16 16l-6 6" strokeWidth="2"/></svg>,
    <svg width="32" height="32" fill="none" viewBox="0 0 32 32" key="5" className="stroke-current drop-shadow-[0_0_8px_currentColor]"><rect x="8" y="8" width="16" height="16" rx="3" strokeWidth="2"/><circle cx="16" cy="16" r="6" strokeWidth="2"/><path d="M14 16l2 2 4-4" strokeWidth="2" strokeLinecap="round"/></svg>,
    <svg width="32" height="32" fill="none" viewBox="0 0 32 32" key="6" className="stroke-current drop-shadow-[0_0_8px_currentColor]"><circle cx="16" cy="16" r="12" strokeWidth="2"/><path d="M12 20v-2a4 4 0 0 1 8 0v2" strokeWidth="2"/></svg>,
  ];

  const colorStyles = [
    { text: "text-primary", gradient: "from-primary to-primary/50", border: "border-t-primary", shadow: "hover:shadow-[0_0_25px_-5px_hsl(var(--primary)_/_0.5)]" },
    { text: "text-secondary", gradient: "from-secondary to-secondary/50", border: "border-t-secondary", shadow: "hover:shadow-[0_0_25px_-5px_hsl(var(--secondary)_/_0.5)]" },
    { text: "text-accent", gradient: "from-accent to-accent/50", border: "border-t-accent", shadow: "hover:shadow-[0_0_25px_-5px_hsl(var(--accent)_/_0.5)]" },
  ];
  const stepIllustrations = [
    "/illustrations/video-call-cuate.svg",
    "/illustrations/agreement-cuate.svg",
    "/illustrations/team-spirit-cuate.svg",
    "/illustrations/prototyping-process-cuate.svg",
    "/illustrations/product-iteration-cuate.svg",
    "/illustrations/customer-support-cuate.svg"
  ];

  return (
    <section id="how-it-works" className="py-10 sm:py-16 relative">
      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="font-headline font-black text-[1.75rem] sm:text-3xl md:text-5xl lg:text-[56px] mb-6 sm:mb-10 px-2">
            {howItWorks.title}
          </h2>
          <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto px-2">
            {howItWorks.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 max-w-7xl mx-auto">
          {howItWorks.steps.map((step, i) => {
            const style = colorStyles[i % colorStyles.length];
            return (
              <motion.div
                key={step.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`bg-[#12152A] rounded-2xl overflow-hidden border border-[rgba(124,140,255,0.15)] hover:border-[rgba(124,140,255,0.4)] flex flex-col h-full shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_25px_-5px_hsl(var(--primary)_/_0.15)] group`}
              >
                <div className="w-full h-36 sm:h-48 bg-[#E8ECFF] flex items-center justify-center p-2 border-b border-[rgba(124,140,255,0.1)] relative">
                  <img 
                    src={stepIllustrations[i]} 
                    alt={step.name} 
                    width="400"
                    height="320"
                    className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className={`flex-1 p-5 sm:p-6 lg:p-8 flex flex-col border-b-4 ${style.border}`}>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className={`font-headline font-black text-xl sm:text-2xl opacity-50 ${style.text}`}>0{i + 1}</span>
                    <span className={`w-9 h-9 sm:w-10 sm:h-10 rounded bg-[#1A1E38] border border-[rgba(124,140,255,0.1)] flex items-center justify-center ${style.text}`}>
                      {stepIcons[i]}
                    </span>
                  </div>
                  <h3 className={`mb-2 sm:mb-3 font-headline font-extrabold text-lg sm:text-xl lg:text-2xl text-transparent bg-clip-text bg-gradient-to-r ${style.gradient}`}>
                    {step.name}
                  </h3>
                  <p className="font-body text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
