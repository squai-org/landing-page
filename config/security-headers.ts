export interface SecurityHeader {
  key: string;
  value: string;
}

export interface HeaderRule {
  path: string;
  headers: SecurityHeader[];
}

/** Base CSP directive-value map shared between production and dev configurations. */
export const BASE_CSP_DIRECTIVES: Record<string, string> = {
  "default-src": "'self'",
  "script-src": "'self'",
  "style-src": "'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src": "'self' https://fonts.gstatic.com",
  "img-src": "'self' data: https://storage.googleapis.com",
  "connect-src": `'self' ${process.env.VITE_API_URL ?? ""}`.trim(),
  "frame-ancestors": "'none'",
  "object-src": "'none'",
  "base-uri": "'self'",
  "form-action": "'self'",
  "upgrade-insecure-requests": "",
};

/** Builds a CSP header string from {@link BASE_CSP_DIRECTIVES} with optional overrides. */
export function buildCsp(overrides: Record<string, string> = {}): string {
  const merged = { ...BASE_CSP_DIRECTIVES, ...overrides };
  return Object.entries(merged)
    .map(([key, value]) => (value ? `${key} ${value}` : key))
    .join("; ");
}

const CSP = buildCsp();

/** Production security headers applied to all routes. */
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

/** Serializes header rules into Netlify/Cloudflare `_headers` file format. */
export function toHeadersFile(rules: HeaderRule[]): string {
  return rules
    .map((rule) => {
      const lines = rule.headers.map((h) => `  ${h.key}: ${h.value}`);
      return rule.path + "\n" + lines.join("\n");
    })
    .join("\n\n");
}

/** Converts header rules into the Vercel `vercel.json` headers format. */
export function toVercelHeaders(
  rules: HeaderRule[],
): { source: string; headers: { key: string; value: string }[] }[] {
  return rules.map((rule) => ({
    source: rule.path === "/*" ? "/(.*)" : rule.path.replace("*", "(.*)"),
    headers: rule.headers.map((h) => ({ key: h.key, value: h.value })),
  }));
}

/** Flattens the catch-all (`/*`) rule into a key-value Record for dev middleware. */
export function toFlatHeaders(
  rules: HeaderRule[],
): Record<string, string> {
  const catchAll = rules.find((r) => r.path === "/*");
  if (!catchAll) return {};
  return Object.fromEntries(catchAll.headers.map((h) => [h.key, h.value]));
}
