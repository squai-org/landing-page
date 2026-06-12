import { t } from "@/lib/content";

const Footer = () => {
  const { footer } = t();

  return (
    <footer className="teo-footer">
      <div className="footer-top">
        <div className="footer-logo">
          <svg width="30" height="30" viewBox="0 0 500 500"><use href="#teo-icon" /></svg>
          Teo
        </div>
        <div className="footer-links">
          {footer.links.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-copy">{footer.copy}</div>
        <a href={`mailto:${footer.email}`} className="footer-email">{footer.email}</a>
      </div>
    </footer>
  );
};

export default Footer;
