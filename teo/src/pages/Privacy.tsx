import { t } from "@/lib/content";
import LegalPage from "@/components/LegalPage";

const Privacy = () => {
  const { privacy } = t();

  return (
    <LegalPage
      seoTitle="Política de Privacidad — Teo"
      seoDescription="Política de privacidad de Teo, el servicio de tutoría académica por WhatsApp de Squai S.A.S., en cumplimiento de la Ley 1581 de 2012."
      path="/privacidad"
      title={privacy.title}
      subtitle={privacy.subtitle}
      legalBasis={privacy.legalBasis}
      lastUpdated={privacy.lastUpdated}
      sections={privacy.sections}
      backHome={privacy.backHome}
    />
  );
};

export default Privacy;
