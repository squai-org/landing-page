# Squai Landing Page

Bilingual (EN/ES) landing page and scheduling API for [Squai](https://heysquai.vercel.app/) — an AI implementation consultancy for growing teams in Latin America.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui (Radix) |
| Animations | Motion (framer-motion) |
| Server | Hono (Vercel Serverless) |
| Calendar | Google Calendar API (OAuth + Service Account) |
| Testing | Vitest |
| Linting | ESLint, SonarQube |

## Architecture

```
landing-page/
├── config/                  # Build-time config (CSP, security headers)
├── plugins/                 # Vite plugins (security headers generation)
├── i18n/locales/            # Translation JSON files (en.json, es.json)
├── server/                  # Hono API (Vercel serverless)
│   ├── config/              # Env vars, Google auth, constants, lang
│   ├── controllers/         # Request handlers (schedule, OAuth)
│   ├── middleware/          # Rate limiter
│   ├── routes/              # Route definitions
│   ├── services/            # Business logic (calendar, availability, email, i18n)
│   ├── types/               # Shared interfaces (one per file)
│   ├── utils/               # Error utilities
│   └── validators/          # Input validation and sanitization
├── src/                     # React SPA
│   ├── components/          # UI components + reusable widgets
│   │   └── ui/              # shadcn/ui primitives
│   ├── constants/           # Frontend constants (SEO, animation, validation)
│   ├── hooks/               # Custom hooks (useLang, useIsMobile)
│   ├── i18n/                # Language config and types
│   ├── layouts/             # Layout components (Navbar, Footer, GradientBackground)
│   ├── lib/                 # Utilities (cn, content/translations)
│   └── pages/               # Route pages (Index, Privacy, NotFound)
└── api/                     # Vercel adapter entry point
```

### Key Design Decisions

- **i18n**: JSON-based translations in `i18n/locales/`, accessed via `t(lang)` on the frontend and `loadTranslation(lang)` on the server.
- **Types**: One interface per file under `server/types/`, barrel-exported from `index.ts`.
- **Constants**: Centralized in `server/config/constants.ts` (server) and `src/constants/index.ts` (frontend). No magic strings or numbers.
- **CSP**: Base directives defined once in `config/security-headers.ts`, with dev overrides in the Vite plugin via `buildCsp()`.
- **Validation**: All input validated and sanitized in `server/validators/` before reaching services.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Calendar API credentials (service account or OAuth)

### Setup

```sh
git clone https://github.com/squai-org/landing-page.git
cd landing-page
npm install
```

Create a `.env` file with the required environment variables (see `server/config/env.ts` for all variables).

### Development

```sh
npm run dev
```

### Scripts

| Command | Description |
|---------|-----------|
| `npm run dev` | Start frontend dev server with HMR |
| `npm run build` | Production build (frontend + Vercel config) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

## i18n

Supported languages: English (`en`), Spanish (`es`).

- Frontend translations: `i18n/locales/{en,es}.json` → `t(lang).section.key`
- Server translations: same JSON files → `loadTranslation(lang).backend.*`
- URL-based routing: `/:lang/` (e.g., `/en/`, `/es/`)

## API Endpoints

| Method | Path | Description |
|--------|------|-----------|
| `POST` | `/api/schedule` | Create a new booking |
| `POST` | `/api/reschedule` | Reschedule an existing booking |
| `GET` | `/api/availability?from=&to=` | Get available time slots |
| `GET` | `/api/oauth/google/start` | Start OAuth consent flow |
| `GET` | `/api/oauth/google/callback` | OAuth callback |
| `GET` | `/api/oauth/google/status` | Check OAuth config status |
| `GET` | `/health` | Health check |

## Deployment

Deployed on Vercel. The Vite build plugin auto-generates `_headers` and `vercel.json` with security headers.

## License

See LICENSE file for details.
