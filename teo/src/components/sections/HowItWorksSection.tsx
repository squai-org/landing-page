import { t } from "@/lib/content";
import FadeUp from "@/components/FadeUp";

const HowItWorksSection = () => {
  const { howItWorks } = t();

  return (
    <section className="how-section" id="como-funciona">
      <div className="how-inner">
        <FadeUp className="how-header">
          <div className="section-eyebrow">{howItWorks.eyebrow}</div>
          <h2 className="section-title">
            {howItWorks.titleLine1}<br />
            {howItWorks.titleLine2Before}<span>{howItWorks.titleAccent}</span>
          </h2>
        </FadeUp>
        <div className="steps">
          {howItWorks.steps.map((step, i) => (
            <FadeUp key={step.title} delay={(i + 1) as 1 | 2 | 3 | 4} className="step">
              <div className="step-num">{i + 1}</div>
              <div className="step-body">
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.description}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
