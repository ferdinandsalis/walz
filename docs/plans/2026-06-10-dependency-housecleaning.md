# Dependency Housecleaning Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Bring all dependencies, GitHub Actions, and toolchain majors current (except the lint/format toolchain, which stays eslint 9 + prettier per decision), clear the npm audit backlog so the Security Audit workflow passes, and fix standing lint/deprecation hygiene.

**Architecture:** Staged, independently verifiable commits on `chore/housecleaning-2026-06`. Every stage ends with the same verify gate; a failing stage gets fixed or reverted before the next begins. Riskiest migrations (Vite 8, Tailwind 4) go last so earlier value ships even if they stall.

**Tech Stack:** npm, React Router 7, Vite, Vitest, Playwright, Tailwind CSS, Sanity, GitHub Actions, Fly.io.

**Verify gate (used by every task):**
```bash
npm run typecheck && npm run lint && npx vitest run && npm run build
```
Expected: typecheck silent, lint ≤3 known warnings (0 after Task 8), `21 passed`, build completes.

**Decisions already made (do not relitigate):**
- Lint/format stays on `@epic-web/config` 1.x (eslint 9 + prettier). No oxlint/oxfmt, no eslint 10.
- TypeScript 6.0 OK (typescript-eslint supports `<6.1.0`). Vite 8 OK (`@react-router/dev` 7.17 + vitest 4.1 both allow `^8`).
- Commits unsigned: `git -c commit.gpgsign=false commit ...` (sandbox has no pinentry TTY).

---

### Task 1: In-range updates (patch/minor across the board)

**Files:** Modify: `package.json`, `package-lock.json`

**Step 1:** `npm update` (updates ~45 packages within existing semver ranges; react-router → 7.17, sanity → 5.31, sentry → 10.57, react → 19.2.7, vitest → 4.1, zod → 4.4, etc.)
**Step 2:** Run the verify gate. Watch especially: react-router 7.13→7.17 typegen output, sanity studio imports.
**Step 3:** `npm audit --json | node -e "..."` — record the new vuln count (was 2 critical / 12 high / 27 moderate; expect a large drop).
**Step 4:** Commit: `chore: update dependencies within semver ranges`

### Task 2: GitHub Actions bumps (Node 20 deprecation deadline June 16, 2026)

**Files:** Modify: `.github/workflows/deploy.yml`, `.github/workflows/security.yml`, any other workflow using the actions below.

**Step 1:** Bump every occurrence: `actions/setup-node@v4` → `@v6`, `actions/upload-artifact@v4` → `@v7`, `actions/github-script@v7` → `@v9`. Leave `checkout@v5`, `dependency-review-action@v4`, `fetch-metadata@v2`, `bahmutov/npm-install@v1`, `toml-action`, `flyctl-actions` untouched (not flagged).
**Step 2:** Check setup-node v6 breaking changes vs our usage (we pass only `node-version`; v6 changed cache defaults — confirm no `cache:` key assumptions).
**Step 3:** Commit: `ci: bump setup-node, upload-artifact, github-script off Node 20 runtimes`. (Real test is the PR's CI run.)

### Task 3: Type-package majors

**Files:** Modify: `package.json`, `package-lock.json`

**Step 1:** `npm install -D @types/react@19 @types/react-dom@19 @types/node@24` — aligns types with React 19 runtime and Node 24 engines. NOTE: `@types/node@24` not `@25` (match engines).
**Step 2:** Verify gate. Expect possible TS errors from React-19 types (e.g. `JSX.Element` namespace moves, `ReactNode` strictness, `forwardRef` inference in `app/components/ui/*`). Fix each properly — no `@ts-ignore`.
**Step 3:** `npm install -D esbuild@^0.28` (used by `other/build-server.ts`), re-run build.
**Step 4:** Commit: `chore: align @types/react(-dom) with React 19, @types/node with Node 24, esbuild 0.28`

### Task 4: Audit cleanup → Security Audit green

**Files:** Modify: `package.json` (possibly `overrides`), `package-lock.json`

**Step 1:** `npm audit` — list what remains after Tasks 1+3.
**Step 2:** `npm audit fix` (no `--force`). Verify gate.
**Step 3:** For remaining transitive vulns: add targeted `overrides` in package.json only where the parent package has no fixed release; re-run `npm ci && npm audit`. Anything that would need a breaking parent upgrade we don't want: document in the PR body as accepted/deferred with reasoning.
**Step 4:** Goal check: `npm audit --audit-level=moderate; echo "exit: $?"` — exit 0, or documented exceptions.
**Step 5:** Commit: `chore: clear npm audit backlog (overrides for unfixed transitives)`

### Task 5: TypeScript 6.0

**Files:** Modify: `package.json`, `package-lock.json`, any source files with new errors.

**Step 1:** `npm install -D typescript@^6.0.0`
**Step 2:** `npm run typecheck` — fix fallout (TS 6 tightens some inference; expect small fixes, not rewrites). If fallout exceeds ~10 files, STOP and report before proceeding.
**Step 3:** Full verify gate. **Step 4:** Commit: `chore: TypeScript 6`

### Task 6: Vite 8

**Files:** Modify: `package.json`, `package-lock.json`, possibly `vite.config.ts`.

**Step 1:** `npm install -D vite@^8.0.0`
**Step 2:** Read Vite 8 migration notes (WebFetch https://vite.dev/guide/migration) — check `ssr` and `build.rollupOptions` usage in `vite.config.ts` (we externalize node builtins) and the Sentry plugin.
**Step 3:** Verify gate + `npm run dev` smoke: `curl -s localhost:3000/ | grep -c Walz` ≥ 1.
**Step 4:** Local e2e: `npm run test:e2e:run` — all Playwright specs pass.
**Step 5:** Commit: `chore: Vite 8`

### Task 7: Tailwind CSS 4 migration (the big one)

**Files:** Modify: `tailwind.config.ts` (likely deleted), `postcss.config.js` (replaced), `app/styles/app.css` (gains `@theme`), `app/utils/extended-theme.ts` (folded into CSS or kept via `@config`), `package.json`, `vite.config.ts` (add `@tailwindcss/vite`).

**Step 1:** Read `app/utils/extended-theme.ts` and `app/styles/app.css` fully first.
**Step 2:** Run the official codemod: `npx @tailwindcss/upgrade` — it converts config to CSS-first, rewrites renamed utilities in templates, and updates PostCSS setup. Review its diff hunk by hunk before accepting.
**Step 3:** Plugin replacements: `@tailwindcss/container-queries` → delete (core in v4); `tailwindcss-radix@4`; `tailwindcss-animate` → `tw-animate-css` (or keep if the codemod handles it); `tailwind-merge@3`; `prettier-plugin-tailwindcss@^0.8`.
**Step 4:** Preserve custom screens (sm 600 / md 768 / lg 896 / xl 1160) and container padding in `@theme` — verify against the codemod output; these override defaults and silently reverting them would reflow every page.
**Step 5:** Verify gate + visual pass: `npm run dev`, then Ferdinand eyeballs `/`, `/aktuelles`, `/curriculum`, `/magazin`, `/ueber-uns` against production. Do NOT merge on green CI alone — CSS migrations need eyes.
**Step 6:** Local e2e again. **Step 7:** Commit: `chore: migrate to Tailwind CSS 4`

### Task 8: Code hygiene

**Files:** Modify: `app/components/error-boundary.test.tsx` (import-type annotation; beforeEach → per-test setup), `app/routes/aufnahme+/_index.tsx` (remove unused `AdmissionTimeline` or underscore it — check git intent first), `app/sanity/instance.ts` (`createImageUrlBuilder` named import).

**Step 1:** Fix each; `npm run lint` → **0 warnings**. Vitest still 21 passed (test refactor must not reduce coverage).
**Step 2:** Commit: `chore: clear lint warnings and deprecated sanity image-url import`

### Task 9: Ship

**Step 1:** Push branch, open PR with stage-by-stage body incl. accepted-risk list from Task 4.
**Step 2:** Monitor CI (all checks + the previously failing Security Audit workflow on this branch if triggerable).
**Step 3:** After Ferdinand's visual OK on Tailwind 4: squash-merge, watch main run through Fly deploy, then live-verify walz.at key pages.
