import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { t } from "@/lib/content";
import { useLang } from "@/hooks/use-lang";
import { Button } from "@/components/ui/button";
import SeoHead from "@/components/SeoHead";
import MainLayout from "@/layouts/MainLayout";
import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import ServicesSection from "@/components/sections/ServicesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import IndustriesSection from "@/components/sections/IndustriesSection";
import WhySquaiSection from "@/components/sections/WhySquaiSection";
import SquadSection from "@/components/sections/SquadSection";
import CtaSection from "@/components/sections/CtaSection";
import ContactModal from "@/components/ContactModal";

const Index = () => {
  const { lang } = useLang();
  const { rescheduleResume } = t(lang);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const deeplinkConsumedRef = useRef(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [showResumeReschedule, setShowResumeReschedule] = useState(false);
  const [rescheduleContext, setRescheduleContext] = useState<{
    eventId: string;
    email: string;
  } | null>(null);

  const openContact = useCallback(() => {
    setShowResumeReschedule(false);
    setContactOpen(true);
  }, []);

  const handleContactOpenChange = useCallback(
    (open: boolean) => {
      setContactOpen(open);
      if (!open && rescheduleContext) {
        setShowResumeReschedule(true);
      }
      if (open) {
        setShowResumeReschedule(false);
      }
    },
    [rescheduleContext],
  );

  const handleRescheduleCompleted = useCallback(() => {
    setShowResumeReschedule(false);
    setRescheduleContext(null);
  }, []);

  useEffect(() => {
    if (deeplinkConsumedRef.current) return;

    const isReschedule = searchParams.get("reschedule") === "1";
    const eventId = searchParams.get("eventId")?.trim() ?? "";
    const email = searchParams.get("email")?.trim() ?? "";
    const deeplinkLang = searchParams.get("lang") === "es" ? "es" : "en";

    if (!isReschedule || !eventId || !email) return;
    deeplinkConsumedRef.current = true;
    setRescheduleContext({ eventId, email });
    setContactOpen(true);
    setShowResumeReschedule(false);

    const cleanedParams = new URLSearchParams(searchParams);
    cleanedParams.delete("reschedule");
    cleanedParams.delete("eventId");
    cleanedParams.delete("email");
    cleanedParams.delete("lang");

    const nextSearch = cleanedParams.toString();
    navigate(
      {
        pathname: `/${deeplinkLang}`,
        search: nextSearch ? `?${nextSearch}` : "",
      },
      { replace: true },
    );
  }, [searchParams, navigate]);

  return (
    <>
      <SeoHead
        title={{
          en: "Squai — AI Implementation for Growing Teams",
          es: "Squai — Implementación de IA para Equipos en Crecimiento",
        }}
        description={{
          en: "We embed with your team, map your operations, and implement AI that fits. AI implementation consultancy for startups and scaleups in Latin America.",
          es: "Nos integramos con tu equipo, mapeamos tus operaciones e implementamos IA que funciona. Consultoría de implementación de IA para startups en Latinoamérica.",
        }}
        path="/"
      />
      <MainLayout onOpenContact={openContact}>
        <HeroSection onOpenContact={openContact} />
        <ProblemSection />
        <ServicesSection onOpenContact={openContact} />
        <SquadSection />
        <HowItWorksSection />
        <IndustriesSection />
        <WhySquaiSection />
        <CtaSection onOpenContact={openContact} />
      </MainLayout>

      <ContactModal
        open={contactOpen}
        onOpenChange={handleContactOpenChange}
        onRescheduleCompleted={handleRescheduleCompleted}
        rescheduleContext={rescheduleContext}
      />

      {showResumeReschedule && rescheduleContext && !contactOpen && (
        <div className="fixed bottom-4 left-4 right-4 z-30 rounded-xl border border-primary/20 bg-background/92 p-3 shadow-lg backdrop-blur sm:left-auto sm:right-5 sm:w-[360px]">
          <p className="font-body text-sm text-foreground/90">{rescheduleResume.message}</p>
          <Button className="mt-2 h-9 w-full sm:w-auto" onClick={() => handleContactOpenChange(true)}>
            {rescheduleResume.action}
          </Button>
        </div>
      )}
    </>
  );
};

export default Index;
