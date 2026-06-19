import { Fragment } from "react";
import { t } from "@/lib/content";
import FadeUp from "@/components/FadeUp";

interface CtaSectionProps {
  onOpenWaitlist: () => void;
}

const CtaSection = ({ onOpenWaitlist }: Readonly<CtaSectionProps>) => {
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
        <button type="button" className="btn-cta" onClick={onOpenWaitlist}>{ctaSection.cta}</button>
        <div className="cta-trust">{ctaSection.trust}</div>
      </FadeUp>
    </section>
  );
};

export default CtaSection;
