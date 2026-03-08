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
      en: "We Work With Your Team So AI Can Too.",
      es: "Trabajamos con tu equipo para que la IA también pueda.",
    },
    headlineHighlight: {
      en: "So AI Can Too.",
      es: "para que la IA también pueda.",
    },
    sub: {
      en: "A real ops squad that works alongside your team, maps your processes, and brings in AI that actually sticks.",
      es: "Un equipo real de operaciones que trabaja junto a ti, mapea tus procesos e integra IA que realmente funciona.",
    },
    cta1: { en: "Book a Free Discovery Call", es: "Agenda una Llamada Gratuita" },
    cta2: { en: "See Our Services", es: "Ver Nuestros Servicios" },
  },
  problems: {
    eyebrow: { en: "THE PROBLEM", es: "EL PROBLEMA" },
    title: { en: "Sound Familiar?", es: "¿Te Suena Familiar?" },
    items: [
      {
        title: { en: "Tribal Knowledge", es: "Conocimiento Tribal" },
        desc: {
          en: "Your processes live in people's heads, not in systems.",
          es: "Tus procesos están en la cabeza de las personas, no en sistemas.",
        }
      },
      {
        title: { en: "AI Paralysis", es: "Parálisis de IA" },
        desc: {
          en: "You know AI matters but don't know where to start.",
          es: "Sabes que la IA importa, pero no sabes por dónde empezar.",
        }
      },
      {
        title: { en: "Bloated Budgets", es: "Presupuestos Inflados" },
        desc: {
          en: "You can't afford a big consulting firm and you don't need one.",
          es: "No puedes pagar una gran consultora y tampoco la necesitas.",
        }
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
          en: "Every Squai engagement starts here. We get inside your business, study how your team actually works, identify what's slowing you down, and map where AI can make a real difference. At the end we sit down together, review the findings, and agree on the path forward.",
          es: "Todo proyecto de Squai empieza aquí. Nos adentramos en tu negocio, estudiamos cómo trabaja tu equipo, identificamos qué te está frenando y mapeamos dónde la IA puede marcar una diferencia real. Al final nos sentamos juntos, revisamos los hallazgos y definimos el camino a seguir.",
        },
        items: {
          en: [
            "A deep dive into your operations: how your team works today, where the friction is, and what's costing you time and money",
            "An AI opportunity map with specific areas where AI can help based on your tools, team, budget, and readiness",
            "A written findings report with clear, prioritized recommendations",
            "A live session where we review everything together and agree on next steps",
          ],
          es: [
            "Un análisis profundo de tus operaciones: cómo trabaja tu equipo hoy, dónde están los cuellos de botella y qué te está costando tiempo y dinero",
            "Un mapa de oportunidades de IA con áreas específicas donde puede ayudar, según tus herramientas, equipo, presupuesto y madurez",
            "Un reporte escrito con hallazgos claros y recomendaciones priorizadas",
            "Una sesión en vivo donde revisamos todo juntos y definimos los próximos pasos",
          ],
        },
        duration: { en: "2 weeks", es: "2 semanas" },
        popular: false,
        pricePrefix: { en: "", es: "" },
        price: "1,500 USD",
        priceNote: {
          en: "Fixed price. Included in all tiers, never skipped, never rushed.",
          es: "Precio fijo. Incluido en todos los niveles, siempre completo, siempre a tu ritmo.",
        },
        squadAssigned: { en: "2 of 6 squad members", es: "2 de 6 miembros del squad" },
        cta: { en: "Start with Squaimap", es: "Empezar con Squaimap" },
      },
      {
        label: { en: "Tier 2", es: "Nivel 2" },
        name: { en: "Squailab", es: "Squailab" },
        borderColor: "accent",
        partnership: {
          en: "Take what we learned and build the systems your team will actually use.",
          es: "Tomamos lo que aprendimos y construimos los sistemas que tu equipo realmente va a usar.",
        },
        description: {
          en: "We take the findings from Squaimap and get to work. Together we decide which workflows matter most right now, then we document them properly, make them accessible to your whole team, and bring in AI where it makes the most sense for how your business actually operates.",
          es: "Tomamos los hallazgos del Squaimap y nos ponemos a trabajar. Juntos decidimos qué flujos importan más ahora mismo, los documentamos correctamente, los hacemos accesibles a todo tu equipo e integramos IA donde tiene más sentido para tu negocio.",
        },
        items: {
          en: [
            "Everything in Squaimap",
            "3 to 5 core workflows fully mapped and documented, clear enough that anyone on your team can follow them",
            "Operational playbooks delivered in the tools your team already uses",
            "AI implementations across your priority workflows, with type and scope defined together during the Squaimap phase",
            "A closing session so your team knows how to manage everything we built",
            "1 week of post-delivery support",
          ],
          es: [
            "Todo lo del Squaimap",
            "3 a 5 flujos de trabajo principales completamente mapeados y documentados, lo suficientemente claros para que cualquiera en tu equipo pueda seguirlos",
            "Playbooks operativos entregados en las herramientas que tu equipo ya usa",
            "Implementaciones de IA en tus flujos prioritarios, con tipo y alcance definidos juntos durante la fase del Squaimap",
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
          en: "This is the full picture. We go deep across your entire operation, mapping all your critical workflows, building a complete playbook your business can run on, and implementing AI across every area where it creates real leverage. We train your team hands-on so they're fully equipped to operate and grow independently long after we're done.",
          es: "Esta es la imagen completa. Profundizamos en toda tu operación, mapeamos todos tus flujos críticos, construimos un playbook completo sobre el que tu negocio pueda sostenerse e implementamos IA en cada área donde genera verdadero valor. Entrenamos a tu equipo de forma práctica para que esté equipado para operar y crecer por su cuenta.",
        },
        items: {
          en: [
            "Everything in Squaimap",
            "6 to 10 core workflows fully mapped, documented, and interconnected",
            "A complete operational playbook covering your entire business",
            "AI implementations across all priority workflows, with type and scope defined collaboratively during the Squaimap phase",
            "A data integrity review to make sure your decisions are built on reliable, well-connected data",
            "An information security review to make sure your processes and tools handle sensitive data responsibly",
            "Full team training, hands-on, role-specific, and practical",
            "2 weeks of post-delivery support",
          ],
          es: [
            "Todo lo del Squaimap",
            "6 a 10 flujos de trabajo principales completamente mapeados, documentados e interconectados",
            "Un playbook operativo completo que cubre todo tu negocio",
            "Implementaciones de IA en todos los flujos prioritarios, con tipo y alcance definidos de forma colaborativa durante la fase del Squaimap",
            "Una revisión de integridad de datos para que tus decisiones estén basadas en información confiable y bien conectada",
            "Una revisión de seguridad de la información para que tus procesos y herramientas manejen datos sensibles de forma responsable",
            "Entrenamiento completo del equipo: práctico, específico por rol y aplicado",
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
          en: "Real people with defined roles working inside your business, not a chatbot or a framework.",
          es: "Personas reales con roles definidos trabajando en tu negocio, no un chatbot ni una metodología de manual.",
        },
      },
      {
        title: { en: "We speak your language, literally", es: "Hablamos tu idioma, literalmente" },
        desc: {
          en: "English or Spanish, Notion or Confluence. We adapt to how you work.",
          es: "Inglés o español, Notion o Confluence. Nos adaptamos a cómo trabajas.",
        },
      },
      {
        title: { en: "Practical AI, not theoretical", es: "IA práctica, no teórica" },
        desc: {
          en: "We implement tools matched to your team's actual comfort level. No generic slide decks.",
          es: "Implementamos herramientas según el nivel real de tu equipo. Sin presentaciones genéricas.",
        },
      },
      {
        title: { en: "We leave you independent", es: "Te dejamos independiente" },
        desc: {
          en: "Our goal is to give your team the processes, tools, and confidence to run without us.",
          es: "Nuestro objetivo es que tu equipo tenga los procesos, herramientas y confianza para operar solo.",
        },
      },
    ],
  },
  squad: {
    eyebrow: { en: "THE SQUAD", es: "EL SQUAD" },
    title: { en: "Meet Your Squad", es: "Conoce a tu Squad" },
    sub: {
      en: "Every engagement assigns the right people to your specific needs. You always work directly with the core team.",
      es: "Cada proyecto asigna las personas correctas según tus necesidades. Siempre trabajas directamente con el equipo principal.",
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
          en: "Maps your real workflows, identifies bottlenecks, and aligns every process improvement to your actual business goals, not just what looks broken on the surface.",
          es: "Mapea tus flujos reales, identifica cuellos de botella y alinea cada mejora de proceso con tus objetivos reales de negocio, no solo lo que parece roto en la superficie.",
        },
        tiers: { en: ["Squaimap", "Squailab", "Squaicore"], es: ["Squaimap", "Squailab", "Squaicore"] },
        borderColor: "primary",
      },
      {
        role: { en: "Knowledge Manager", es: "Gestor de Conocimiento" },
        specialty: { en: "Systems & Knowledge Design", es: "Diseño y Gestión de Conocimiento" },
        desc: {
          en: "Ensures all workflows, playbooks, and documentation are clear, structured, and accessible across your team's tools so knowledge stays in systems, not in people's heads.",
          es: "Garantiza que todos los flujos, playbooks y documentación sean claros, estructurados y accesibles en las herramientas de tu equipo, para que el conocimiento quede en los sistemas, no en la cabeza de las personas.",
        },
        tiers: { en: ["Squailab", "Squaicore"], es: ["Squailab", "Squaicore"] },
        borderColor: "primary",
      },
      {
        role: { en: "Data Analyst", es: "Analista de Datos" },
        specialty: { en: "Data Integrity & Connections", es: "Integridad y Conexiones de Datos" },
        desc: {
          en: "Ensures your data flows correctly across your processes and tools. Validates data integrity, identifies where information is incomplete or misused.",
          es: "Garantiza que tus datos fluyan correctamente a través de tus procesos y herramientas. Valida la integridad de los datos e identifica dónde la información está incompleta o mal usada.",
        },
        tiers: { en: ["Squaicore"], es: ["Squaicore"] },
        borderColor: "primary",
      },
      {
        role: { en: "Information Security Analyst", es: "Analista de Seguridad de la Información" },
        specialty: { en: "Security & Risk Management", es: "Gestión de Seguridad y Riesgos" },
        desc: {
          en: "Ensures your processes, tools, and documentation follow information security best practices so your business handles sensitive data responsibly and stays protected as it grows.",
          es: "Garantiza que tus procesos, herramientas y documentación sigan las mejores prácticas de seguridad de la información, para que tu negocio maneje datos sensibles de forma responsable y esté protegido a medida que crece.",
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
    ]
  },
  ctaSection: {
    headline: { en: "Ready to meet your squad?", es: "¿Listo para conocer tu squad?" },
    sub: {
      en: "A real squad, a free 30-minute call. No commitment. No pressure. Just clarity.",
      es: "Un equipo real, una llamada gratuita de 30 minutos. Sin compromiso. Sin presión. Solo claridad.",
    },
    cta: { en: "Book Your Free Call", es: "Agenda tu Llamada Gratis" },
  },
  footer: {
    tagline: {
      en: "We Work With Your Team So AI Can Too.",
      es: "Trabajamos con tu equipo para que la IA también pueda.",
    },
    links: {
      en: ["Services", "How It Works", "Contact"],
      es: ["Servicios", "Cómo Funciona", "Contacto"],
    },
    sections: ["services", "how-it-works", "contact"],
    copyright: "© 2026 Squai. All rights reserved.",
  },
};