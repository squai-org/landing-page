/**
 * Post-build prerender script.
 * Spins up a static server for the Vite build output, visits each route with
 * Puppeteer, and overwrites the HTML files with the fully-rendered markup so
 * that search-engine crawlers receive real content instead of an empty <div>.
 */

import { launch } from "puppeteer";
import handler from "serve-handler";
import http from "node:http";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "dist");
const PORT = 45678;
const ROUTES = ["/", "/privacy"];

/** Create a tiny static file server pointed at dist/ */
function startServer() {
  const server = http.createServer((req, res) =>
    handler(req, res, {
      public: DIST,
      rewrites: [{ source: "/**", destination: "/index.html" }],
    }),
  );
  return new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`[prerender] Static server on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function prerender() {
  const server = await startServer();
  const browser = await launch({ headless: true, args: ["--no-sandbox"] });

  for (const route of ROUTES) {
    const url = `http://localhost:${PORT}${route}`;
    console.log(`[prerender] Rendering ${url} …`);

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30_000 });

    // Let React Helmet update <head>
    await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));

    const html = await page.content();
    await page.close();

    // Determine output file path
    const outDir =
      route === "/" ? DIST : path.join(DIST, route.replace(/^\//, ""));
    await mkdir(outDir, { recursive: true });
    const outFile = path.join(outDir, "index.html");
    await writeFile(outFile, html, "utf-8");
    console.log(`[prerender] Wrote ${outFile}`);
  }

  await browser.close();
  server.close();
  console.log("[prerender] Done ✓");
}

prerender().catch((err) => {
  console.error("[prerender] Fatal:", err);
  process.exit(1);
});
