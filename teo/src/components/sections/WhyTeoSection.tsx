import { Fragment } from "react";
import { t } from "@/lib/content";
import FadeUp from "@/components/FadeUp";

// The WhatsApp card (last one) renders its icon without the tinted background.
const TRANSPARENT_ICON_INDEX = 3;

const WhyTeoSection = () => {
  const { why } = t();

  return (
    <section className="why-section" id="por-que-teo">
      <div className="why-inner">
        <FadeUp>
          <div className="section-eyebrow light">{why.eyebrow}</div>
          <h2 className="section-title light">
            {why.titleLines.map((line) => (
              <Fragment key={line}>{line}<br /></Fragment>
            ))}
            {why.titleLastLineBefore}<span>{why.titleAccent}</span>
          </h2>
          <div className="why-body">
            {why.paragraphs.map((paragraph) => (
              <p key={paragraph.text}>
                {paragraph.text}
                {"strong" in paragraph && <strong>{paragraph.strong}</strong>}
              </p>
            ))}
          </div>
        </FadeUp>
        <div className="why-cards">
          {why.cards.map((card, i) => (
            <FadeUp key={card.title} delay={(i + 1) as 1 | 2 | 3 | 4} className="why-card">
              <div
                className="why-card-icon"
                style={i === TRANSPARENT_ICON_INDEX ? { background: "none" } : undefined}>
                <img src={card.image} alt={card.alt} loading="lazy" decoding="async" />
              </div>
              <div>
                <div className="why-card-title">{card.title}</div>
                <div className="why-card-desc">{card.description}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyTeoSection;
