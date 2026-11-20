# Seitenkopf Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Vertical page title beside the text from 1160px, an orange bar for the current page in the left navigation, a calmer intro on Über uns and more room under the logo on phones.

**Architecture:** Each page names its title once in its route `handle` (`pageTitle`). `app/components/page-title.tsx` reads it: `PageTitle` renders the page's `h1`, `PageTitleSpine` the vertical copy in the root header. Everything else is classes.

**Tech Stack:** React Router 7, Tailwind CSS 4, Vitest + Testing Library, Playwright.

**Spec:** `docs/plans/2026-11-20-seitenkopf-design.md`

## Global Constraints

- Root grid columns in `app/root.tsx` stay as they are.
- One `h1` with the page title per page at every width; from `xl` it is `sr-only`, the vertical title is `aria-hidden`.
- Vertical title: `font-condensed font-bold text-muted-foreground opacity-30`, size `min(5rem, 9vh)`, `writing-mode: vertical-rl` + `rotate-180`, right edge of the header column, top-aligned.
- Horizontal title below `xl`: today's classes with `opacity-40` instead of `opacity-20`.
- Commits without Claude attribution (project CLAUDE.md).

## Review Focus

1. A page with no `pageTitle` (home, Rundgang, Jahrgang, Termin, Beitrag) shows no vertical title and no empty `h1`.
2. Philosophie sub-pages: vertical "Über uns" from `xl`, no new large title below.
3. Long title "Die Walz kennenlernen" at 1160×720 fits on screen.
4. The current-page bar in the nav is not clipped (`nav` has `overflow-hidden` for the phone card).
5. Existing e2e specs that find the page `h1` by role still pass.

---

### Task 1: Title from the route (logic, TDD)

**Files:** Create `app/components/page-title.tsx`, `app/components/page-title.test.tsx`

**Interfaces — Produces:** `usePageTitle(): string | undefined` (deepest route with `handle.pageTitle` wins), `PageTitle()`, `PageTitleSpine()`.

- [ ] Tests first (with `createRoutesStub`): `PageTitle` renders the route's title as `h1`; `PageTitleSpine` renders it `aria-hidden`; no spine and no title when no route names one; a child route without its own title shows its parent's; a child with its own title wins.
- [ ] Run `npx vitest run app/components/page-title.test.tsx` → FAIL (module missing).
- [ ] Implement; run again → PASS. Commit.

### Task 2: Use it everywhere

**Files:** `app/components/toc.tsx` (`PageHead` drops `title`, renders `<PageTitle />`), `toc.test.tsx` (router stub), the 13 routes with the pale title, `philosophie+/_layout.tsx`, `app/root.tsx` (spine in header, `gap-y-8`), `app/components/shell.tsx` (bar marker, `xl:overflow-visible`), Über uns intro classes.

- [ ] Update `toc.test.tsx` to render `PageHead` inside a stub route with `handle: { pageTitle }`; run → FAIL; change `PageHead`; run → PASS.
- [ ] Swap routes to `handle.pageTitle` + `<PageTitle />`; root header spine; nav marker; intro; phone gap.
- [ ] `npm test`, `npm run typecheck`, `npm run lint`, `npx playwright test tests/toc.spec.ts tests/pages.spec.ts` → all pass.
- [ ] Screenshots before/after at 390, 820, 1160×720, 1440 on Über uns, Kontakt, Die Walz kennenlernen, Bildung. Commit.
