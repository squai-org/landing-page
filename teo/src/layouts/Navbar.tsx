import { useEffect, useState } from "react";
import { t } from "@/lib/content";

const Navbar = () => {
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
        <a href="#" className="nav-logo">
          <svg width="32" height="32" viewBox="0 0 500 500"><use href="#teo-icon" /></svg>
          Teo
        </a>
        <div className="nav-links">
          {nav.links.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
          <a href={nav.cta.href} className="nav-cta">{nav.cta.label}</a>
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
        <a href={nav.cta.href} className="nav-mobile-cta" onClick={() => setMenuOpen(false)}>
          {nav.cta.label}
        </a>
      </div>
    </>
  );
};

export default Navbar;
