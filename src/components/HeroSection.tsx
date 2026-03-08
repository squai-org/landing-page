import { content, type Lang } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const word: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const HeroSection = ({ lang }: { lang: Lang }) => {
  const t = content.hero;
  const headline = t.headline[lang];
  const words = headline.split(" ");

  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-surface-light">
      {/* Background decoration */}
      <div className="absolute inset-0 dot-grid opacity-[0.2]" />
      <div className="absolute inset-0 glow-radial opacity-30" />
      
      {/* Smoother Qovery-style easing transition to dark section */}
      <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none z-10 gradient-easing-b" />
      
      {/* Background glow blob at transition */}
      <div className="glow-blob w-[600px] h-[400px] -bottom-48 left-1/2 -translate-x-1/2 bg-primary/20 blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Text */}
          <div className="flex-1 text-center lg:text-left">
            <motion.h1
              variants={container}
              initial="hidden"
              animate="show"
              className="font-headline font-black text-4xl sm:text-5xl md:text-6xl lg:text-[80px] leading-tight mb-4 gradient-wave-text"
            >
              {words.map((wordText, i) => (
                <motion.span key={i} variants={word} className="inline-block mr-3">
                  {wordText}
                </motion.span>
              ))}
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="h-1 gradient-bar rounded-full mb-8 origin-left lg:max-w-md"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-muted-foreground text-xl md:text-2xl max-w-2xl mb-10 font-body font-light lg:mx-0 mx-auto"
            >
              {t.sub[lang]}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4"
            >
              <Button variant="hero" size="lg" asChild>
                <a href="#contact">{t.cta1[lang]}</a>
              </Button>

              <Button variant="heroGhost" size="lg" asChild>
                <a href="#services">{t.cta2[lang]}</a>
              </Button>
            </motion.div>
          </div>

          {/* Right: Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden lg:flex flex-shrink-0 w-[450px] h-[450px] items-center justify-center p-0"
          >
            <img src="/illustrations/Creative team-cuate.svg" alt="" className="w-full h-full object-contain" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;