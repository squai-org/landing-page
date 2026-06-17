import { type Plugin } from "vite";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  buildCsp,
  securityHeaders,
  toFlatHeaders,
  toHeadersFile,
  toVercelHeaders,
} from "../config/security-headers";

export default function securityHeadersPlugin(): Plugin {
  return {
    name: "security-headers",
    
    configureServer(server) {
      const devHeaders = toFlatHeaders(securityHeaders);
      
      const devCsp = buildCsp({
        "script-src": "'self' 'unsafe-inline' 'unsafe-eval'",
        "connect-src": "'self' ws://localhost:* ws: http://localhost:*",
        "upgrade-insecure-requests": "",
      });

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
    
    closeBundle() {
      const outDir = resolve(process.cwd(), "dist");
      mkdirSync(outDir, { recursive: true });
      
      writeFileSync(
        resolve(outDir, "_headers"),
        toHeadersFile(securityHeaders),
        "utf-8",
      );

      const vercelConfig = JSON.stringify(
        {
          ignoreCommand: "git diff --quiet HEAD^ HEAD -- . ':(exclude)teo'",
          headers: toVercelHeaders(securityHeaders),
          rewrites: [
            { source: "/api/:path*", destination: "/api" },
            { source: "/(.*)", destination: "/index.html" },
          ],
        },
        null,
        2,
      );
      writeFileSync(resolve(process.cwd(), "vercel.json"), vercelConfig, "utf-8");
    },
  };
}
