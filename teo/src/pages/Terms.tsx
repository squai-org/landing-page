import { t } from "@/lib/content";
import LegalPage from "@/components/LegalPage";

const Terms = () => {
  const { terms } = t();

  return (
    <LegalPage
      seoTitle="Términos y Condiciones — Teo"
      seoDescription="Términos y condiciones del servicio de tutoría académica por WhatsApp Teo, operado por Squai S.A.S."
      path="/terminos"
      title={terms.title}
      subtitle={terms.subtitle}
      lastUpdated={terms.lastUpdated}
      sections={terms.sections}
      backHome={terms.backHome}
    />
  );
};

export default Terms;
