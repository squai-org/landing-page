import { useState } from "react";
import { t } from "@/lib/content";
import FadeUp from "@/components/FadeUp";

const FaqSection = () => {
  const { faq } = t();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="faq-section" id="faq">
      <div className="faq-inner">
        <FadeUp className="faq-header">
          <div className="section-eyebrow light">{faq.eyebrow}</div>
          <h2 className="section-title light">
            {faq.titleBefore}<span>{faq.titleAccent}</span>
          </h2>
        </FadeUp>
        <div className="faq-list">
          {faq.items.map((item, i) => (
            <FadeUp
              key={item.question}
              delay={(i + 1) as 1 | 2 | 3 | 4}
              className={`faq-item${openIndex === i ? " open" : ""}`}>
              <button
                type="button"
                className="faq-q"
                aria-expanded={openIndex === i}
                onClick={() => toggle(i)}>
                {item.question}<div className="faq-icon">+</div>
              </button>
              <div className="faq-a">{item.answer}</div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
