import { useState, useEffect } from "react";
import SquaiLogo from "./SquaiLogo";
import { content, type Lang } from "@/lib/content";
import { Menu, X } from "lucide-react";

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-[rgba(10,12,26,0.85)] backdrop-blur-xl border-b border-primary/20"
          : "bg-[rgba(10,12,26,0.85)] backdrop-blur-xl border-b border-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="/" className="hover:opacity-80 transition-opacity">
          <SquaiLogo height={32} />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((label, i) => (
            <a
              key={i}
              href={`#${sections[i]}`}
              className="text-muted-foreground hover:text-primary transition-colors duration-200 font-body text-sm font-medium"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Language toggle pill */}
          <div className="flex items-center rounded-full border border-border overflow-hidden">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 text-xs font-body font-semibold transition-all duration-200 ${
                lang === "en"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("es")}
              className={`px-3 py-1.5 text-xs font-body font-semibold transition-all duration-200 ${
                lang === "es"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ES
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[rgba(10,12,26,0.95)] border-b border-border px-4 pb-4">
          {links.map((label, i) => (
            <a
              key={i}
              href={`#${sections[i]}`}
              onClick={() => setOpen(false)}
              className="block py-3 text-muted-foreground hover:text-primary transition-colors font-body"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
