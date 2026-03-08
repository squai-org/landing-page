export type Lang = "en" | "es";

export const content = {
  nav: {
    links: {
      en: ["Services", "How It Works", "Industries", "Contact"],
      es: ["Servicios", "Cómo funciona", "Industrias", "Contacto"],
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
      es: "Trabajamos junto a tu equipo, mapeamos cómo funciona tu negocio e integramos IA que realmente funciona, no solo herramientas que se ven bien en una presentación.",
    },
    cta1: { en: "Book a Free Discovery Call", es: "Agenda una llamada gratuita" },
    cta2: { en: "See Our Services", es: "Ver nuestros servicios" },
  },
  problems: {
    eyebrow: { en: "SOUND FAMILIAR?", es: "¿TE SUENA FAMILIAR?" },
    title: { en: "You're not the only one stuck here.", es: "No eres el único pasando por esto." },
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
          es: "No necesitas un proyecto de seis cifras ni 200 diapositivas. Necesitas a alguien que trabaje de verdad contigo.",
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
          es: "El primer paso antes de cambiar cualquier cosa.",
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
            "Un análisis profundo de tus operaciones: cómo trabaja tu equipo hoy, dónde están los cuellos de botella y qué te está costando tiempo y dinero",
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
          es: "Precio fijo. Incluido en todos los niveles, sin atajos.",
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
          es: "Tomamos los hallazgos del Squaimap y nos ponemos a trabajar. Juntos decidimos qué flujos importan más ahora mismo, los documentamos bien, los hacemos accesibles para todo tu equipo e integramos IA donde tiene más sentido para tu negocio.",
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
            "3 a 5 flujos de trabajo principales completamente mapeados y documentados, lo suficientemente claros para que cualquiera en tu equipo pueda seguirlos",
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
          es: "Este es el trabajo completo. Profundizamos en toda tu operación, mapeamos cada flujo crítico, construimos un playbook completo sobre el que tu negocio pueda sostenerse e implementamos IA donde genera verdadero valor. Luego entrenamos a tu equipo de forma práctica para que esté listo para operar y crecer cuando el proyecto termine.",
        },
        items: {
          en: [
            "Everything in Squaimap",
            "6 to 10 core workflows fully mapped, documented, and interconnected",
            "A complete operational playbook covering your entire business",
            "AI implementations across all priority workflows, with scope defined collaboratively during Squaimap",
            "A data integrity review so your decisions are built on reliable, well-connected information",
            "An information security review so your processes and tools handle sensitive data responsibly",
            "Full team training — hands-on, process-by-process, and built for real use",
            "2 weeks of post-delivery support",
          ],
          es: [
            "Todo lo del Squaimap",
            "6 a 10 flujos de trabajo principales completamente mapeados, documentados e interconectados",
            "Un playbook operativo completo que cubre todo tu negocio",
            "Implementaciones de IA en todos los flujos prioritarios, con alcance definido de forma colaborativa durante el Squaimap",
            "Una revisión de integridad de datos para que tus decisiones estén basadas en información confiable y bien conectada",
            "Una revisión de seguridad de la información para que tus procesos y herramientas manejen datos sensibles de forma responsable",
            "Entrenamiento completo del equipo, práctico, por proceso y diseñado para el uso real",
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
    title: { en: "How It Works", es: "Cómo funciona" },
    steps: {
      en: ["Discovery Call", "Proposal in 48hrs", "Kickoff", "Mapping & Building", "Delivery", "Support Period"],
      es: ["Llamada de diagnóstico", "Propuesta en 48hrs", "Kickoff", "Mapeo y construcción", "Entrega", "Período de soporte"],
    },
  },
  industries: {
    eyebrow: { en: "WHO WE SERVE", es: "A QUIÉN SERVIMOS" },
    title: { en: "Industries We Serve", es: "Industrias que atendemos" },
    items: {
      en: ["SaaS & Tech Startups", "E-Learning & Education", "Professional Services", "Digital E-Commerce", "Agencies & Consultancies"],
      es: ["SaaS y Startups Tech", "E-Learning y Educación", "Servicios Profesionales", "E-Commerce Digital", "Agencias y Consultoras"],
    },
  },
  whySquai: {
    eyebrow: { en: "WHY SQUAI", es: "POR QUÉ SQUAI" },
    title: { en: "Why Squai", es: "¿Por qué Squai?" },
    items: [
      {
        title: { en: "A squad, not a solo consultant", es: "Un equipo, no un solo consultor" },
        desc: {
          en: "Real people with defined roles working inside your business — not a chatbot, not a framework, not a slide deck.",
          es: "Personas reales con roles definidos trabajando dentro de tu negocio, no un chatbot, no una metodología, no una presentación.",
        },
      },
      {
        title: { en: "We speak your language — literally", es: "Hablamos tu idioma, literalmente" },
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
        title: { en: "We build for when we're gone", es: "Construimos para que no nos necesites para siempre" },
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
      en: "Your main point of contact from day one. Diagnoses your business, designs the operational roadmap, and keeps the entire engagement on track.",
      es: "Tu punto de contacto principal desde el primer día. Diagnostica tu negocio, diseña la hoja de ruta operativa y mantiene todo el proyecto en la dirección correcta.",
    },
    tiers: { en: ["Squaimap", "Squailab", "Squaicore"], es: ["Squaimap", "Squailab", "Squaicore"] },
    borderColor: "accent",
  },
  {
    role: { en: "AI Engineer", es: "Ingeniero de IA" },
    specialty: { en: "Automation Specialist", es: "Especialista en Automatización" },
    desc: {
      en: "Builds the AI solutions identified in Squaimap. Custom automations and tool integrations designed around how your team actually works — not generic fixes.",
      es: "Construye las soluciones de IA identificadas en el Squaimap. Automatizaciones e integraciones diseñadas alrededor de cómo trabaja tu equipo, no soluciones genéricas.",
    },
    tiers: { en: ["Squailab", "Squaicore"], es: ["Squailab", "Squaicore"] },
    borderColor: "secondary",
  },
  {
    role: { en: "Business Process Analyst", es: "Analista de Procesos de Negocio" },
    specialty: { en: "Process Design & Strategy", es: "Diseño y Estrategia de Procesos" },
    desc: {
      en: "Maps how your team actually works day to day — not how it's supposed to on paper. Finds where things slow down or break, and connects every fix to something that matters.",
      es: "Mapea cómo trabaja tu equipo de verdad, día a día, no como dice el manual. Encuentra dónde las cosas fallan y conecta cada mejora con algo que realmente importa.",
    },
    tiers: { en: ["Squaimap", "Squailab", "Squaicore"], es: ["Squaimap", "Squailab", "Squaicore"] },
    borderColor: "primary",
  },
  {
    role: { en: "Knowledge Manager", es: "Gestor de Conocimiento" },
    specialty: { en: "Systems & Knowledge Design", es: "Diseño y Gestión de Conocimiento" },
    desc: {
      en: "Turns everything we build into clear, structured documentation that lives inside your team's existing tools — so anyone can follow it, not just the people who were in the room.",
      es: "Convierte todo lo que construimos en documentación clara y estructurada que vive en las herramientas que tu equipo ya usa, para que cualquiera pueda seguirla, no solo quienes estuvieron en las reuniones.",
    },
    tiers: { en: ["Squailab", "Squaicore"], es: ["Squailab", "Squaicore"] },
    borderColor: "primary",
  },
  {
    role: { en: "Data Analyst", es: "Analista de Datos" },
    specialty: { en: "Data Integrity & Connections", es: "Integridad y Conexiones de Datos" },
    desc: {
      en: "Makes sure the data running through your processes is actually reliable. Finds where information is missing, disconnected, or leading to bad decisions — and fixes it.",
      es: "Se asegura de que los datos que fluyen por tus procesos sean confiables. Encuentra dónde hay información incompleta, desconectada o mal usada, y lo corrige antes de que se convierta en un problema mayor.",
    },
    tiers: { en: ["Squaicore"], es: ["Squaicore"] },
    borderColor: "primary",
  },
  {
    role: { en: "Information Security Analyst", es: "Analista de Seguridad de la Información" },
    specialty: { en: "Security & Risk Management", es: "Gestión de Seguridad y Riesgos" },
    desc: {
      en: "Reviews how your processes, tools, and documentation handle sensitive data. Makes sure everything we build follows security best practices — so your business is protected as it grows.",
      es: "Revisa cómo tus procesos, herramientas y documentación manejan información sensible. Se asegura de que todo lo que construimos siga las mejores prácticas de seguridad, para que tu negocio esté protegido a medida que crece.",
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
  contactModal: {
    title: { en: "Let's talk about your challenge", es: "Cuéntanos tu desafío" },
    description: {
      en: "Leave us your email and a brief description of the problem you're facing. We'll get back to you within 48 hours.",
      es: "Déjanos tu correo y una breve descripción del problema que enfrentas. Te responderemos en menos de 48 horas.",
    },
    emailLabel: { en: "Email", es: "Correo electrónico" },
    emailPlaceholder: { en: "you@company.com", es: "tu@empresa.com" },
    emailRequired: { en: "Email is required", es: "El correo es obligatorio" },
    emailInvalid: { en: "Please enter a valid email", es: "Ingresa un correo válido" },
    descriptionLabel: { en: "What problem are you facing?", es: "¿Qué problema enfrentas?" },
    descriptionPlaceholder: {
      en: "Tell us briefly about the challenge you'd like help with…",
      es: "Cuéntanos brevemente el desafío con el que necesitas ayuda…",
    },
    submit: { en: "Send", es: "Enviar" },
  },
  ctaSection: {
    headline: { en: "Ready to meet your squad?", es: "¿Listo para conocer tu squad?" },
    sub: {
      en: "A real squad, a free 30-minute call. No commitment, no pressure — just an honest conversation about where you are and where you want to go.",
      es: "Un equipo real, una llamada gratuita de 30 minutos. Sin compromiso, sin presión, solo una conversación honesta sobre dónde estás y a dónde quieres llegar.",
    },
    cta: { en: "Book Your Free Call", es: "Agenda tu llamada gratis" },
  },
  privacy: {
    title: { en: "Privacy Policy", es: "Política de Privacidad" },
    lastUpdated: { en: "Last updated: March 8, 2026", es: "Última actualización: 8 de marzo de 2026" },
    backHome: { en: "← Back to home", es: "← Volver al inicio" },
    sections: [
      {
        heading: { en: "Who we are", es: "Quiénes somos" },
        body: {
          en: "Squai is responsible for processing the personal data collected through this website. If you have any questions, you can reach us at heysquai@gmail.com.",
          es: "Squai es responsable del tratamiento de los datos personales recopilados a través de este sitio web. Si tienes alguna pregunta, puedes contactarnos en heysquai@gmail.com.",
        },
      },
      {
        heading: { en: "What data we collect", es: "Qué datos recopilamos" },
        body: {
          en: "When you use our contact form, we collect your name, email address, and the message you write. We do not collect any other personal data.",
          es: "Cuando usas nuestro formulario de contacto, recopilamos tu nombre, correo electrónico y el mensaje que escribes. No recopilamos ningún otro dato personal.",
        },
      },
      {
        heading: { en: "Why we collect it", es: "Para qué los usamos" },
        body: {
          en: "We use your data solely to respond to your inquiry. We will not use it for marketing, profiling, or any other purpose.",
          es: "Usamos tus datos únicamente para responder a tu consulta. No los utilizaremos para marketing, perfilado ni ningún otro propósito.",
        },
      },
      {
        heading: { en: "Third parties", es: "Terceros" },
        body: {
          en: "To deliver our response to you, we use Resend as our email-sending service. Your data may be processed by this provider in accordance with their own privacy policy. We do not share your data with anyone else.",
          es: "Para enviarte nuestra respuesta, utilizamos Resend como servicio de envío de correo. Tus datos pueden ser procesados por este proveedor de acuerdo con su propia política de privacidad. No compartimos tus datos con nadie más.",
        },
      },
      {
        heading: { en: "How long we keep your data", es: "Cuánto tiempo conservamos tus datos" },
        body: {
          en: "We keep your data for up to 1 year after your inquiry. After that period, it is permanently deleted.",
          es: "Conservamos tus datos hasta 1 año después de tu consulta. Pasado ese plazo, se eliminan de forma permanente.",
        },
      },
      {
        heading: { en: "Your rights", es: "Tus derechos" },
        body: {
          en: "You have the right to access, correct, or delete your personal data at any time. You can also withdraw your consent. These rights apply regardless of where you are located.",
          es: "Tienes derecho a acceder, corregir o eliminar tus datos personales en cualquier momento. También puedes retirar tu consentimiento. Estos derechos aplican sin importar tu ubicación.",
        },
      },
      {
        heading: { en: "How to exercise your rights", es: "Cómo ejercer tus derechos" },
        body: {
          en: "To exercise any of these rights, send us an email at heysquai@gmail.com. We will respond within 30 days.",
          es: "Para ejercer cualquiera de estos derechos, envíanos un correo a heysquai@gmail.com. Responderemos en un plazo de 30 días.",
        },
      },
    ],
  },
  footer: {
    tagline: {
      en: "Your team doesn't need to figure out AI alone.",
      es: "Tu equipo no tiene que descifrar la IA solo.",
    },
    links: {
      en: ["Services", "How It Works", "Contact"],
      es: ["Servicios", "Cómo funciona", "Contacto"],
    },
    sections: ["services", "how-it-works", "contact"],
    copyright: "© 2026 Squai. All rights reserved.",
  },
};
