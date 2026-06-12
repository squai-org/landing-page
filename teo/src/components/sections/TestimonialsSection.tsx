import { t } from "@/lib/content";
import FadeUp from "@/components/FadeUp";

const TestimonialsSection = () => {
  const { testimonials } = t();

  return (
    <section className="testimonials-section">
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <FadeUp className="section-eyebrow">{testimonials.eyebrow}</FadeUp>
        <FadeUp as="h2" className="section-title">
          {testimonials.titleBefore}<span>{testimonials.titleAccent}</span>
        </FadeUp>
        <div className="testi-grid">
          {testimonials.items.map((item, i) => (
            <FadeUp
              key={item.name}
              delay={(i + 1) as 1 | 2}
              className={`testi-card tc-${item.variant}`}>
              <div className="testi-mini-stars">★★★★★</div>
              <p className="testi-text">{item.text}</p>
              <div>
                <div className="testi-name">{item.name}</div>
                <div className="testi-role">{item.role}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
