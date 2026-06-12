import { Fragment } from "react";
import { t } from "@/lib/content";

const HeroSection = () => {
  const { hero } = t();

  return (
    <section className="hero" id="inicio">
      <div className="hero-text">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          {hero.badge}
        </div>
        <h1 className="hero-title">
          {hero.titleLines.map((line) => (
            <Fragment key={line}>{line}<br /></Fragment>
          ))}
          <span className="accent">{hero.titleAccent}</span>
        </h1>
        <p className="hero-sub">{hero.sub}</p>
        <div className="hero-cta-group">
          <a href="#empezar" className="btn-primary">{hero.cta}</a>
          <span className="hero-trust">{hero.trust}</span>
        </div>
      </div>
      <div className="hero-visual">
        <div className="phone-wrap">
          <div className="phone">
            <div className="phone-notch"><div className="phone-notch-pill"></div></div>
            <div className="phone-header">
              <div className="phone-avatar">
                <svg width="36" height="36" viewBox="0 0 500 500"><use href="#teo-icon" /></svg>
              </div>
              <div>
                <div className="phone-contact-name">{hero.phone.contactName}</div>
                <div className="phone-contact-status">{hero.phone.contactStatus}</div>
              </div>
            </div>
            <div className="phone-body">
              <div className="wa-msg wa-msg-out wa-in-1">
                {hero.phone.messages[0].text}
                <div className="wa-msg-time">{hero.phone.messages[0].time}</div>
              </div>
              <div className="wa-typing wa-in-typing">
                <div className="wa-dot"></div><div className="wa-dot"></div><div className="wa-dot"></div>
              </div>
              <div className="wa-msg wa-msg-in wa-in-2">
                {hero.phone.messages[1].text}
                <div className="wa-msg-time">{hero.phone.messages[1].time}</div>
              </div>
              <div className="wa-msg wa-msg-out wa-in-3">
                {hero.phone.messages[2].text}
                <div className="wa-msg-time">{hero.phone.messages[2].time}</div>
              </div>
              <div className="wa-msg wa-msg-in wa-in-4">
                {hero.phone.messages[3].text}
                <div className="wa-msg-time">{hero.phone.messages[3].time}</div>
              </div>
            </div>
            <div className="phone-gold-strip"></div>
          </div>
        </div>
        <div className="teo-figure">
          <img src="/teo-figure.svg" alt="Teo" width="848" height="1264" style={{ display: "block", width: "100%", height: "auto" }} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
