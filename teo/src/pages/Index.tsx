import { useCallback, useEffect, useRef, useState } from "react";
import { t } from "@/lib/content";
import SeoHead from "@/components/SeoHead";
import MainLayout from "@/layouts/MainLayout";
import WaveDivider from "@/components/WaveDivider";
import WaitlistModal from "@/components/WaitlistModal";
import HeroSection from "@/components/sections/HeroSection";
import WhyTeoSection from "@/components/sections/WhyTeoSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import TestimonialHeroSection from "@/components/sections/TestimonialHeroSection";
import PricingSection from "@/components/sections/PricingSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FaqSection from "@/components/sections/FaqSection";
import CtaSection from "@/components/sections/CtaSection";

const EXIT_INTENT_KEY = "teo_waitlist_exit_shown";

const Index = () => {
  const { waitlistModal: wl } = t();
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistNote, setWaitlistNote] = useState("");
  const exitArmed = useRef(true);

  const openWaitlist = useCallback(() => {
    setWaitlistNote("");
    setWaitlistOpen(true);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(EXIT_INTENT_KEY)) return;

    const onMouseOut = (e: MouseEvent) => {
      if (!exitArmed.current || e.relatedTarget || e.clientY > 0) return;
      exitArmed.current = false;
      sessionStorage.setItem(EXIT_INTENT_KEY, "1");
      setWaitlistNote(wl.exitIntentNote);
      setWaitlistOpen(true);
    };

    document.addEventListener("mouseout", onMouseOut);
    return () => document.removeEventListener("mouseout", onMouseOut);
  }, [wl.exitIntentNote]);

  return (
  <>
    <SeoHead
      title="Teo — El profe de primaria de tu hijo"
      description="Teo es el profe de primaria por WhatsApp. Guía a tu hijo paso a paso con sus tareas sin darle la respuesta. Para niños de 1° a 5° de primaria. 7 días gratis."
      path="/"
    />
    <WaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} note={waitlistNote} />
    <MainLayout onOpenWaitlist={openWaitlist}>
      <HeroSection onOpenWaitlist={openWaitlist} />
      {}
      <WaveDivider
        background="var(--teal-tint)"
        d="M0,0 C180,55 360,0 540,35 C720,55 900,10 1080,40 C1260,55 1380,15 1440,28 L1440,55 L0,55 Z"
        fill="#2A9D8F"
      />
      <WhyTeoSection />
      {}
      <WaveDivider
        background="#2A9D8F"
        d="M0,55 C180,10 360,55 540,20 C720,0 900,50 1080,15 C1260,0 1380,45 1440,28 L1440,55 L0,55 Z"
        fill="#E9C46A"
        seam={{ y: 53, height: 3 }}
      />
      <HowItWorksSection />
      {}
      <WaveDivider
        background="#E9C46A"
        d="M0,55 C180,0 360,55 540,20 C720,0 900,45 1080,15 C1260,0 1380,40 1440,28 L1440,55 L0,55 Z"
        fill="#F7EABD"
      />
      <TestimonialHeroSection />
      {}
      <PricingSection onOpenWaitlist={openWaitlist} />
      {}
      <TestimonialsSection />
      {}
      <WaveDivider
        background="#C4EAE6"
        d="M0,28 C180,55 360,0 540,40 C720,55 900,5 1080,35 C1260,55 1380,10 1440,25 L1440,55 L0,55 Z"
        fill="#2A9D8F"
        seam={{ y: 54, height: 2 }}
      />
      <FaqSection />
      {}
      <CtaSection onOpenWaitlist={openWaitlist} />
    </MainLayout>
  </>
  );
};

export default Index;
