# Sanity Studio 6 Upgrade Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to
> implement this plan task-by-task.

**Goal:** Move the embedded Studio from sanity 5.31 to sanity 6 so that
`npm audit` reaches 0 (the Security Audit workflow fails on every run today),
without changing how the public site looks or behaves.

**Architecture:** Two stages on one branch, each ending green. Stage 1 cuts the
public routes loose from the `sanity` package (they import it today only because
zod read-models live in the Studio schema files). Stage 2 is the dependency
bump. Stage 1 must land first: on sanity 6 the main entry imports a global CSS
reset, and every public route that imports a schema file would start loading it.

**Tech Stack:** npm 11 / Node 24 (`mise exec node@24 --`), React Router 7 + Vite
8, Sanity Studio embedded at `/studio`, Vitest, Playwright (runs against
`npm run dev`).

**Verify gate (used by every task):**

```bash
mise exec node@24 -- npm run typecheck && mise exec node@24 -- npm run lint \
  && mise exec node@24 -- npm test -- --run && mise exec node@24 -- npm run build
```

Expected: typecheck silent, lint clean, `45 passed` (plus new tests), build
completes.

---

## Findings that shape this plan (spike on 2026-09-30, reverted)

1. **Audit today: 5 findings, not 4.** 4 high are the adm-zip chain (8 adm-zip
   advisories now, all fixed in 0.6.1), plus 1 moderate: markdown-it < 14.3.1
   (GHSA-253c-mchw-3w2r, published 2026-09-29) via sanity →
   @portabletext/editor 6.
2. **sanity 6.17.0 alone does not reach 0.** It fixes adm-zip under
   @sanity/runtime-cli and markdown-it, but @sanity/cli 8.13.0 adds 11 new
   findings (3 high, 8 moderate), all CLI-only:
   - @sanity/workbench-cli 2.8.0 → @module-federation/vite 1.22.1 →
     @module-federation/dts-plugin 2.9.0, which **pins exactly** adm-zip 0.6.0
     and undici 7.29.0. The undici pin also gets hoisted to the root, so jsdom
     runs on 7.29.0.
   - @vercel/frameworks 3.29.0 **pins exactly** smol-toml 1.5.2
     (GHSA-7w5x-hrqm-74c2, fixed in 1.7.1). The latest @vercel/frameworks
     (3.35.0) still pins 1.5.2.
   - No in-range upstream fix exists: workbench-cli 2.8.0 is the latest version.
   - With three override entries (Task 3), audit reaches **0** and each of these
     packages collapses to a single copy.
3. **Public pages already ship the whole Studio on v5.**
   - `event.tsx` and `year.tsx` hold both the Studio schema (`defineType` from
     `sanity`) and zod read-models (EventSchema, PhotoSchema, alphabetMap, …)
     that routes import.
   - Result: 9 public routes (/, /aktuelles, /aktuelles/beitraege, /jahrgaenge,
     /alumni, /termine/:slug, /ueber-uns, the philosophie layout) load a 4.5 MB
     chunk (**1.4 MB gzipped**).
   - `/ueber-uns` and the philosophie layout get it second-hand: they import
     `LinkPhotoCard` from `routes/_index/route.tsx`, which imports the schema
     files.
4. **On v6 this becomes a visible regression.**
   - sanity 6.17's `lib/index.js` imports `ui5/styles.css` (@sanity/ui
     5.0.0-alpha.11), and `sideEffects` changed from CSS-only to `true`.
   - The build then links a 187 KB stylesheet on those 9 routes. It contains
     `@layer sui.global { *{margin:0;padding:0} :root{color-scheme:light dark} :where(body){background:…} … }`.
   - Tailwind declares `properties, theme, base, components, utilities` first,
     and the route CSS loads later. Layer order beats specificity, so
     `*{padding:0}` overrides every `p-*`/`m-*` utility on those pages.
   - v5 links no CSS on any public route.
5. **Everything else is small:**
   - typecheck has 1 error: `loader.server.ts` casts to `sanity`'s
     `SanityClient`, which is now @sanity/client v8's type. Dropping the cast
     works, because @sanity/react-loader and our client share @sanity/client 7.
   - lint is clean; Vitest has 45/45 passing with clean output.
   - Prod-only install (`npm ci --omit=dev`) imports `sanity`,
     `sanity/structure`, `@sanity/vision`, `@sanity/orderable-document-list` and
     `groq` fine in Node (same as v5). The CSS imports resolve to Node no-op
     shims.
   - New `npm ls` peer markers need in-range bumps: @sanity/client ≥ 7.26.2
     (preview-url-secret, visual-editing-types) and react/react-dom ≥ 19.2.8
     (@portabletext/editor 8). After those, `npm ls --all` and `--omit=dev` show
     nothing new against the baseline (one old tsconfck marker is gone).
   - @sanity/orderable-document-list 2.0.0 depends on @sanity/ui ^3. Bump it to
     2.0.25 (@sanity/ui ^4) so the Studio doesn't carry two @sanity/ui majors
     with separate theme contexts.
   - The `@sanity/uuid` → uuid override is now redundant: @sanity/uuid 3.0.3
     declares `^11.0.0`, and removing the override leaves the lockfile
     byte-identical. The `typeid-js` override is still needed (it still wants
     `^10`). The `js-yaml` override is still needed.
   - CLI 8: `sanity typegen generate` works but warns that `sanity-typegen.json`
     is deprecated in favour of `typegen` in `sanity.cli.ts`.
   - Separately, the committed `app/sanity/types.ts` and `schema.json` are
     already stale on main (queries changed without regenerating), so a
     regenerated diff mixes both. This plan does not regenerate them.
6. **No action needed:**
   - Node is already 24 (v6 needs ≥ 22.12).
   - React strict mode (new default) only applies to `sanity dev`. The embedded
     Studio runs in our app, which has no `<StrictMode>`.
   - No `auth` or `search` config and no `vite` overrides in `sanity.cli.ts`.
   - 6.9.2–6.14.0 had a Portable Text data-loss bug (fixed in 6.14.1). Any
     target ≥ 6.14.1 is fine.

## Decisions (Ferdinand)

**Decided 2026-09-30:**

- D1 `^6.17.0`.
- D2 overrides yes, and drop the redundant `@sanity/uuid` override.
- D3 Stage 1 is its own PR, merged first (Tasks 1–2).
- D4 accept `groq2024`.
- D5 migrate typegen config now (Task 5, upgrade PR).

The options as they were put:

- **D1 Target version:** `^6.17.0` (npm `latest`, published 2026-09-29).
  Alternative: exact `6.15.0` (npm `stable` tag). All of them resolve to
  @sanity/cli 8.13.0, so audit results are the same.
- **D2 Overrides:** add `smol-toml` under `@vercel/frameworks`, and a new
  `@module-federation/dts-plugin` entry for `adm-zip` + `undici`. Remove them
  once @sanity/cli moves off the pinned versions. Alternative: no overrides, and
  the Security Audit workflow stays red with 11 CLI-only findings.
- **D3 Stage 1 shape:** its own PR, merged before the upgrade PR, or the first
  commit(s) of the upgrade PR. Either way the read-models land in
  `app/sanity/models/{event,year}.ts` (name open to change).
- **D4 Search:** accept the new default `groq2024` Studio search (results and
  ordering may shift slightly for Agnes), or pin
  `search: { strategy: 'groqLegacy' }`.
- **D5 Typegen config:** move `sanity-typegen.json` into `sanity.cli.ts`
  `typegen` now (4 keys), or leave the deprecation warning for later.
- **Out of scope (follow-ups):** regenerating stale `types.ts`/`schema.json`;
  @sanity/client 8 for the app's own client; React 19.3.

---

**Prerequisite:** `.env` copied into the worktree. Tasks 1–4 run Playwright, and
the dev server's env schema won't start without it.

**Local e2e sends real mail:** `walz/mise.toml` exports the production
`RESEND_API_KEY` into every worktree, and `tests/aufnahme-form.spec.ts` submits
the Anmeldeformular 3× per run. Until the branch contains the resend.dev fix
(`claude/anmeldeformular-spam-surge-21eba2`), run Playwright locally only with
`--grep-invert "Aufnahme Form"` or explicit spec files, and leave the full suite
to GitHub CI.

### Task 1: Failing e2e test — public pages must not load the Studio

**Files:**

- Create: `tests/studio-isolation.spec.ts`

**Step 1: Write the failing test**

The public routes that pull the schema files into the client today are listed in
finding 3. The test checks the root cause, in dev and in prod alike: no request
for the pre-bundled `sanity` dependency. It also checks the v6 symptom, no `sui`
cascade layer. `/studio` is the positive control that shows the detector works.

Implemented in `tests/studio-isolation.spec.ts`, covering 7 public paths: `/`,
`/aktuelles`, `/aktuelles/beitraege`, `/jahrgaenge`, `/alumni`, `/ueber-uns` and
`/ueber-uns/philosophie/bildung`. `/termine/:slug` is left out because it needs
live data. The `/studio` positive control is added in Task 4, once v6 ships
`sui` layers. On v5 the request assertion is the part that fails first.

**Step 2: Run it and confirm it fails for the right reason**

Run: `lsof -iTCP:4410 -sTCP:LISTEN` (must be empty), then
`PORT=4410 mise exec node@24 -- npx playwright test tests/studio-isolation.spec.ts`
Expected: FAIL. `sanityRequests` contains `…/.vite/deps/sanity.js…` for all 7
paths (confirmed on 2026-09-30, also from a cold dependency cache). If a path
passes, re-check it against finding 3 before continuing. The regex may need
adjusting to what the dev server actually serves, but only to match `sanity`
itself, never `@sanity/client` or `@sanity/image-url`, which public pages
legitimately use.

**Step 3:** No commit yet (red).

### Task 2: Move the read-models out of the Studio schema files

**Files:**

- Create: `app/sanity/models/event.ts` containing `AttachmentSchema`,
  `EventSchema` and `tType`, moved verbatim from
  `app/sanity/schema/event.tsx:5-73` (`MyTimeInput` stays).
- Create: `app/sanity/models/year.ts` containing `PhotoSchema`, `Photo`,
  `YearSchema`, `Year`, `GreekLetter`, `ALPHABET` and `alphabetMap`, moved
  verbatim from `app/sanity/schema/year.tsx:79-143`, with its `zod` and
  `PersonSchema` imports.
- Modify: `app/sanity/schema/event.tsx` and `app/sanity/schema/year.tsx`, to
  import what their `preview`/`options` still use (`tType`, `ALPHABET`,
  `alphabetMap`, `Year`) from `#app/sanity/models/…`.
- Modify: `app/sanity/schema/testimonial.ts:8`, to import `alphabetMap` from the
  model.
- Modify every route and util importer (list from
  `grep -rnE "schema/(event|year)" app tests`): `routes/_index/route.tsx:30-31`,
  `routes/aktuelles/route.tsx:29-30`, `routes/aktuelles/query.ts:3-4`,
  `routes/termine+/$slug.tsx:12`, `routes/die-walz-kennenlernen/route.tsx:7`,
  `routes/alumni/query.ts:3`, `routes/jahrgaenge+/_index.query.ts:3`,
  `routes/jahrgaenge+/$year.query.tsx:3`, `routes/jahrgaenge+/$year.tsx:18`,
  `utils/featured-photo.ts:1` and `utils/featured-photo.test.ts:2`.

Note: `tType(type: Event['type'])` resolves `Event` to the DOM `Event` type (so
`string`). Move it unchanged; flag it to Ferdinand instead of fixing it here.

**Step 1:** Move the code (cut/paste, no edits to the moved bodies). **Step 2:**
`grep -rlE "from ['\"]sanity['\"]" app` should list only `app/sanity/schema/*`,
`app/routes/studio.$.tsx` and `app/sanity/loader.server.ts`. The last is
type-only, and Task 3 removes it. **Step 3:** Run the Task 1 test. Expected:
PASS. **Step 4:** Run the verify gate. Then rerun the route-asset summary
(scratch script `route-assets.cjs`): only `routes/studio.$` may list the large
sanity chunks, and every public route's JS should drop by about 4.5 MB (about
1.4 MB gzipped). **Step 5:** Commit (unsigned only with Ferdinand's OK):
`Stop shipping Sanity Studio to public pages` + test file.

### Task 2b (added during execution): Crawl routes for dev dependencies

Done in `1877c64`. Moving the Studio packages behind `/studio` changed when Vite
discovers them. React Router passes Vite an empty `optimizeDeps.entries`, so the
dev server re-bundled dependencies mid-run, and `featured-photo` broke (two
React copies). It needed a retry on every local CI-mode run, while main ran
clean. That was a pre-existing problem: main's CI reports 2 flaky tests on every
run. `future.unstable_optimizeDeps: true` in `react-router.config.ts` bundles
once at startup. Measured results:

- no mid-run re-bundles, 0 flaky tests locally;
- the production build is unchanged, apart from the serialized flag in the
  server bundle;
- the isolation test still fails on all 7 pages if a read-model imports
  `sanity`.

### Task 3: Bump the sanity family with in-range companions and overrides

**Files:** Modify: `package.json`, `package-lock.json`,
`app/sanity/loader.server.ts`

**Step 1:** Edit `overrides` in `package.json`:

- Add `"smol-toml": "^1.7.1"` to `@vercel/frameworks`, next to `js-yaml`.
- Add
  `"@module-federation/dts-plugin": { "adm-zip": "^0.6.1", "undici": "^7.29.1" }`.
- Delete the `@sanity/uuid` entry, but only if D2 is accepted and Ferdinand
  agrees it is redundant.

**Step 2:** Install everything in one go:

```bash
mise exec node@24 -- npm install sanity@6.17.0 @sanity/vision@6.17.0 groq@6.17.0 \
  @sanity/orderable-document-list@2.0.25 @sanity/client@7.27.0 react@19.2.8 react-dom@19.2.8
```

Pinned versions keep caret specs in `package.json` and lock the tested versions.
The spike used `~19.2.8` for react; don't copy that.

**Step 3:** In `app/sanity/loader.server.ts`, remove
`import { type SanityClient } from 'sanity'` and the
`as unknown as SanityClient` cast. The spike confirmed typecheck passes. **Step
4:** Checks, in order. Each has an expected result:

- `npm audit` → `found 0 vulnerabilities`
- `npm ls sanity @sanity/vision groq @sanity/cli @sanity/runtime-cli adm-zip undici smol-toml @sanity/ui react-is styled-components`
  → sanity family 6.17.0, cli 8.13.0, runtime-cli 17.14.0, one adm-zip 0.6.1,
  one undici 7.30.0, no @sanity/ui 3.x
- `npm ls --all` and `npm ls --all --omit=dev` problem markers (invalid,
  missing, non-optional UNMET, extraneous), diffed against the baselines in
  scratch → nothing new
- Prod-only import check: copy `package.json`, the lockfile and `.npmrc` to
  scratch, run `npm ci --omit=dev --ignore-scripts`, then `node check.mjs` → all
  `ok`
- Verify gate, Task 1 e2e test and `tests/studio.spec.ts` → green

**Step 5:** Review the lockfile with
`git diff --diff-algorithm=histogram --stat`. Commit:
`Upgrade Sanity Studio to 6.17` (body: audit 5 → 0, what each override is for,
and when to drop it).

### Task 4: Pin down the v6 CSS behaviour in the e2e test

**Files:** Modify: `tests/studio-isolation.spec.ts`

**Step 1:** Add the positive control. `/studio` must contain `sui` layers, or
the negative assertion is meaningless. Use `test.slow()`, as `studio.spec.ts`
does:

```ts
test('/studio loads Sanity Studio styles (detector sanity check)', async ({
  page,
}) => {
  // the first Studio compile in dev is slow; test.slow() stretches the
  // test timeout but not the 5s expect timeout, so the poll needs its own
  test.slow()
  await page.goto('/studio')
  await expect
    .poll(() => sanityCascadeLayers(page), { timeout: 60_000 })
    .not.toEqual([])
})
```

**Step 2:** Run it: PASS on v6. Temporarily re-import `EventSchema` from the old
path in one route, confirm the public test fails, then revert. **Step 3:**
Commit: `Guard the public site against Studio styles`.

### Task 5 (only if D4 / D5 say so): config follow-through

- D4 = legacy: add `search: { strategy: 'groqLegacy' }` to `sanity.config.ts`.
- D5 = migrate: move `sanity-typegen.json` keys into `sanity.cli.ts` as
  `typegen: { path, schema, generates, overloadClientMethods }`, delete the
  JSON, update `docs/development.md`, `docs/architecture.md` and
  `docs/deployment.md` if they mention the file. Then run
  `npx sanity typegen generate`, confirm there's no deprecation warning, and
  discard the regenerated `types.ts` (staleness is out of scope).

### Task 6: Manual checks (Ferdinand, needs `.env` in the worktree)

Dev server on a free port (`lsof -iTCP:<port>` first; 3000 = OrbStack).
**Studio** (`http://localhost:<port>/studio`):

- Open and edit a Post, then discard.
- Erfahrungsberichte: drag ordering renders and works.
- Jahrgang: the "Hauptfoto" dropdown (custom input) lists photos.
- Ereignis: the time inputs (custom input) render.
- Vision: run `*[_type == "post"][0...3]`.
- Global search for a person's name (groq2024).

**Public pages vs production (walz.at):** `/`, `/aktuelles`, `/jahrgaenge`,
`/ueber-uns`, `/ueber-uns/philosophie/bildung`, `/alumni`, one
`/termine/<slug>`. Check spacing, background, and form controls/scrollbars, with
the OS in both light and dark appearance (the leaked reset sets
`color-scheme: light dark`). The pages should look identical to production.

### Task 7: Finish

Run the full Playwright suite on the free port, then push and open the PR. The
PR body lists the audit numbers, the override rationale and the manual checks.
Update memory: override removal conditions and the "read-models live in
`app/sanity/models`" rule.
