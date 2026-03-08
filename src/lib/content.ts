export type Lang = "en" | "es";

export const content = {
  nav: {
    links: {
      en: ["Services", "How It Works", "Industries", "Contact"],
      es: ["Servicios", "Cómo Funciona", "Industrias", "Contacto"],
    },
    sections: ["services", "how-it-works", "industries", "contact"],
  },
  hero: {
    headline: {
      en: "Your team doesn't need to figure out AI alone.",
      es: "Tu equipo no tiene que descifrar la IA solo.",
    },
    headlineHighlight: {
      en: "figure out AI alone.",
      es: "descifrar la IA solo.",
    },
    sub: {
      en: "We work alongside your team, map how your business actually runs, and bring in AI that fits — not just tools that look good on a slide.",
      es: "Trabajamos junto a tu equipo, mapeamos cómo funciona tu negocio de verdad e integramos IA que encaja — no solo herramientas que se ven bien en una presentación.",
    },
    cta1: { en: "Book a Free Discovery Call", es: "Agenda una Llamada Gratuita" },
    cta2: { en: "See Our Services", es: "Ver Nuestros Servicios" },
  },
  problems: {
    eyebrow: { en: "SOUND FAMILIAR?", es: "¿TE SUENA FAMILIAR?" },
    title: { en: "You're not the only one stuck here.", es: "No eres el único que está atascado aquí." },
    items: [
      {
        title: { en: "Everything lives in someone's head", es: "Todo está en la cabeza de alguien" },
        desc: {
          en: "Your processes depend on the right people being available. When they're not, things break.",
          es: "Tus procesos dependen de que las personas correctas estén disponibles. Cuando no lo están, todo se rompe.",
        },
      },
      {
        title: { en: "AI feels urgent but impossible to start", es: "La IA se siente urgente pero imposible de comenzar" },
        desc: {
          en: "You know you need to move on AI. But between the noise, the options, and the day-to-day, it never happens.",
          es: "Sabes que necesitas avanzar con la IA. Pero entre el ruido, las opciones y el día a día, nunca sucede.",
        },
      },
      {
        title: { en: "Big consultants aren't the answer", es: "Las grandes consultoras no son la respuesta" },
        desc: {
          en: "You don't need a six-figure engagement or a 200-slide deck. You need someone who actually gets their hands dirty.",
          es: "No necesitas un proyecto de seis cifras ni un mazo de 200 diapositivas. Necesitas a alguien que realmente se arremangue.",
        },
      },
    ],
  },
  services: {
    eyebrow: { en: "OUR SERVICES", es: "NUESTROS SERVICIOS" },
    title: { en: "Our Services", es: "Nuestros Servicios" },
    tiers: [
      {
        label: { en: "Tier 1", es: "Nivel 1" },
        name: { en: "Squaimap", es: "Squaimap" },
        borderColor: "primary",
        partnership: {
          en: "The smartest first step before changing anything.",
          es: "El primer paso más inteligente antes de cambiar cualquier cosa.",
        },
        description: {
          en: "Every Squai engagement starts here. We get inside your business, study how your team actually works, find what's slowing you down, and map where AI can make a real difference. Then we sit down together, walk through the findings, and agree on the path forward.",
          es: "Todo proyecto de Squai empieza aquí. Nos adentramos en tu negocio, estudiamos cómo trabaja tu equipo de verdad, encontramos qué te está frenando y mapeamos dónde la IA puede marcar una diferencia real. Luego nos sentamos juntos, revisamos los hallazgos y definimos el camino a seguir.",
        },
        items: {
          en: [
            "A deep dive into your operations — how your team works today, where the friction is, and what's costing you time and money",
            "An AI opportunity map showing exactly where AI can help, based on your tools, team, budget, and readiness",
            "A written findings report with clear, prioritized recommendations",
            "A live session where we walk through everything together and agree on next steps",
          ],
          es: [
            "Un análisis profundo de tus operaciones — cómo trabaja tu equipo hoy, dónde está la fricción y qué te está costando tiempo y dinero",
            "Un mapa de oportunidades de IA con exactamente dónde puede ayudar, según tus herramientas, equipo, presupuesto y madurez",
            "Un reporte escrito con hallazgos claros y recomendaciones priorizadas",
            "Una sesión en vivo donde revisamos todo juntos y definimos los próximos pasos",
          ],
        },
        duration: { en: "2 weeks", es: "2 semanas" },
        popular: false,
        pricePrefix: { en: "", es: "" },
        price: "1,500 USD",
        priceNote: {
          en: "Fixed price. Included in every tier — never skipped, never rushed.",
          es: "Precio fijo. Incluido en todos los niveles — siempre completo, siempre a tu ritmo.",
        },
        squadAssigned: { en: "2 of 6 squad members", es: "2 de 6 miembros del squad" },
        cta: { en: "Start with Squaimap", es: "Empezar con Squaimap" },
      },
      {
        label: { en: "Tier 2", es: "Nivel 2" },
        name: { en: "Squailab", es: "Squailab" },
        borderColor: "accent",
        partnership: {
          en: "Take what we learned and build systems your team will actually use.",
          es: "Tomamos lo que aprendimos y construimos sistemas que tu equipo realmente va a usar.",
        },
        description: {
          en: "We take the Squaimap findings and get to work. Together we decide which workflows matter most right now — then we document them properly, make them accessible to your whole team, and bring in AI where it makes the most sense for how your business actually runs.",
          es: "Tomamos los hallazgos del Squaimap y nos ponemos a trabajar. Juntos decidimos qué flujos importan más ahora mismo — los documentamos bien, los hacemos accesibles para todo tu equipo e integramos IA donde tiene más sentido para tu negocio.",
        },
        items: {
          en: [
            "Everything in Squaimap",
            "3 to 5 core workflows fully mapped and documented — clear enough that anyone on your team can follow them",
            "Operational playbooks delivered inside the tools your team already uses",
            "AI implementations across your priority workflows, with scope defined together during Squaimap",
            "A closing session so your team knows how to manage everything we built",
            "1 week of post-delivery support",
          ],
          es: [
            "Todo lo del Squaimap",
            "3 a 5 flujos de trabajo principales completamente mapeados y documentados — lo suficientemente claros para que cualquiera en tu equipo pueda seguirlos",
            "Playbooks operativos entregados en las herramientas que tu equipo ya usa",
            "Implementaciones de IA en tus flujos prioritarios, con alcance definido juntos durante el Squaimap",
            "Una sesión de cierre para que tu equipo sepa manejar todo lo que construimos",
            "1 semana de soporte post-entrega",
          ],
        },
        duration: { en: "4 to 6 weeks", es: "4 a 6 semanas" },
        popular: true,
        pricePrefix: { en: "From", es: "Desde" },
        price: "5,500 USD",
        priceNote: {
          en: "Final scope and price confirmed after the Squaimap closing session.",
          es: "Alcance y precio final confirmados después de la sesión de cierre del Squaimap.",
        },
        squadAssigned: { en: "4 of 6 squad members", es: "4 de 6 miembros del squad" },
        cta: { en: "Start with Squailab", es: "Empezar con Squailab" },
      },
      {
        label: { en: "Tier 3", es: "Nivel 3" },
        name: { en: "Squaicore", es: "Squaicore" },
        borderColor: "secondary",
        partnership: {
          en: "A complete operational system so your business runs on process, not on people.",
          es: "Un sistema operativo completo para que tu negocio dependa de procesos, no de personas.",
        },
        description: {
          en: "This is the full build. We go deep across your entire operation — mapping every critical workflow, building a complete playbook your business can run on, and implementing AI wherever it creates real leverage. Then we train your team hands-on so they're fully equipped to operate and grow long after we're gone.",
          es: "Este es el trabajo completo. Profundizamos en toda tu operación — mapeamos cada flujo crítico, construimos un playbook completo sobre el que tu negocio pueda sostenerse e implementamos IA donde genera verdadero valor. Luego entrenamos a tu equipo de forma práctica para que esté listo para operar y crecer mucho después de que nos hayamos ido.",
        },
        items: {
          en: [
            "Everything in Squaimap",
            "6 to 10 core workflows fully mapped, documented, and interconnected",
            "A complete operational playbook covering your entire business",
            "AI implementations across all priority workflows, with scope defined collaboratively during Squaimap",
            "A data integrity review so your decisions are built on reliable, well-connected information",
            "An information security review so your processes and tools handle sensitive data responsibly",
            "Full team training — hands-on, role-specific, and built for real use",
            "2 weeks of post-delivery support",
          ],
          es: [
            "Todo lo del Squaimap",
            "6 a 10 flujos de trabajo principales completamente mapeados, documentados e interconectados",
            "Un playbook operativo completo que cubre todo tu negocio",
            "Implementaciones de IA en todos los flujos prioritarios, con alcance definido de forma colaborativa durante el Squaimap",
            "Una revisión de integridad de datos para que tus decisiones estén basadas en información confiable y bien conectada",
            "Una revisión de seguridad de la información para que tus procesos y herramientas manejen datos sensibles de forma responsable",
            "Entrenamiento completo del equipo — práctico, específico por rol y diseñado para el uso real",
            "2 semanas de soporte post-entrega",
          ],
        },
        duration: { en: "8 to 12 weeks", es: "8 a 12 semanas" },
        popular: false,
        pricePrefix: { en: "From", es: "Desde" },
        price: "12,000 USD",
        priceNote: {
          en: "Final scope and price confirmed after the Squaimap closing session.",
          es: "Alcance y precio final confirmados después de la sesión de cierre del Squaimap.",
        },
        squadAssigned: { en: "Full squad, all 6 members", es: "Squad completo, los 6 miembros" },
        cta: { en: "Start with Squaicore", es: "Empezar con Squaicore" },
      },
    ],
  },
  howItWorks: {
    eyebrow: { en: "HOW IT WORKS", es: "CÓMO FUNCIONA" },
    title: { en: "How It Works", es: "Cómo Funciona" },
    steps: {
      en: ["Discovery Call", "Proposal in 48hrs", "Kickoff", "Mapping & Building", "Delivery", "Support Period"],
      es: ["Llamada de Diagnóstico", "Propuesta en 48hrs", "Kickoff", "Mapeo y Construcción", "Entrega", "Período de Soporte"],
    },
  },
  industries: {
    eyebrow: { en: "WHO WE SERVE", es: "A QUIÉN SERVIMOS" },
    title: { en: "Industries We Serve", es: "Industrias que Atendemos" },
    items: {
      en: ["SaaS & Tech Startups", "E-Learning & Education", "Professional Services", "Digital E-Commerce", "Agencies & Consultancies"],
      es: ["SaaS y Startups Tech", "E-Learning y Educación", "Servicios Profesionales", "E-Commerce Digital", "Agencias y Consultoras"],
    },
  },
  whySquai: {
    eyebrow: { en: "WHY SQUAI", es: "POR QUÉ SQUAI" },
    title: { en: "Why Squai", es: "¿Por Qué Squai?" },
    items: [
      {
        title: { en: "A squad, not a solo consultant", es: "Un equipo, no un consultor solo" },
        desc: {
          en: "Real people with defined roles working inside your business — not a chatbot, not a framework, not a slide deck.",
          es: "Personas reales con roles definidos trabajando dentro de tu negocio — no un chatbot, no una metodología, no una presentación.",
        },
      },
      {
        title: { en: "We speak your language — literally", es: "Hablamos tu idioma — literalmente" },
        desc: {
          en: "English or Spanish. Notion or Confluence. We meet you where you are and work the way your team works.",
          es: "Inglés o español. Notion o Confluence. Nos adaptamos a donde estás y trabajamos como trabaja tu equipo.",
        },
      },
      {
        title: { en: "Practical AI, not theoretical", es: "IA práctica, no teórica" },
        desc: {
          en: "We don't hand you a tool list and leave. We implement what fits your team's actual comfort level and make sure it sticks.",
          es: "No te dejamos una lista de herramientas y nos vamos. Implementamos lo que se adapta al nivel real de tu equipo y nos aseguramos de que funcione.",
        },
      },
      {
        title: { en: "We build for when we're gone", es: "Construimos pensando en cuando nos vayamos" },
        desc: {
          en: "Everything we build is meant to be owned and run by your team. Our job is done when you don't need us anymore.",
          es: "Todo lo que construimos está pensado para que tu equipo lo maneje por su cuenta. Nuestro trabajo termina cuando ya no nos necesitas.",
        },
      },
    ],
  },
  squad: {
    eyebrow: { en: "THE SQUAD", es: "EL SQUAD" },
    title: { en: "Meet Your Squad", es: "Conoce a tu Squad" },
    sub: {
      en: "Every engagement assigns the right people to your specific needs. You always work directly with the people doing the work.",
      es: "Cada proyecto asigna las personas correctas según tus necesidades. Siempre trabajas directamente con quienes hacen el trabajo.",
    },
    members: [
      {
        role: { en: "Operations Strategist", es: "Estratega de Operaciones" },
        specialty: { en: "Strategy & Direction", es: "Estrategia y Dirección" },
        desc: {
          en: "Diagnoses your business, defines the operational roadmap, and leads the engagement from start to finish.",
          es: "Diagnostica tu negocio, define la hoja de ruta operativa y lidera el proyecto de principio a fin.",
        },
        tiers: { en: ["Squaimap", "Squailab", "Squaicore"], es: ["Squaimap", "Squailab", "Squaicore"] },
        borderColor: "accent",
      },
      {
        role: { en: "AI Engineer", es: "Ingeniero de IA" },
        specialty: { en: "Automation Specialist", es: "Especialista en Automatización" },
        desc: {
          en: "Builds and configures the AI tools, automations, and integrations identified during the engagement. Custom implementations, not off-the-shelf advice.",
          es: "Construye y configura las herramientas de IA, automatizaciones e integraciones identificadas durante el proyecto. Implementaciones a medida, no consejos genéricos.",
        },
        tiers: { en: ["Squailab", "Squaicore"], es: ["Squailab", "Squaicore"] },
        borderColor: "secondary",
      },
      {
        role: { en: "Business Process Analyst", es: "Analista de Procesos de Negocio" },
        specialty: { en: "Process Design & Strategy", es: "Diseño y Estrategia de Procesos" },
        desc: {
          en: "Maps your real workflows, identifies bottlenecks, and aligns every process improvement to your actual business goals — not just what looks broken on the surface.",
          es: "Mapea tus flujos reales, identifica cuellos de botella y alinea cada mejora de proceso con tus objetivos reales de negocio — no solo lo que parece roto en la superficie.",
        },
        tiers: { en: ["Squaimap", "Squailab", "Squaicore"], es: ["Squaimap", "Squailab", "Squaicore"] },
        borderColor: "primary",
      },
      {
        role: { en: "Knowledge Manager", es: "Gestor de Conocimiento" },
        specialty: { en: "Systems & Knowledge Design", es: "Diseño y Gestión de Conocimiento" },
        desc: {
          en: "Ensures all workflows, playbooks, and documentation are clear, structured, and accessible in your team's tools — so knowledge lives in systems, not in people's heads.",
          es: "Garantiza que todos los flujos, playbooks y documentación sean claros, estructurados y accesibles en las herramientas de tu equipo — para que el conocimiento viva en los sistemas, no en la cabeza de las personas.",
        },
        tiers: { en: ["Squailab", "Squaicore"], es: ["Squailab", "Squaicore"] },
        borderColor: "primary",
      },
      {
        role: { en: "Data Analyst", es: "Analista de Datos" },
        specialty: { en: "Data Integrity & Connections", es: "Integridad y Conexiones de Datos" },
        desc: {
          en: "Ensures your data flows correctly across your processes and tools. Validates data integrity and identifies where information is incomplete or being misused.",
          es: "Garantiza que tus datos fluyan correctamente a través de tus procesos y herramientas. Valida la integridad de los datos e identifica dónde la información está incompleta o mal usada.",
        },
        tiers: { en: ["Squaicore"], es: ["Squaicore"] },
        borderColor: "primary",
      },
      {
        role: { en: "Information Security Analyst", es: "Analista de Seguridad de la Información" },
        specialty: { en: "Security & Risk Management", es: "Gestión de Seguridad y Riesgos" },
        desc: {
          en: "Ensures your processes, tools, and documentation follow information security best practices — so your business handles sensitive data responsibly as it grows.",
          es: "Garantiza que tus procesos, herramientas y documentación sigan las mejores prácticas de seguridad de la información — para que tu negocio maneje datos sensibles de forma responsable a medida que crece.",
        },
        tiers: { en: ["Squailab", "Squaicore"], es: ["Squailab", "Squaicore"] },
        borderColor: "primary",
      },
    ],
    gallery: [
      { name: "Laura Villada", role: { en: "Operations Strategist", es: "Estratega de Operaciones" } },
      { name: "Sebastián Rico", role: { en: "AI Engineer", es: "Ingeniero IA" } },
      { name: "Daniel Guzmán", role: { en: "Process Analyst", es: "Analista de Procesos" } },
      { name: "Ana Lasso", role: { en: "Knowledge Manager", es: "Gestor de Conocimiento" } },
      { name: "Luis López", role: { en: "Data Analyst", es: "Analista de Datos" } },
      { name: "Carlos Gómez", role: { en: "Security Analyst", es: "Analista de Seguridad" } },
    ],
  },
  ctaSection: {
    headline: { en: "Ready to meet your squad?", es: "¿Listo para conocer tu squad?" },
    sub: {
      en: "A real squad, a free 30-minute call. No commitment, no pressure — just an honest conversation about where you are and where you want to go.",
      es: "Un equipo real, una llamada gratuita de 30 minutos. Sin compromiso, sin presión — solo una conversación honesta sobre dónde estás y a dónde quieres llegar.",
    },
    cta: { en: "Book Your Free Call", es: "Agenda tu Llamada Gratis" },
  },
  footer: {
    tagline: {
      en: "Your team doesn't need to figure out AI alone.",
      es: "Tu equipo no tiene que descifrar la IA solo.",
    },
    links: {
      en: ["Services", "How It Works", "Contact"],
      es: ["Servicios", "Cómo Funciona", "Contacto"],
    },
    sections: ["services", "how-it-works", "contact"],
    copyright: "© 2026 Squai. All rights reserved.",
  },
};
