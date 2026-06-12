import { Fragment } from "react";
import { t } from "@/lib/content";
import FadeUp from "@/components/FadeUp";

const CtaSection = () => {
  const { ctaSection } = t();

  return (
    <section className="cta-section" id="empezar">
      <div className="cta-blob cta-blob-1"></div>
      <div className="cta-blob cta-blob-2"></div>
      <FadeUp className="cta-inner">
        <h2 className="cta-title">
          {ctaSection.titleLines.map((line) => (
            <Fragment key={line}>{line}<br /></Fragment>
          ))}
          {ctaSection.titleLastLineBefore}<em>{ctaSection.titleAccent}</em>
        </h2>
        <p className="cta-sub">{ctaSection.sub}</p>
        <a href="#" className="btn-cta">{ctaSection.cta}</a>
        <div className="cta-trust">{ctaSection.trust}</div>
      </FadeUp>
    </section>
  );
};

export default CtaSection;
