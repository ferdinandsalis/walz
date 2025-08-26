# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the website for Walz, a school in Vienna run by a friend. This project has been developed entirely by hand without AI assistance until now. The site is built with React Router v7 (previously Remix) and uses Sanity CMS for content management. The codebase is written in TypeScript and uses Tailwind CSS for styling.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build production application (runs both React Router and server builds)
- `npm run typecheck` - Run TypeScript type checking (generates types first, then runs tsc)
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run unit tests with Vitest
- `npm run test:e2e:dev` - Run end-to-end tests in UI mode
- `npm run test:e2e:run` - Run end-to-end tests in CI mode
- `npm run validate` - Run all checks (tests, lint, typecheck, e2e tests)

## Architecture

### Framework Stack
- **React Router v7** (formerly Remix) - Full-stack React framework
- **Sanity CMS** - Headless CMS for content management
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server

### Key Directories
- `app/` - Main application code
  - `routes/` - File-based routing using flat routes convention
  - `components/` - Reusable UI components
  - `sanity/` - Sanity CMS configuration and schemas
  - `utils/` - Utility functions and helpers
  - `styles/` - Global CSS files
- `public/` - Static assets (images, fonts, downloads)
- `server/` - Express server configuration
- `tests/` - E2E tests with Playwright

### Routing Structure
Uses flat routes convention with route files in `app/routes/`. Special route patterns:
- `_index.tsx` - Index routes
- `+` suffix - Layout routes (e.g., `aufnahme+/`)
- `$` prefix - Dynamic parameters (e.g., `$slug.tsx`)

### Sanity CMS Integration
- Content managed through Sanity Studio accessible at `/studio`
- Schemas defined in `app/sanity/schema/`
- Content fetched using GROQ queries
- Images handled with Sanity's image optimization

### Styling System
- Tailwind CSS with custom configuration
- Component variants using `class-variance-authority`
- Radix UI primitives for accessible components
- Custom font (MuseoSans) loaded from public/fonts/

### State Management
- React Router loaders for server-side data fetching
- Honeypot protection for forms
- Sentry for error monitoring

## Testing
- Unit tests: Vitest
- E2E tests: Playwright
- Run `npm run setup` to install Playwright browsers

## Deployment
- Hosted on Fly.io
- Uses Docker for containerization
- Deploy with `npm run deploy`

## Content Management
The site content is managed through Sanity CMS with the following main content types:
- Posts (blog articles)
- Events
- People (staff/teachers)
- Years (academic years/classes)
- Testimonials
- Curriculum (singleton)
- Costs information

## Special Features
- German-only content (no multi-language support needed)
- PDF downloads for forms and documents
- Image galleries with carousel functionality
- Newsletter subscription integration
- Analytics via Plausible
- Dont mention Claude in commit message or add them as co author