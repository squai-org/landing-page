import { t } from "@/lib/content";
import FadeUp from "@/components/FadeUp";

const TestimonialHeroSection = () => {
  const { testimonialHero } = t();

  return (
    <section className="testi-hero-section">
      <FadeUp className="testi-hero-inner">
        <div className="testi-stars">★★★★★</div>
        <p className="testi-hero-quote">{testimonialHero.quote}</p>
        <div style={{ textAlign: "center" }}>
          <div className="testi-hero-name">{testimonialHero.name}</div>
          <div className="testi-hero-role">{testimonialHero.role}</div>
        </div>
      </FadeUp>
    </section>
  );
};

export default TestimonialHeroSection;
