export interface SecurityHeader {
  key: string;
  value: string;
}

export interface HeaderRule {
  path: string;
  headers: SecurityHeader[];
}

export const BASE_CSP_DIRECTIVES: Record<string, string> = {
  "default-src": "'self'",
  "script-src": "'self'",
  "style-src": "'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src": "'self' https://fonts.gstatic.com",
  "img-src": "'self' data:",
  "connect-src": "'self'",
  "frame-ancestors": "'none'",
  "object-src": "'none'",
  "base-uri": "'self'",
  "form-action": "'self'",
  "upgrade-insecure-requests": "",
};

export function buildCsp(overrides: Record<string, string> = {}): string {
  const merged = { ...BASE_CSP_DIRECTIVES, ...overrides };
  return Object.entries(merged)
    .map(([key, value]) => (value ? `${key} ${value}` : key))
    .join("; ");
}

const CSP = buildCsp();

export const securityHeaders: HeaderRule[] = [
  {
    path: "/*",
    headers: [
      { key: "Content-Security-Policy", value: CSP },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      { key: "X-DNS-Prefetch-Control", value: "on" },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    ],
  },
  {
    path: "/assets/*",
    headers: [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
    ],
  },
];

export function toHeadersFile(rules: HeaderRule[]): string {
  return rules
    .map((rule) => {
      const lines = rule.headers.map((h) => `  ${h.key}: ${h.value}`);
      return rule.path + "\n" + lines.join("\n");
    })
    .join("\n\n");
}

export function toVercelHeaders(
  rules: HeaderRule[],
): { source: string; headers: { key: string; value: string }[] }[] {
  return rules.map((rule) => ({
    source: rule.path === "/*" ? "/(.*)" : rule.path.replace("*", "(.*)"),
    headers: rule.headers.map((h) => ({ key: h.key, value: h.value })),
  }));
}

export function toFlatHeaders(
  rules: HeaderRule[],
): Record<string, string> {
  const catchAll = rules.find((r) => r.path === "/*");
  if (!catchAll) return {};
  return Object.fromEntries(catchAll.headers.map((h) => [h.key, h.value]));
}
