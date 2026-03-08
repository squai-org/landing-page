const GradientBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Base: Depth gradient canvas (#0A0C1A → #7C8CFF at 135°) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0A0C1A 0%, #0E1035 30%, #141755 55%, #1c2068 75%, #252a7a 100%)",
        }}
      />

      {/* ═══════════════════════════════════════════
          PRIMARY gradient orbs (#7C8CFF ↔ #F2C94C)
          ═══════════════════════════════════════════ */}

      {/* Large blue-purple — top-right hero area */}
      <div
        className="gradient-orb animate-float-1"
        style={{
          width: "clamp(300px, 55vw, 1000px)",
          height: "clamp(300px, 55vw, 1000px)",
          top: "-15%",
          right: "-8%",
          background:
            "radial-gradient(circle at 40% 40%, rgba(124,140,255,0.30) 0%, rgba(124,140,255,0.10) 40%, transparent 70%)",
        }}
      />

      {/* Gold warmth — upper center-right, blends with blue to form Primary gradient */}
      <div
        className="gradient-orb animate-float-2"
        style={{
          width: "clamp(250px, 38vw, 700px)",
          height: "clamp(250px, 38vw, 700px)",
          top: "2%",
          right: "15%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(242,201,76,0.16) 0%, rgba(242,201,76,0.05) 45%, transparent 70%)",
        }}
      />

      {/* ═══════════════════════════════════════════
          AI gradient orbs (#7C8CFF ↔ #44D4C8)
          ═══════════════════════════════════════════ */}

      {/* Large teal — center-left */}
      <div
        className="gradient-orb animate-float-3"
        style={{
          width: "clamp(280px, 45vw, 850px)",
          height: "clamp(280px, 45vw, 850px)",
          top: "28%",
          left: "-12%",
          background:
            "radial-gradient(circle at 60% 50%, rgba(68,212,200,0.22) 0%, rgba(68,212,200,0.06) 45%, transparent 70%)",
        }}
      />

      {/* Blue-purple mid — center-right, keeps AI gradient flowing */}
      <div
        className="gradient-orb animate-float-4"
        style={{
          width: "clamp(250px, 35vw, 650px)",
          height: "clamp(250px, 35vw, 650px)",
          top: "40%",
          right: "-5%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(124,140,255,0.18) 0%, rgba(124,140,255,0.05) 50%, transparent 70%)",
        }}
      />

      {/* ═══════════════════════════════════════════
          DEPTH continuity orbs (mid → bottom)
          ═══════════════════════════════════════════ */}

      {/* Teal secondary — lower-left for AI section area */}
      <div
        className="gradient-orb animate-float-1"
        style={{
          width: "clamp(220px, 30vw, 550px)",
          height: "clamp(220px, 30vw, 550px)",
          bottom: "20%",
          left: "8%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(68,212,200,0.14) 0%, rgba(68,212,200,0.04) 45%, transparent 70%)",
        }}
      />

      {/* Gold accent — lower-right for warm CTA area */}
      <div
        className="gradient-orb animate-float-2"
        style={{
          width: "clamp(250px, 35vw, 650px)",
          height: "clamp(250px, 35vw, 650px)",
          bottom: "5%",
          right: "10%",
          background:
            "radial-gradient(circle at 50% 60%, rgba(242,201,76,0.13) 0%, rgba(242,201,76,0.04) 50%, transparent 70%)",
        }}
      />

      {/* Blue-purple — bottom-center for depth continuity */}
      <div
        className="gradient-orb animate-float-3"
        style={{
          width: "clamp(280px, 40vw, 750px)",
          height: "clamp(280px, 40vw, 750px)",
          bottom: "-10%",
          left: "30%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(124,140,255,0.20) 0%, rgba(124,140,255,0.06) 45%, transparent 70%)",
        }}
      />

      {/* Subtle large teal wash — top-center to smooth hero→content transition */}
      <div
        className="gradient-orb animate-float-4"
        style={{
          width: "clamp(300px, 50vw, 900px)",
          height: "clamp(250px, 30vw, 600px)",
          top: "15%",
          left: "20%",
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(68,212,200,0.08) 0%, transparent 60%)",
        }}
      />
    </div>
  );
};

export default GradientBackground;
