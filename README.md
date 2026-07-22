# Squai Landing Page

Bilingual (EN/ES) landing page and scheduling API for [Squai](https://squai.io/) — an AI training and consulting company that helps professionals and teams in Latin America use AI in their real work.

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
├── api/                     # Vercel adapter entry point
└── teo/                     # Teo product landing (separate app, see teo/README.md)
```

### Apps

This repository hosts two independently built and deployed apps:

| App | Folder | Domain | CI workflow |
|-----|--------|--------|-------------|
| Squai landing + scheduling API | `.` (root) | squai.io | `landing-ci.yml` |
| Teo product landing | `teo/` | teo.squai.io | `teo-ci.yml` |

Each app has its own `package.json`, lockfile, build, and Vercel project. CI workflows are
path-filtered (`teo/**`), and each app's generated `vercel.json` carries an `ignoreCommand`
so a deployment is skipped when the other app's files are the only ones that changed.

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
| `POST` | `/api/agent` | Chat agent — streams SSE responses |
| `GET` | `/api/oauth/google/start` | Start OAuth consent flow |
| `GET` | `/api/oauth/google/callback` | OAuth callback |
| `GET` | `/api/oauth/google/status` | Check OAuth config status |
| `GET` | `/health` | Health check |

## AI Chat Agent

A sales-and-information chat agent lives in the bottom-right corner of the landing page. It answers questions about Squai (sourced from the same `i18n/locales/*.json` copy the page renders). It does **not** collect names, emails, or calendar times in chat — when a visitor wants to book, the agent calls a single `open_scheduling_form` tool, and the frontend opens the existing scheduling modal so the visitor can fill in their details there.

- **Backend:** `server/agent/` (system prompt, tools, security guard, providers, ReAct loop). Exposed at `POST /api/agent` (`server/routes/agent.routes.ts`), streamed as server-sent events.
- **Frontend:** `src/components/chat/` (`ChatWidget` is mounted once in `src/App.tsx`). When the agent emits a `scheduling_form` event, the widget dispatches the `squai:open-scheduling` window event; `src/pages/Index.tsx` listens for it and opens `<ContactModal>`.

### Switching providers

Set `AI_PROVIDER` in your environment:

| Value | Behavior |
|-------|----------|
| `omniroute` *(default when configured)* | Routes through [OmniRoute](https://github.com/diegosouzapw/OmniRoute), an OpenAI-compatible local gateway that picks the cheapest available backend. Requires `OMNIROUTE_API_KEY` and `OMNIROUTE_BASE_URL` (default `http://localhost:20128/v1`). Use `OMNIROUTE_MODEL=auto` for smart routing. |
| `mock` | Deterministic offline provider — no key or network. Used for local dev, CI, and eval. |

If `AI_PROVIDER` is unset, the factory uses OmniRoute when `OMNIROUTE_API_KEY` is present, otherwise the `mock` provider. See `server/agent/providers/index.ts`.

### Customizing the voice

Edit **only** `server/agent/prompts/voice-tone.ts` to change the assistant's personality, tone, example phrases, and banned words. The system prompt (`server/agent/prompts/system.ts`) is assembled from those slots plus the landing knowledge, so changes cascade everywhere.

### Running the eval

```bash
npm run eval
```

Runs every case in `eval/cases/` (info queries, booking flow, injection attacks, out-of-scope) through the real agent loop, grades each with `eval/judge/google-judge.ts`, and prints a pass-rate table. Thresholds live in `eval/eval.config.ts` (overall ≥ 0.85; injection attacks must be 100% blocked). The judge (separate from the runtime provider) uses Gemini when `GOOGLE_AI_API_KEY` is set, otherwise a deterministic heuristic, so the eval is reproducible without keys.

### Troubleshooting

- **Agent replies look canned / generic:** no `OMNIROUTE_API_KEY` set, so the deterministic `mock` provider is active. Start OmniRoute and set the key + base URL.
- **`401`/`403` from the provider:** check `OMNIROUTE_API_KEY` and that `OMNIROUTE_BASE_URL` reaches your OmniRoute instance.
- **Chat says "book" but form doesn't open:** the frontend expects the `squai:open-scheduling` window event — make sure `src/pages/Index.tsx` still registers the listener.
- **`429 Too many requests`:** the shared IP rate limiter (10 req/min) kicked in.

## Deployment

Deployed on Vercel. The Vite build plugin auto-generates `_headers` and `vercel.json` with security headers.

## License

See LICENSE file for details.
