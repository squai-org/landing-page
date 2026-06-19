import { Fragment } from "react";
import { t } from "@/lib/content";
import FadeUp from "@/components/FadeUp";

interface PricingSectionProps {
  onOpenWaitlist: () => void;
}

const PricingSection = ({ onOpenWaitlist }: Readonly<PricingSectionProps>) => {
  const { pricing } = t();

  return (
    <section className="pricing-section" id="precios">
      <div className="pricing-inner">
        <FadeUp className="pricing-header">
          <div className="section-eyebrow">{pricing.eyebrow}</div>
          <h2 className="section-title">
            {pricing.titleLines.map((line) => (
              <Fragment key={line}>{line}<br /></Fragment>
            ))}
            {pricing.titleLastLineBefore}<span>{pricing.titleAccent}</span>
          </h2>
        </FadeUp>
        <FadeUp className="price-card">
          <div className="price-card-top-strip"></div>
          <div className="price-card-body">
            <div>
              <div className="price-tag">{pricing.tag}</div>
              <div className="price-amount-row">
                <span className="price-currency">{pricing.currency}</span>
                <span className="price-number">{pricing.amount}</span>
              </div>
              <div className="price-period">{pricing.period}</div>
              <div className="price-usd">{pricing.usd}</div>
              <p className="price-caption">{pricing.caption}</p>
            </div>
            <div>
              <ul className="price-feats">
                {pricing.features.map((feature) => (
                  <li key={feature}><span className="feat-check">✓</span>{feature}</li>
                ))}
              </ul>
              <button type="button" className="btn-price" onClick={onOpenWaitlist}>{pricing.cta.label}</button>
              <div className="price-trust">
                {pricing.trustLines[0]}<br />{pricing.trustLines[1]}
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

export default PricingSection;
