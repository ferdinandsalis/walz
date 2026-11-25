# Curriculum als Reise – Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild /curriculum as described in the spec. The page opens with a
map and the "Weg zur Matura" strip. After that, each year shows a big orange
numeral and an open, gap-free photo mosaic.

**Architecture:** The computing parts are pure functions with Vitest tests in
`app/routes/curriculum/`:

- `curriculum.ts`: exams, lead sentence, photo ratio.
- `mosaic.ts`: explicit grid placement for 4 and 2 columns.

Three presentational components sit beside them:

- the map,
- the exam strip,
- one year.

The route composes them, and a Playwright spec checks the page.

**Tech Stack:** React Router 7, Tailwind 4, Sanity (`urlFor`), Vitest,
Playwright.

**Spec:** `docs/superpowers/specs/2026-11-24-curriculum-reise-design.md`.

Visual reference: the throwaway `app/routes/curriculum-spike.tsx`, view `?v=f`.
It is untracked, so never `git add` it and never copy it wholesale.

## Global Constraints

- **Branch and PR:** work on branch `curriculum-reise`, which is based on
  `origin/main`. Open a PR when done, but do **not** merge it: Agnes has to see
  the two new texts first.
- **New texts:** there are exactly two, each defined once as a constant in
  `route.tsx`:
  - `"Fünf Jahre Walz – von Wien in die Welt und zur Matura"`
  - `"Keine – ein Jahr Time-out vom Prüfungsstress"`
- **Year texts:** these stay word for word as they are in Sanity. No schema or
  Studio changes.
- **Colours:** no darker shades of the brand colours; the -700/-800 tokens no
  longer exist.
  - A second fill of the same colour uses `pattern-dots` or `pattern-stripes`.
  - Text on a brand fill is dark.
  - Tints are only for surfaces.
- **Orange:** allowed for the map heading, the five strip numerals, each year's
  big numeral, the Matura chip and the map's arcs and dots. Everything else is
  dark.
- **Commits:** no "Claude" in commit messages and no Co-Authored-By trailer.
- **Commands:** run them with `mise exec node@24 --`.
- **Dev server:** on port 4477 (`PORT=4477 npm run dev`). Tailwind picks up
  classes from a _new_ file only after the dev server restarts.
- **Local e2e:** mail-free only:
  `npx playwright test --grep-invert "Aufnahme Form"`.

## Review Focus

1. **A year with zero photo projects.** The page must not crash, and the opening
   corner still shows. `mosaicLayout([])` returns the corner and no tiles (Task
   2 test).
2. **Empty or missing values from Sanity.** This covers `externalExams: null`
   (year 1 today), `"keine"`, `""`, and a `photos` entry without an `asset`.
   They count as no exam and no photo (Task 1 tests).
3. **A description with no sentence end, or just one sentence.** The lead is the
   whole text and the rest is empty, so no empty paragraph is rendered (Task 1
   test).
4. **Sideways overflow at 390px.** This includes long names like
   "Sprachpraktikum Spanisch/Französich" and the "+N Fotos" chip. No box may
   pass the right edge (Task 6 e2e, using `boxesPastTheRightEdge` from
   `tests/aufnahme-helpers.ts`).
5. **The total of 0 exams.** The strip must not divide by zero; the bars are
   empty (Task 1 test on `examProgress`).

---

### Task 1: Curriculum data helpers

**Files:**

- Create: `app/routes/curriculum/curriculum.ts`
- Test: `app/routes/curriculum/curriculum.test.ts`

**Interfaces:**

- Produces:
  - `realExams(exams: string[] | null | undefined): string[]`: drops null, `""`
    and `"keine"` (case-insensitive, trimmed).
  - `examProgress(counts: number[]): { before: number; current: number }[]`:
    fractions from 0 to 1 of the total. `before` is the share of all earlier
    years, and `current` is this year's share. With a total of 0, every value
    is 0.
  - `splitLead(text: string): { lead: string; rest: string }`: the first
    sentence (up to and including the first `.`, `!` or `?` followed by
    whitespace) and the trimmed rest.
  - `photoRatio(photo: { asset?: { _ref?: string } } | null | undefined): number`:
    width/height parsed from `-WxH-` in the asset ref, or 1 if it is missing.
  - `photosOf(project: { photos?: unknown[] | null }): SanityPhoto[]`: only the
    entries that have an `asset`. Export
    `type SanityPhoto = { _key?: string; asset: { _ref: string }; caption?: string }`.

- [ ] **Step 1: Write the failing tests.** Use the `describe.concurrent`/`it`
      style of `app/utils/years.test.ts`. Assertions:
  - `realExams(null)` → `[]`
  - `realExams(['keine'])` → `[]`
  - `realExams(['Englisch', '', ' Keine ', 'Matura'])` →
    `['Englisch', 'Matura']`
  - `examProgress([0, 5, 4, 5, 3])`: the total is 17; `[1]` →
    `{ before: 0, current: 5/17 }`; `[4]` → `{ before: 14/17, current: 3/17 }`
  - `examProgress([0, 0])` →
    `[{ before: 0, current: 0 }, { before: 0, current: 0 }]`
  - `splitLead('Gute Nachrichten für alle! Die Walz beginnt.')` →
    `{ lead: 'Gute Nachrichten für alle!', rest: 'Die Walz beginnt.' }`
  - `splitLead('Ohne Punkt')` → `{ lead: 'Ohne Punkt', rest: '' }`
  - `splitLead('Ein Satz.')` → `{ lead: 'Ein Satz.', rest: '' }`
  - `photoRatio({ asset: { _ref: 'image-abc-1200x900-jpg' } })` → `1200/900`
  - `photoRatio(null)` → `1`
  - `photosOf({ photos: [{ asset: { _ref: 'image-a-10x10-jpg' } }, {}, null] })`
    has a length of 1
  - `photosOf({ photos: null })` → `[]`
- [ ] **Step 2: Run**
      `mise exec node@24 -- npx vitest run app/routes/curriculum`. Expected:
      FAIL (the module is missing).
- [ ] **Step 3: Implement** the five functions in `curriculum.ts`.
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit**:
      `Curriculum: Prüfungen zählen, Einleitungssatz und Fotoformat`.

### Task 2: Gap-free mosaic layout

**Files:**

- Create: `app/routes/curriculum/mosaic.ts`
- Test: `app/routes/curriculum/mosaic.test.ts`

**Interfaces:**

- Consumes: nothing. Callers pass the first photo's ratio of each photo project,
  in Sanity order.
- Produces:
  - `type GridArea = { row: number; col: number; rowSpan: number; colSpan: number }`.
    `row` and `col` are 1-based grid lines.
  - `mosaicLayout(ratios: number[], options: { columns: 2 | 4; corner: 'left' | 'right' }): { corner: GridArea; tiles: GridArea[] }`.
    `tiles[i]` belongs to `ratios[i]`.
  - `gridArea(area: GridArea): string`: returns
    `"row / col / span rowSpan / span colSpan"`, for a CSS `grid-area`.

**Algorithm.** The signature and tests don't settle this on their own, and the
spec fixes it. The precedence below is Bot's call, written into the spec.

1. The corner is 2×2 at row 1. Its column is 1, except with 4 columns and
   `corner: 'right'`, where it is 3. With 2 columns, `corner` is ignored.
2. Size each tile:
   - index 0 → 2×2 (feature);
   - otherwise, ratio < 0.95 → 2 rows × 1 col (tall);
   - otherwise, index % 5 === 3 → 1 × 2 (wide);
   - otherwise 1 × 1.
3. Place the tiles in order, each at the first free (row, col) in row-major
   order where it fits. This is CSS `grid-flow-dense`, simulated.
4. A _hole_ is an empty cell in any row above the last occupied row. If there
   are holes, retry with these candidates in order, and stop at the first one
   without holes:
   1. all wide tiles become 1×1;
   2. then turn tall tiles into 1×1 one at a time, starting from the last tall
      tile, keeping earlier changes.

   The feature tile never changes. All 1×1 is always hole-free, so this ends.

5. With zero ratios, return the corner and `tiles: []`, with no hole check.

- [ ] **Step 1: Write the failing tests.**
  - Add a test-local helper `holes(layout, columns)`. It lists the empty cells
    in rows above the last occupied row. Assert that it is `[]` for every case
    below.
  - Add a second helper. It checks that no two areas overlap and that every
    `col + colSpan - 1 <= columns`.
  - Test the five real years: the first photo's ratio of each photo project,
    from Sanity on 2026-11-24.

    ```ts
    const years = {
      1: [1.5, 1.33, 1.52, 1.5, 0.75, 1.33, 0.67],
      2: [1.5, 1.33, 0.75, 1.78, 1.33, 1.33, 0.75],
      3: [1.33, 1.5, 0.75],
      4: [0.75, 2.12, 1.33, 0.67, 0.75],
      5: [1.33],
    }
    ```

    Run each year with 4 columns (corner `left` for odd years, `right` for even)
    and with 2 columns. Assert that there are no holes, no overlaps, and
    `tiles.length === ratios.length`.

  - Exact expectations, worked out with the algorithm above:
    - year 2, 4 columns, `right`:
      - corner `{row:1,col:3,rowSpan:2,colSpan:2}`;
      - tiles[0] `{row:1,col:1,rowSpan:2,colSpan:2}`;
      - tiles[6] (Sprachpraktikum, tall) `{row:4,col:4,rowSpan:2,colSpan:1}`. It
        is the one tile in the last row, sticking out.
    - year 1, 4 columns, `left`:
      - corner col 1;
      - tiles[4] (Skills) stays tall `{row:3,col:4,rowSpan:2,colSpan:1}`;
      - tiles[6] (Straßentheater) becomes 1×1.
    - year 5, 4 columns, `right`: tiles[0] `{row:1,col:1,rowSpan:2,colSpan:2}`,
      which fills the free half beside the corner.
    - 2 columns, any year: corner `{row:1,col:1,rowSpan:2,colSpan:2}` and
      tiles[0] at row 3.
    - `mosaicLayout([], {columns:4, corner:'left'})` → `tiles: []`.
    - `gridArea({row:3,col:2,rowSpan:2,colSpan:1})` →
      `'3 / 2 / span 2 / span 1'`.

- [ ] **Step 2: Run**
      `mise exec node@24 -- npx vitest run app/routes/curriculum/mosaic`.
      Expected: FAIL.
- [ ] **Step 3: Implement** `mosaicLayout` and `gridArea` in `mosaic.ts`.
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit**:
      `Curriculum: Fotomosaik ohne Löcher für vier und zwei Spalten`.

### Task 3: Map and the "Weg zur Matura" strip

**Files:**

- Create: `app/routes/curriculum/europe-map.tsx`
- Create: `app/routes/curriculum/exam-path.tsx`

**Interfaces:**

- Consumes: `realExams` and `examProgress` from Task 1.
- Produces:
  - `EuropeMap(): JSX.Element`.
  - `ExamPath({ years }: { years: { _id: string; title: string; externalExams: string[] | null }[] }): JSX.Element`.

These are presentational. The page's e2e test (Task 6) covers them.

- [ ] **Step 1: Build `EuropeMap`.** Port it from `EuropeMap` in the spike,
      including:
  - the `places` list with its offsets;
  - the projection `x = ((lon + 12) / 32) * 800` and
    `y = ((56 - lat) / 14) * 460`;
  - the dot grid, the dashed quadratic arcs from Wien, and the labels "N. Jahr".

  Keep `role="img"` and a `<title>`. Give the `<pattern>` a `useId()`-based id,
  so the id stays unique.

- [ ] **Step 2: Build `ExamPath`.**
  - Above the tiles, a line: `"Der Weg zur Matura · {total} externe Prüfungen"`.
  - Below it, an `<ol>` of five links to `#jahr-{n}`. Each holds:
    - the orange numeral;
    - the title, dark;
    - the bar: a `bg-secondary-50` track; the `before` segment is
      `bg-secondary pattern-dots`, and the `current` segment `bg-secondary`.
      Widths come from `examProgress`, in percent.
    - the label `"+{n} Prüfungen"`, or `"keine Prüfungen"` for 0.
  - Layout: one column on phones, five from `sm`.
- [ ] **Step 3: Run**
      `mise exec node@24 -- npm run typecheck && mise exec node@24 -- npm run lint`.
      Expected: clean.
- [ ] **Step 4: Commit**: `Curriculum: Karte der Reisen und Weg zur Matura`.

### Task 4: One year

**Files:**

- Create: `app/routes/curriculum/year-section.tsx`

**Interfaces:**

- Consumes:
  - `splitLead`, `realExams`, `photosOf` and `photoRatio` (Task 1);
  - `mosaicLayout` and `gridArea` (Task 2);
  - `PhotoLightbox` from `#app/components/photo-lightbox.tsx`, with props
    `photos`, `open`, `onOpenChange` and `startIndex`;
  - `urlFor` from `#app/sanity/instance.ts`.
- Produces:
  `YearSection({ year, n, noExamsText }: { year: CurriculumQueryResult['years'][number]; n: number; noExamsText: string }): JSX.Element`.

- [ ] **Step 1: Build the section.**
  - `<section id="jahr-{n}" class="scroll-mt-8">`, holding an `<h2>` with "{n}.
    Jahr" and the title.
  - **Mosaic:** a
    `<ul class="grid grid-cols-2 lg:grid-cols-4 auto-rows-[8.5rem] sm:auto-rows-[10.5rem] gap-1.5">`.
    - Call `mosaicLayout` twice, with `{columns: 2}` and with
      `{columns: 4, corner: n % 2 ? 'left' : 'right'}`.
    - Set each item's style to
      `{'--area': gridArea(narrow), '--area-lg': gridArea(wide)}`, with the
      classes `[grid-area:var(--area)] lg:[grid-area:var(--area-lg)]`.
  - **Corner item:** the numeral (`aria-hidden`, orange,
    `text-[6.5rem]/[0.75] sm:text-[9rem]/[0.75]`), the h2 and the lead in dark
    bold. Use `min-w-0` where the spike needed it.
  - **Tile:** a `<button>` holding:
    - the first photo, sized by the tile's spans
      (`urlFor(...).width().height().fit('crop').auto('format')`); roughly 300px
      per column and row is enough;
    - the project name, white on a gradient;
    - a chip `"+{k} Foto"` or `"+{k} Fotos"` when there is more than one photo.

    Clicking it opens `PhotoLightbox` over all photos of the year, at that
    project's first photo. Captions read `"{name}, {caption}"`, or just
    `"{name}"`.

  - **Long names:** use a smaller size for names longer than 20 characters,
    instead of hyphenating them (spec: "kleinere Schrift für lange Namen").
  - **Below the mosaic:** two columns from `md`.
    - Left: `rest`, only if it isn't empty.
    - Right: "Außerdem in diesem Jahr" (photo-less project names joined with
      `" · "`), only if there are any.
    - Right, then: "Externe Prüfungen" as filled chips. They are `bg-secondary`,
      and `bg-primary` for the exam `"Matura"`; the text is dark. With no exams,
      show one chip `bg-primary-100` holding `noExamsText`.

- [ ] **Step 2: Run** typecheck and lint. Expected: clean.
- [ ] **Step 3: Commit**: `Curriculum: Jahr mit offenem Fotomosaik`.

### Task 5: Route and colour rule

**Files:**

- Modify: `app/routes/curriculum/route.tsx`, replacing the body; `PhotoStrip`,
  `Divider` and the lists go.
- Modify: `app/styles/app.css`, in the colour comment, at the "Orange is
  rationed" bullet.

**Interfaces:**

- Consumes: `EuropeMap`, `ExamPath` (Task 3) and `YearSection` (Task 4).
- Produces: the page that Task 6 tests.

- [ ] **Step 1: Compose the page.**
  - Keep the loader, `handle` and `meta`.
  - Define
    `const journeyHeading = 'Fünf Jahre Walz – von Wien in die Welt und zur Matura'`
    and `const noExamsText = 'Keine – ein Jahr Time-out vom Prüfungsstress'`.
  - Render, in order:
    1. `<PageTitle />`;
    2. `<h2>` journeyHeading (`font-condensed text-primary`, large);
    3. `<EuropeMap />`;
    4. `<ExamPath years={data.years} />`;
    5. `data.years.map((y, i) => <YearSection key={y._id} year={y} n={i + 1} noExamsText={noExamsText} />)`.

    Space them with `space-y-24`, inside the existing
    `relative grid grid-cols-subgrid … lg:col-span-2` wrapper.

- [ ] **Step 2: Extend the colour comment.** Under the "Orange is rationed"
      bullet, add:
      `"Exception: the big year numerals that lead through the Walz (Curriculum) may be orange, as may that page's opening heading."`
- [ ] **Step 3: Restart the dev server.** New files carry new classes, so open
      `/curriculum` at 1280 and 390 and compare with the spike's `?v=f`. Take
      before and after screenshots.
- [ ] **Step 4: Run** typecheck, lint and `npm test -- --run`. Expected: all
      green.
- [ ] **Step 5: Commit**: `Curriculum: Seite als Reise durch fünf Jahre`.

### Task 6: E2E

**Files:**

- Create: `tests/curriculum.spec.ts`

**Interfaces:**

- Consumes: `boxesPastTheRightEdge` from `tests/aufnahme-helpers.ts`.

- [ ] **Step 1: Write the tests.**
  - "shows five years with their numerals":
    - `#jahr-1` through `#jahr-5` exist;
    - `#jahr-1` contains "Timeout und Ausprobieren";
    - `#jahr-5` has a chip with "Matura".
  - "counts the exams on the way to the Matura":
    - the page contains "17 externe Prüfungen";
    - year 1 shows `"Keine – ein Jahr Time-out vom Prüfungsstress"`.
  - "jumps from the strip to the year": clicking the strip's link 3 changes the
    URL hash to `#jahr-3`, and `#jahr-3` is in the viewport.
  - "opens the photos of a project":
    - clicking the button named /Forst/ opens a dialog;
    - the dialog shows a caption starting with "Forst";
    - Escape closes it.
  - "leaves no gaps in a mosaic" at 1280. For each `#jahr-N ul`, read the
    computed `grid-row-start`/`grid-column-start`/spans of its `li`. Assert that
    every cell above the last row is covered. Inline a small evaluator.
  - "fits a phone screen" at `{ width: 390, height: 900 }`:
    `boxesPastTheRightEdge(page)` → `[]`.
- [ ] **Step 2: Run**
      `mise exec node@24 -- env PORT=4477 npx playwright test tests/curriculum.spec.ts`.
      Expected: PASS.
- [ ] **Step 3: Run the full mail-free suite**:
      `mise exec node@24 -- env PORT=4477 npx playwright test --grep-invert "Aufnahme Form"`.
      Expected: all pass, with clean output.
- [ ] **Step 4: Commit**: `Curriculum: E2E-Tests für die neue Seite`.

### Task 7: PR, held for Agnes

- [ ] **Step 1:** Push `curriculum-reise` and open a PR, with:
  - desktop and phone screenshots;
  - the two new texts quoted;
  - a note that it waits for Agnes.
- [ ] **Step 2:** Check CI once with the ccd PR status. Do **not** merge.
