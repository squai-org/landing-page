import type { SupportedLang } from "../config/lang.js";
import { loadTranslation, interpolate } from "./i18n.service.js";

function escapeHtml(str: string): string {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function joinLines(lines: (string | false)[]): string {
  return lines.filter((l): l is string => l !== false).join("<br/>");
}

/** Parameters for rendering a schedule confirmation email. */
export interface ScheduleEmailParams {
  name: string;
  company: string;
  dateTime: string;
  meetLink: string;
  detail: string;
  rescheduleLink: string;
}

/** Renders an HTML schedule confirmation email using i18n templates. */
export function buildScheduleEmail(
  lang: SupportedLang,
  params: ScheduleEmailParams,
): string {
  const t = loadTranslation(lang);
  const copy = t.backend.email.schedule;

  const { name, company, dateTime, meetLink, detail, rescheduleLink } = params;
  const e = escapeHtml;

  const greeting = interpolate(copy.greeting, {
    name: e(name),
    company: e(company),
  });

  const ctaHtml = rescheduleLink
    ? `<a href="${e(rescheduleLink)}">${e(copy.ctaLabel)}</a>`
    : "";

  const rescheduleTextHtml = rescheduleLink
    ? interpolate(copy.rescheduleText, { cta: ctaHtml })
    : "";

  return joinLines([
    `<b>${e(copy.heading)}</b>`,
    "",
    greeting,
    "",
    `<b>${e(copy.detailsHeading)}</b>`,
    "",
    `${copy.dateLabel}: ${e(dateTime)}`,
    !!meetLink &&
      `${copy.meetLabel}: <a href="${e(meetLink)}">${e(meetLink)}</a>`,
    !!detail && "",
    !!detail && copy.problemQuestion,
    !!detail && `"${e(detail)}"`,
    !!rescheduleLink && "",
    !!rescheduleLink && rescheduleTextHtml,
  ]);
}
