import SeoHead from "@/components/SeoHead";
import TeoIconSprite from "@/components/TeoIconSprite";
import { CONTACT_EMAIL } from "@/constants";

interface LegalSection {
  heading: string;
  body: string[];
}

interface LegalPageProps {
  seoTitle: string;
  seoDescription: string;
  path: string;
  title: string;
  subtitle: string;
  /** Optional compliance line shown under the subtitle (privacy policy only). */
  legalBasis?: string;
  lastUpdated: string;
  sections: LegalSection[];
  backHome: string;
}

/** Renders a paragraph, turning the contact email into a mailto link when present. */
const LegalParagraph = ({ text }: { text: string }) => {
  if (!text.includes(CONTACT_EMAIL)) return <p>{text}</p>;

  const [before, after] = text.split(CONTACT_EMAIL);
  return (
    <p>
      {before}
      <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      {after}
    </p>
  );
};

/** Shared layout for the Spanish-language legal pages (Términos / Privacidad). */
const LegalPage = ({
  seoTitle,
  seoDescription,
  path,
  title,
  subtitle,
  legalBasis,
  lastUpdated,
  sections,
  backHome,
}: LegalPageProps) => (
  <div className="legal-page">
    <SeoHead title={seoTitle} description={seoDescription} path={path} />
    <TeoIconSprite />
    <nav className="legal-nav">
      <a href="/" className="nav-logo">
        <svg width="32" height="32" viewBox="0 0 500 500"><use href="#teo-icon" /></svg>
        Teo
      </a>
    </nav>

    <main className="legal-main">
      <h1 className="legal-title">{title}</h1>
      <p className="legal-subtitle">{subtitle}</p>
      {legalBasis && <p className="legal-meta">{legalBasis}</p>}
      <p className="legal-meta">{lastUpdated}</p>

      {sections.map((section) => (
        <section key={section.heading} className="legal-section">
          <h2>{section.heading}</h2>
          {section.body.map((paragraph) => (
            <LegalParagraph key={paragraph} text={paragraph} />
          ))}
        </section>
      ))}

      <a href="/" className="legal-back">{backHome}</a>
    </main>
  </div>
);

export default LegalPage;
