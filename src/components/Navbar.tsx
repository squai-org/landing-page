import { useState, useEffect } from "react";
import SquaiLogo from "./SquaiLogo";
import { content, type Lang } from "@/lib/content";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const Navbar = ({ lang, setLang }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const links = content.nav.links[lang];
  const sections = content.nav.sections;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0C1A]/80 backdrop-blur-md border-b border-white/5 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-5 sm:px-6 md:px-8">
        <a href="/" className="hover:opacity-80 transition-opacity flex-shrink-0">
          <SquaiLogo height={32} />
        </a>

        {/* Desktop links - Animated underline style */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((label, i) => (
            <a
              key={i}
              href={`#${sections[i]}`}
              className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-body text-[15px] font-medium tracking-wide relative group"
            >
              {label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
          {/* Language toggle - Minimalist text switch */}
          <div className="hidden md:flex items-center gap-2 font-body text-sm font-semibold tracking-wider">
            <button
              onClick={() => setLang("en")}
              className={`transition-colors duration-200 ${
                lang === "en" ? "text-foreground" : "text-muted-foreground/50 hover:text-muted-foreground"
              }`}
            >
              EN
            </button>
            <span className="text-white/10">|</span>
            <button
               onClick={() => setLang("es")}
               className={`transition-colors duration-200 ${
                 lang === "es" ? "text-foreground" : "text-muted-foreground/50 hover:text-muted-foreground"
               }`}
            >
              ES
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
             className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
             onClick={() => setOpen(!open)}
          >
             {open ? <X size={26} strokeWidth={1.5} /> : <Menu size={26} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Ultra-minimal mobile menu dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-full left-0 w-full bg-[#0A0C1A]/95 backdrop-blur-xl border-b border-white/5 md:hidden shadow-2xl overflow-hidden"
          >
            <div className="container mx-auto px-5 sm:px-6 py-6 sm:py-8 flex flex-col gap-5 sm:gap-6">
              {links.map((label, i) => (
                <motion.a
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                  href={`#${sections[i]}`}
                  onClick={() => setOpen(false)}
                  className="text-foreground hover:text-primary transition-colors font-headline text-2xl sm:text-3xl font-bold tracking-tight"
                >
                  {label}
                </motion.a>
              ))}
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="h-px bg-white/10 my-2 w-full" 
              />
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-between"
              >
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold">Language</span>
                <div className="flex items-center gap-4 font-body text-base font-bold bg-white/5 p-1 rounded-full border border-white/10">
                   <button
                      onClick={() => { setLang("en"); setOpen(false); }}
                      className={`px-4 py-1.5 rounded-full transition-all duration-300 ${
                        lang === "en" 
                          ? "bg-primary text-primary-foreground shadow-lg" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      EN
                   </button>
                   <button
                      onClick={() => { setLang("es"); setOpen(false); }}
                      className={`px-4 py-1.5 rounded-full transition-all duration-300 ${
                        lang === "es" 
                          ? "bg-primary text-primary-foreground shadow-lg" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                   >
                      ES
                   </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
