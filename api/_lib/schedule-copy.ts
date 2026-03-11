export type ScheduleLang = "en" | "es";

type ScheduleCopy = {
  summary: string;
  labels: {
    name: string;
    company: string;
    email: string;
    message: string;
    reschedule: string;
  };
  cta: {
    reschedule: string;
  };
};

const COPY: Record<ScheduleLang, ScheduleCopy> = {
  en: {
    summary: "Discovery Call",
    labels: {
      name: "Name",
      company: "Company",
      email: "Email",
      message: "Message",
      reschedule: "Reschedule",
    },
    cta: {
      reschedule: "Reschedule",
    },
  },
  es: {
    summary: "Llamada de Descubrimiento",
    labels: {
      name: "Nombre",
      company: "Empresa",
      email: "Correo",
      message: "Mensaje",
      reschedule: "Reagendar",
    },
    cta: {
      reschedule: "Reagendar",
    },
  },
};

export function getScheduleCopy(lang: ScheduleLang): ScheduleCopy {
  return COPY[lang];
}
