# Teo Landing Page

Spanish-language landing page for **Teo** — an academic tutoring service over WhatsApp for kids in grades 1–5, a product of [Squai S.A.S.](https://heysquai.vercel.app/) Lives in the `teo/` folder of the main `landing-page` repository as a self-contained app and deploys as a subdomain of the main application: `https://teo.squai.io`.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS + bespoke Teo design system (CSS custom properties) |
| Routing | React Router |
| SEO | react-helmet-async, prerender, sitemap |
| Testing | Vitest, Testing Library |
| Linting | ESLint |

## Architecture

Mirrors the structure of the main `landing-page` repository:

```
teo/
├── config/                  # Build-time config (CSP, security headers)
├── plugins/                 # Vite plugins (security headers generation)
├── i18n/locales/            # Translation JSON files (es.json)
├── src/
│   ├── components/          # UI components (SeoHead, FadeUp, WaveDivider, LegalPage)
│   │   └── sections/        # Landing page sections
│   ├── constants/           # Frontend constants (SEO, structured data)
│   ├── i18n/                # Language config and types (Spanish-only)
│   ├── layouts/             # Layout components (Navbar, Footer, MainLayout)
│   ├── lib/                 # Utilities (cn, content/translations)
│   └── pages/               # Route pages (Index, Terms, Privacy, NotFound)
└── public/                  # Static assets (Teo figure, card images, favicon)
```

### Key Design Decisions

- **i18n**: all copy lives in `i18n/locales/es.json`, accessed via `t()` — same pattern as the main landing. The site is Spanish-only, so routes are not locale-prefixed.
- **Security**: identical security posture to the main landing. CSP and headers are defined once in `config/security-headers.ts`; the Vite plugin emits `_headers` and `vercel.json` at build time and applies dev-safe overrides locally.
- **Design system**: the approved Teo visual design is ported verbatim into `src/index.css` (CSS custom properties + handcrafted classes). Tailwind is available for new auxiliary UI (legal pages use semantic `legal-*` classes).
- **Constants**: centralized in `src/constants/index.ts`. No magic strings or numbers.

## Routes

| Path | Page |
|------|------|
| `/` | Landing page |
| `/terminos` | Términos y condiciones |
| `/privacidad` | Política de privacidad |

## Getting Started

```sh
cd teo
npm install
npm run dev        # http://localhost:8081
```

### Scripts

| Command | Description |
|---------|-----------|
| `npm run dev` | Start frontend dev server with HMR |
| `npm run build` | Production build (+ prerender when Chrome is available) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

## CI/CD

CI and CD are independent from the main landing app:

- **CI**: `.github/workflows/teo-ci.yml` runs lint, typecheck, tests, and build — only when files under `teo/**` change. The main app's `landing-ci.yml` ignores `teo/**`.
- **CD**: deploy as a second Vercel project on the same repository with **Root Directory = `teo`** and the `teo.squai.io` subdomain assigned (Settings → Domains). The generated `vercel.json` includes an `ignoreCommand` that skips the deployment when no files in this folder changed; the main app's `vercel.json` does the inverse (`':(exclude)teo'`).

The build auto-generates `_headers` and `vercel.json` with the security headers and SPA rewrites.

### Pending

- Replace the `[fecha]` placeholders in the legal pages once the terms/privacy effective date is set.
- Add an Open Graph image (`og:image`) when brand social assets are ready.
