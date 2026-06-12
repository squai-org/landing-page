import { Helmet } from "react-helmet-async";
import { DEFAULT_LANG, OG_LOCALE_BY_LANG } from "@/i18n/config";
import { SITE_URL, STRUCTURED_DATA } from "@/constants";

interface SeoHeadProps {
  title: string;
  description: string;
  path: string;
}

const SeoHead = ({ title, description, path }: SeoHeadProps) => {
  const canonical = `${SITE_URL}${path === "/" ? "/" : path}`;

  return (
    <Helmet>
      <html lang={DEFAULT_LANG} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={OG_LOCALE_BY_LANG[DEFAULT_LANG]} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {path === "/" && (
        <script type="application/ld+json">
          {JSON.stringify(STRUCTURED_DATA)}
        </script>
      )}
    </Helmet>
  );
};

export default SeoHead;
