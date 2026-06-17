import { t } from "@/lib/content";
import TeoIcon from "@/components/TeoIcon";

const Footer = () => {
  const { footer } = t();

  return (
    <footer className="teo-footer">
      <div className="footer-top">
        <div className="footer-logo">
          <TeoIcon size={30} />
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
