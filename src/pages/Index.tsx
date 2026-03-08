import { useState, useCallback } from "react";
import type { Lang } from "@/lib/content";
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
  const [lang, setLang] = useState<Lang>("en");
  const [contactOpen, setContactOpen] = useState(false);

  const openContact = useCallback(() => setContactOpen(true), []);

  return (
    <div className="min-h-screen relative overflow-x-clip">
      <SeoHead
        lang={lang}
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
        <Navbar lang={lang} setLang={setLang} />
        <main>
        <HeroSection lang={lang} onOpenContact={openContact} />
        <ProblemSection lang={lang} />
        <ServicesSection lang={lang} />
        <SquadSection lang={lang} />
        <HowItWorksSection lang={lang} />
        <IndustriesSection lang={lang} />
        <WhySquaiSection lang={lang} />
        <CtaSection lang={lang} onOpenContact={openContact} />
        <Footer lang={lang} setLang={setLang} />
        </main>
      </div>

      <ContactModal open={contactOpen} onOpenChange={setContactOpen} lang={lang} />
    </div>
  );
};

export default Index;
