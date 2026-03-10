/**
 * Post-build prerender script.
 * Spins up a static server for the Vite build output, visits each route with
 * Puppeteer, and overwrites the HTML files with the fully-rendered markup so
 * that search-engine crawlers receive real content instead of an empty <div>.
 *
 * On CI environments (Vercel, GitHub Actions, etc.) where Chrome is not
 * available, the script exits gracefully — the static index.html already
 * contains all critical SEO meta tags, structured data, and OG tags.
 * Run `npm run build` locally to commit prerendered HTML before deploying.
 */

import handler from "serve-handler";
import http from "node:http";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "dist");
const PORT = 45678;
const ROUTES = ["/en", "/es", "/en/privacy", "/es/privacy"];

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
  // Try to import puppeteer — skip gracefully if Chrome is not available (CI)
  let launch;
  try {
    const puppeteer = await import("puppeteer");
    launch = puppeteer.launch ?? puppeteer.default?.launch;
  } catch {
    console.log("[prerender] Puppeteer not available — skipping prerender (CI detected).");
    console.log("[prerender] Static index.html already contains SEO meta tags.");
    return;
  }

  let browser;
  try {
    browser = await launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  } catch (err) {
    console.log(`[prerender] Could not launch Chrome: ${err.message}`);
    console.log("[prerender] Skipping prerender — run locally to generate static HTML.");
    return;
  }

  const server = await startServer();

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

try {
  await prerender();
} catch (err) {
  console.error("[prerender] Fatal:", err);
  process.exit(1);
}
