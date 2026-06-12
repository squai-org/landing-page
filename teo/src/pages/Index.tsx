import SeoHead from "@/components/SeoHead";
import MainLayout from "@/layouts/MainLayout";
import WaveDivider from "@/components/WaveDivider";
import HeroSection from "@/components/sections/HeroSection";
import WhyTeoSection from "@/components/sections/WhyTeoSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import TestimonialHeroSection from "@/components/sections/TestimonialHeroSection";
import PricingSection from "@/components/sections/PricingSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FaqSection from "@/components/sections/FaqSection";
import CtaSection from "@/components/sections/CtaSection";

const Index = () => (
  <>
    <SeoHead
      title="Teo — El profe de primaria de tu hijo"
      description="Teo es el profe de primaria por WhatsApp. Guía a tu hijo paso a paso con sus tareas sin darle la respuesta. Para niños de 1° a 5° de primaria. 7 días gratis."
      path="/"
    />
    <MainLayout>
      <HeroSection />
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
      <PricingSection />
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
      <CtaSection />
    </MainLayout>
  </>
);

export default Index;
