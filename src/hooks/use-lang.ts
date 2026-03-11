import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useCallback } from "react";
import type { Lang } from "@/i18n/types";
import { DEFAULT_LANG, isLang } from "@/i18n/config";

export function useLang() {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const currentLang: Lang = isLang(lang) ? lang : DEFAULT_LANG;

  const setLang = useCallback(
    (newLang: Lang) => {
      const pathWithoutLang = location.pathname.replace(/^\/(en|es)/, "");
      navigate(`/${newLang}${pathWithoutLang || "/"}`, { replace: true });
    },
    [navigate, location.pathname],
  );

  return { lang: currentLang, setLang } as const;
}
