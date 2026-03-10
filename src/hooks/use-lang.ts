import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useCallback } from "react";
import type { Lang } from "@/lib/content";

const SUPPORTED_LANGS: Lang[] = ["en", "es"];

export function useLang() {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const currentLang: Lang = SUPPORTED_LANGS.includes(lang as Lang)
    ? (lang as Lang)
    : "en";

  const setLang = useCallback(
    (newLang: Lang) => {
      // Replace the lang segment in the current path
      const pathWithoutLang = location.pathname.replace(/^\/(en|es)/, "");
      navigate(`/${newLang}${pathWithoutLang || "/"}`, { replace: true });
    },
    [navigate, location.pathname],
  );

  return { lang: currentLang, setLang } as const;
}
