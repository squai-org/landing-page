import { useEffect, useState } from "react";
import { t } from "@/lib/content";
import TeoIcon from "@/components/TeoIcon";

interface NavbarProps {
  onOpenWaitlist: () => void;
}

const Navbar = ({ onOpenWaitlist }: Readonly<NavbarProps>) => {
  const { nav } = t();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener("scroll", close);
    return () => window.removeEventListener("scroll", close);
  }, [menuOpen]);

  return (
    <>
      <nav className="teo-nav">
        <a href="#inicio" className="nav-logo">
          <TeoIcon size={32} />
          Teo
        </a>
        <div className="nav-links">
          {nav.links.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
          <button type="button" className="nav-cta" onClick={onOpenWaitlist}>{nav.cta.label}</button>
        </div>
        <button
          className="nav-hamburger"
          aria-label={nav.menuAriaLabel}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}>
          <span></span><span></span><span></span>
        </button>
      </nav>

      <div className={`nav-mobile-menu${menuOpen ? " open" : ""}`}>
        {nav.links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
            {link.label}
          </a>
        ))}
        <button
          type="button"
          className="nav-mobile-cta"
          onClick={() => {
            setMenuOpen(false);
            onOpenWaitlist();
          }}>
          {nav.cta.label}
        </button>
      </div>
    </>
  );
};

export default Navbar;
