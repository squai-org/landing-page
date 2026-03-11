import { Helmet } from "react-helmet-async";
import { useLang } from "@/hooks/use-lang";
import type { Localized } from "@/i18n/types";
import { getAltLang, OG_LOCALE_BY_LANG } from "@/i18n/config";

interface SeoHeadProps {
  title: Localized;
  description: Localized;
  path: string;
}

const SITE_URL = "https://heysquai.vercel.app";
const OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/YGktk21auYRi2XgzqQtnZjjqIc12/social-images/social-1772750720767-Squai_logo_(1).webp";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Squai",
  description: "AI implementation consultancy for growing teams in Latin America",
  url: SITE_URL,
  areaServed: "Latin America",
  availableLanguage: ["Spanish", "English"],
};

const SeoHead = ({ title, description, path }: SeoHeadProps) => {
  const { lang } = useLang();
  const canonical = `${SITE_URL}/${lang}${path === "/" ? "" : path}`;
  const altLang = getAltLang(lang);
  const altCanonical = `${SITE_URL}/${altLang}${path === "/" ? "" : path}`;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title[lang]}</title>
      <meta name="description" content={description[lang]} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang={lang} href={canonical} />
      <link rel="alternate" hrefLang={altLang} href={altCanonical} />
      <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}/en${path === "/" ? "" : path}`} />

      {/* Open Graph */}
      <meta property="og:title" content={title[lang]} />
      <meta property="og:description" content={description[lang]} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:locale" content={OG_LOCALE_BY_LANG[lang]} />
      <meta
        property="og:locale:alternate"
        content={OG_LOCALE_BY_LANG[altLang]}
      />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title[lang]} />
      <meta name="twitter:description" content={description[lang]} />
      <meta name="twitter:image" content={OG_IMAGE} />
      <meta name="twitter:site" content="@Squai" />

      {/* Structured Data — only on homepage */}
      {path === "/" && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SeoHead;
