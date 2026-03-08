/**
 * Single source of truth for all security headers.
 *
 * This config is consumed by:
 *  - The Vite dev-server plugin   (vite-plugin-security-headers.ts)
 *  - The build-time generator      → dist/_headers   (Netlify / Cloudflare Pages)
 *  - vercel.json                   → auto-generated  (Vercel)
 *
 * To on-board a new provider, read this file and translate it into
 * whatever format the provider expects.
 */

export interface SecurityHeader {
  key: string;
  value: string;
}

export interface HeaderRule {
  /** Glob / path pattern that the rule applies to. */
  path: string;
  headers: SecurityHeader[];
}

// ─── Content Security Policy ────────────────────────────────────────────
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https://storage.googleapis.com",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

// ─── Header rules ───────────────────────────────────────────────────────
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

// ─── Helpers for provider adapters ──────────────────────────────────────

/** Format used by Netlify & Cloudflare Pages `_headers` files. */
export function toHeadersFile(rules: HeaderRule[]): string {
  return rules
    .map((rule) => {
      const lines = rule.headers.map((h) => `  ${h.key}: ${h.value}`);
      return rule.path + "\n" + lines.join("\n");
    })
    .join("\n\n");
}

/** Format used by `vercel.json` `headers` array. */
export function toVercelHeaders(
  rules: HeaderRule[],
): { source: string; headers: { key: string; value: string }[] }[] {
  return rules.map((rule) => ({
    source: rule.path === "/*" ? "/(.*)" : rule.path.replace("*", "(.*)"),
    headers: rule.headers.map((h) => ({ key: h.key, value: h.value })),
  }));
}

/**
 * Returns a flat Record<string, string> for the catch-all rule.
 * Useful for Vite dev-server or any Node.js HTTP server.
 */
export function toFlatHeaders(
  rules: HeaderRule[],
): Record<string, string> {
  const catchAll = rules.find((r) => r.path === "/*");
  if (!catchAll) return {};
  return Object.fromEntries(catchAll.headers.map((h) => [h.key, h.value]));
}
