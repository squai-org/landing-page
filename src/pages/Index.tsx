import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { content } from "@/lib/content";
import { useLang } from "@/hooks/use-lang";
import { Button } from "@/components/ui/button";
import SeoHead from "@/components/SeoHead";
import Navbar from "@/components/Navbar";
import GradientBackground from "@/components/GradientBackground";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import ServicesSection from "@/components/ServicesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import IndustriesSection from "@/components/IndustriesSection";
import WhySquaiSection from "@/components/WhySquaiSection";
import SquadSection from "@/components/SquadSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";

const Index = () => {
  const { lang } = useLang();
  const t = content.rescheduleResume;
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
    <div className="min-h-screen relative overflow-x-clip">
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
      <GradientBackground />
      <div className="relative z-10">
        <Navbar />
        <main>
        <HeroSection onOpenContact={openContact} />
        <ProblemSection />
        <ServicesSection />
        <SquadSection />
        <HowItWorksSection />
        <IndustriesSection />
        <WhySquaiSection />
        <CtaSection onOpenContact={openContact} />
        <Footer onOpenContact={openContact} />
        </main>
      </div>

      <ContactModal
        open={contactOpen}
        onOpenChange={handleContactOpenChange}
        onRescheduleCompleted={handleRescheduleCompleted}
        rescheduleContext={rescheduleContext}
      />

      {showResumeReschedule && rescheduleContext && !contactOpen && (
        <div className="fixed bottom-4 left-4 right-4 z-30 rounded-xl border border-primary/20 bg-background/92 p-3 shadow-lg backdrop-blur sm:left-auto sm:right-5 sm:w-[360px]">
          <p className="font-body text-sm text-foreground/90">{t.message[lang]}</p>
          <Button className="mt-2 h-9 w-full sm:w-auto" onClick={() => handleContactOpenChange(true)}>
            {t.action[lang]}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;
