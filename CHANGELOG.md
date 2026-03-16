# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

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
