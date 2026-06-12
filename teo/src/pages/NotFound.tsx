import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { t } from "@/lib/content";

const NotFound = () => {
  const location = useLocation();
  const { notFound } = t();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="legal-page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Helmet>
        <title>Página no encontrada — Teo</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div style={{ textAlign: "center" }}>
        <h1 className="legal-title">{notFound.title}</h1>
        <p className="legal-meta">{notFound.message}</p>
        <a href="/" className="legal-back" style={{ borderTop: "none", paddingTop: 0 }}>
          {notFound.backHome}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
