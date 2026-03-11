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

const HeroSection = ({ lang, onOpenContact }: { lang: Lang; onOpenContact: () => void }) => {
  const t = content.hero;
  const headline = t.headline[lang];
  const words = headline.split(" ");

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center pt-20 pb-10 sm:pb-16">

      <div className="container mx-auto px-5 sm:px-6 relative z-10 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-10 lg:gap-16">
          {/* Left: Text */}
          <div className="flex-1 text-center lg:text-left">
            <motion.h1
              variants={container}
              initial="hidden"
              animate="show"
              className="font-headline font-black text-[2.25rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-[80px] lg:leading-tight mb-4 gradient-wave-text"
            >
              {words.map((wordText, i) => (
                <motion.span key={i} variants={word} className="inline-block mr-2 sm:mr-3 mb-1 sm:mb-2">
                  {wordText}
                </motion.span>
              ))}
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="h-1 gradient-bar rounded-full mb-6 sm:mb-8 origin-left mx-auto lg:mx-0 max-w-[200px] sm:max-w-xs lg:max-w-md"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-muted-foreground text-base sm:text-lg md:text-2xl max-w-2xl mb-8 sm:mb-10 font-body font-light lg:mx-0 mx-auto px-2 sm:px-0"
            >
              {t.sub[lang]}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-3 sm:gap-4 px-4 sm:px-0"
            >
              <Button variant="hero" size="lg" onClick={onOpenContact}>
                {t.cta1[lang]}
              </Button>

              <Button variant="heroGhost" size="lg" asChild className="w-full sm:w-auto">
                <a href="#services">{t.cta2[lang]}</a>
              </Button>
            </motion.div>
          </div>

          {/* Right: Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-1 items-center justify-center p-0 w-full max-w-[240px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-none"
          >
            <img src="/illustrations/Creative team-cuate.svg" alt="Creative team collaborating with AI" width="600" height="600" className="w-full h-full object-contain" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
