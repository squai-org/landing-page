import { Helmet } from "react-helmet-async";
import { useLang } from "@/hooks/use-lang";
import type { Localized } from "@/i18n/types";
import { getAltLang, OG_LOCALE_BY_LANG } from "@/i18n/config";
import { SITE_URL, OG_IMAGE, STRUCTURED_DATA } from "@/constants";

interface SeoHeadProps {
  title: Localized;
  description: Localized;
  path: string;
}

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

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title[lang]} />
      <meta name="twitter:description" content={description[lang]} />
      <meta name="twitter:image" content={OG_IMAGE} />
      <meta name="twitter:site" content="@Squai" />

      {path === "/" && (
        <script type="application/ld+json">
          {JSON.stringify(STRUCTURED_DATA)}
        </script>
      )}
    </Helmet>
  );
};

export default SeoHead;
