import { type Plugin } from "vite";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  securityHeaders,
  toFlatHeaders,
  toHeadersFile,
  toVercelHeaders,
} from "../config/security-headers";

/**
 * Vite plugin that:
 *  1. Injects security headers into the dev-server responses.
 *  2. At build time, writes provider config files into `dist/`:
 *     - `_headers`    → Netlify / Cloudflare Pages
 *     - `vercel.json` → Vercel (project root is copied by Vercel CLI automatically)
 */
export default function securityHeadersPlugin(): Plugin {
  return {
    name: "security-headers",

    // ── Dev: attach headers to every response ───────────────────────
    // In development Vite injects inline scripts for HMR / React-refresh,
    // so we relax script-src to allow 'unsafe-inline' + 'unsafe-eval'.
    // connect-src must also allow the WebSocket used by HMR.
    configureServer(server) {
      const devHeaders = toFlatHeaders(securityHeaders);

      // Build a dev-safe CSP by loosening script-src and connect-src
      const devCsp = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https://storage.googleapis.com",
        "connect-src 'self' ws://localhost:* ws://[::1]:*",
        "frame-ancestors 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join("; ");

      server.middlewares.use((_req, res, next) => {
        for (const [key, value] of Object.entries(devHeaders)) {
          if (key === "Content-Security-Policy") {
            res.setHeader(key, devCsp);
          } else {
            res.setHeader(key, value);
          }
        }
        next();
      });
    },

    // ── Build: emit provider-specific files into dist/ ──────────────
    closeBundle() {
      const outDir = resolve(process.cwd(), "dist");

      // Netlify / Cloudflare Pages portable format
      writeFileSync(
        resolve(outDir, "_headers"),
        toHeadersFile(securityHeaders),
        "utf-8",
      );

      // Vercel (also kept in project root; this copy lands in dist/ as reference)
      const vercelConfig = JSON.stringify(
        { headers: toVercelHeaders(securityHeaders) },
        null,
        2,
      );
      // Write/overwrite the project-root vercel.json so it stays in sync
      writeFileSync(resolve(process.cwd(), "vercel.json"), vercelConfig, "utf-8");
    },
  };
}
