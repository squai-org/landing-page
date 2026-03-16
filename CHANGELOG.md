# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.1](https://github.com/squai-org/landing-page/compare/squai-landing-page-v1.0.0...squai-landing-page-v1.0.1) (2026-03-16)


### Bug Fixes

* **api:** add debug logging to diagnose Vercel routing ([fe8dbbc](https://github.com/squai-org/landing-page/commit/fe8dbbcb124e275c2ca9c23783c64c76b5029e93))
* **api:** add diagnostic logs to schedule handler ([c9f2d47](https://github.com/squai-org/landing-page/commit/c9f2d475f9a3536eb16d86cb7773573cd3edcf74))
* **api:** always use /api prefix (node-server adapter preserves path) ([1541476](https://github.com/squai-org/landing-page/commit/15414765db02959e0bb1b7e961c69d35c2175eab))
* **api:** manual vercel handler to fix body stream hanging ([868a496](https://github.com/squai-org/landing-page/commit/868a496cd2598860bcdf20f74f7d7390c801c328))
* **api:** use dynamic route prefix for Vercel (strips /api) ([73de4d9](https://github.com/squai-org/landing-page/commit/73de4d932368cf7f147b904dbe3a1497d743b786))
* **api:** use node-server/vercel adapter instead of edge ([c048b00](https://github.com/squai-org/landing-page/commit/c048b004ebb1061ef3b06bc1eaa976f8ccd0cfb4))
* rename package from vite_react_shadcn_ts to squai-landing-page ([c241d9a](https://github.com/squai-org/landing-page/commit/c241d9a49018fdf0c309a20903346f0c56d4baee))

## [1.0.0](https://github.com/squai-org/landing-page/releases/tag/v1.0.0) (2026-03-16)

### Added

- **Server architecture**: Decomposed monolithic `schedule.ts` into layered `server/` directory with controllers, services, validators, middleware, routes, config, types, and utils.
- **Centralized constants**: `server/config/constants.ts` with `HttpStatus`, `ErrorCode`, rate limit values, `INTL_LOCALE` mapping, and regex patterns. `src/constants/index.ts` with SEO, animation, and validation constants.
- **Type extraction**: Individual interface files under `server/types/` (`OAuthConfig`, `BusyPeriod`, `TranslationData`) with barrel re-exports.
- **Reusable `LanguageToggle` component**: Consolidated 4 duplicated language toggle implementations (Navbar desktop, Navbar mobile, Footer, Privacy) into a single component with `pill` and `inline` variants.
- **Shared CSP builder**: `buildCsp()` function and `BASE_CSP_DIRECTIVES` map in `config/security-headers.ts`, eliminating CSP duplication between production and dev configs.
- **Error utility**: `getErrorMessage()` in `server/utils/error.ts` replacing duplicated `err instanceof Error ? err.message : ...` patterns across 5 files.
- **JSDoc documentation**: Added to all exported functions, types, interfaces, and constants across server and frontend.
- **JSON-based i18n**: Migrated from inline content objects to `i18n/locales/{en,es}.json` files shared between frontend (`t(lang)`) and server (`loadTranslation(lang)`).
- **Frontend API client**: Services layer for calling the scheduling API from the frontend.
- **`MainLayout` component**: Shared layout wrapper for route pages.
- **API endpoints**: `/api/schedule`, `/api/reschedule`, `/api/availability`, `/api/oauth/google/*`, `/health`.
- **README**: Full rewrite with architecture diagram, API endpoint reference, i18n docs, and deployment notes.
- **CHANGELOG**: This file.

### Changed

- **Component migration**: All 13 section components migrated from `content.xxx[lang]` to `t(lang).xxx` pattern.
- **Naming conventions**: Renamed `Props` to `AnimatedSectionProps`, standardized regex constant suffixes to `_PATTERN`.
- **Replaced magic values**: All HTTP status codes, error strings, regex literals, and configuration values replaced with named constants.
- **`globalThis` over `window`**: Updated `useIsMobile` hook to use `globalThis` per SonarQube recommendation.

### Removed

- **Decorative comments**: Removed ~50 non-standard comments (section headers, JSX label comments, self-evident JSDoc) across 15+ files.
- **Legacy code**: Removed monolithic `schedule.ts`, inline content objects, and duplicated interface definitions.

### Fixed

- **Calendar selected day style**: Fixed styling of the selected day in the contact form date picker.
- **react-day-picker tsconfig**: Resolved type resolution error.
