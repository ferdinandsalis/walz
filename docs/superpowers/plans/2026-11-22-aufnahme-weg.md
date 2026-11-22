# Aufnahme: der Weg durchs Jahr – Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** /aufnahme gets visual structure from its own content. The Lernpfad
gets dates, the quote moves early, the five years appear as a grid, and the fees
appear as a bar with an accordion.

**Architecture:** All page changes are in `app/routes/aufnahme+/_index.tsx`. A
new pure module `app/utils/fees.ts` computes the yearly values from the Sanity
cost list. `PathNode` gets one new state, `current`.

**Tech Stack:** React Router v7, Tailwind 4, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-22-aufnahme-weg-design.md`. The
throwaway sketch, section `#B` and class `road-v`, is at
`…/scratchpad/skizzen/index.html` in this session.

## Global Constraints

- Work on branch `claude/aufnahme-kapitel` (#162). Do not merge.
- Do not change any existing prose. The only new copy is listed below:
  - Time labels: „Jetzt“, „ab Mitte November“, „am Aufnahmetermin“, „ab Jänner“.
  - The grid heading: „Fünf Walzjahre · wo du einsteigen kannst“.
  - The box texts: „Einstieg in die Walz“, „Restplätze Delta 2“, „Restplätze
    Gamma 3“, „Matura“.
  - The legend: „Einstieg“, „Quereinstieg möglich“, „gerade Plätze frei“.
  - The lead line: „Was ein Walzjahr für die Eltern kostet:“.
  - The column heads: „Betrag“, „wie oft“, „im Jahr“.
  - The rows: „Summe im Jahr“ and „einmalig“.
- Use only existing colours and fonts: `primary`, `primary-50/100/200/800`,
  `secondary`, `secondary-50/200/800` and `font-condensed`. No full-width colour
  blocks.
- Fee descriptions come word for word from Sanity. E2E tests do not assert
  Sanity amounts.
- Locally, run only mail-free e2e tests. Never run
  `tests/aufnahme-form.spec.ts`. Use `mise exec node@24 --`, the dev server on
  port 4455, and `npx playwright test <files> --reporter=line --workers=1` with
  `PORT=4455`.
- Commits have no Claude attribution, as the project CLAUDE.md requires.

## Review Focus

- **A cost without a description in Sanity.** Its row shows plainly, with no
  toggle and no empty panel. This is pinned in Task 4, step 1.
- **No current school year (`currentSchoolYear` null).** The fee block is absent
  as it is today, and the page does not crash. This is pinned in Task 1:
  `annualFees([])` gives total 0. In Task 4 the block renders only when
  `current` exists.
- **Only one-off costs, so total is 0.** There is no bar and no sum row, and no
  division by zero in the segment widths. This is pinned in Task 1.
- **A long Sanity title at 320px.** The row wraps and nothing scrolls sideways.
  The existing lernpfad 320px test covers `/aufnahme`; Task 4 re-runs it after
  opening every row.
- **Keyboard.** Each fee row opens with Enter or Space and shows the focus
  outline. This is pinned in Task 4.

---

### Task 1: Fee arithmetic

**Files:**

- Create: `app/utils/fees.ts`, `app/utils/fees.test.ts`

**Interfaces:**

- Produces:

  ```ts
  type Cost = {
    title: string
    quantity: number
    cost: number
    interval: string
    description?: string
  }
  type RecurringFee = Cost & { perYear: number; share: number }
  export function annualFees(list: Cost[]): {
    recurring: RecurringFee[]
    once: Cost[]
    total: number
  }
  export const SEGMENT_LABEL_MIN_SHARE = 0.15
  ```

  - `perYear` is `cost × quantity` for every interval except `'ONCE'`.
  - `share` is `perYear / total`, or 0 when total is 0.
  - The order is kept as in Sanity.

- [ ] **Step 1: Write the failing tests** in `app/utils/fees.test.ts`:
  - Test `adds up a year of fees and keeps one-off fees apart`. Input: today's
    five Sanity items:
    - Aufnahmebeitrag 2600 ×1 ONCE
    - Schulgeld 765 ×12 MONTHLY
    - Projektbeitrag 931 ×4 QUARTERLY
    - Sport, Bewegung, Werkstätte 79 ×10 MONTHLY
    - Essen 141 ×10 MONTHLY

    Expect:
    - `total` is 15104;
    - `recurring.map(f => [f.title, f.perYear])` equals
      `[['Schulgeld',9180],['Projektbeitrag',3724],['Sport, Bewegung, Werkstätte',790],['Essen',1410]]`;
    - `once.map(f => f.title)` equals `['Aufnahmebeitrag']`;
    - Schulgeld `share` is close to `9180/15104`.

  - Test `has nothing to add up without recurring fees`. For `[]` and for only
    ONCE items, expect `total` 0, `recurring` `[]`, and every `share` 0.

- [ ] **Step 2:** Run
      `mise exec node@24 -- npx vitest run app/utils/fees.test.ts`. It should
      FAIL with "Cannot find module".
- [ ] **Step 3:** Implement `annualFees` and `SEGMENT_LABEL_MIN_SHARE`.
- [ ] **Step 4:** Run it again. It should PASS.
- [ ] **Step 5:** Commit with the message „Aufnahme: Jahresbeträge der Beiträge
      aus den Sanity-Daten“.

### Task 2: Lernpfad with dates and the quote moved early

**Files:**

- Modify: `app/components/ui/path.tsx` (`PathNodeState` and `nodeStateStyles`)
- Modify: `app/routes/aufnahme+/_index.tsx`:
  - `AdmissionSteps`, at about line 278;
  - the move of the `TestimonialQuote` render, from the end of `#kosten` to the
    end of `#vorgehensweise`.
- Test: `tests/lernpfad.spec.ts`, `tests/aufnahme.spec.ts`

**Interfaces:**

- Produces: `PathNodeState` includes `'current'`. `current` renders like `done`
  (filled `path-done`, white) but shows the number, plus `ring-primary-100`
  instead of the gap ring.

- [ ] **Step 1: Write the failing tests.**
  - In `lernpfad.spec.ts`, add `dates each admission step on /aufnahme`. Inside
    the `Aufnahmeprozess` list, the elements `[data-step-when]` have the texts
    `['Jetzt','ab Mitte November','am Aufnahmetermin','ab Jänner']`. Each one
    comes before its `h2` in the DOM. The first `[data-node-state]` is `current`
    and the other three are `open`.
  - In `aufnahme.spec.ts`, rename
    `lets a graduate speak before the scholarships` to
    `lets a graduate speak right after the steps`. The quote follows
    `#vorgehensweise`'s list and precedes `#voraussetzungen`. The
    `compareDocumentPosition` checks become the list and `#voraussetzungen`.
- [ ] **Step 2: Run both specs.** The new and the renamed test should FAIL.
- [ ] **Step 3: Implement.**
  - Put `admissionStepWhen: Record<string, string>` next to
    `admissionStepTexts`.
  - Render
    `<p data-step-when className="text-primary text-body-xs font-bold tracking-widest uppercase">`
    above each `h2`.
  - `PathNode state={index === 0 ? 'current' : 'open'}`. Check that the node
    still centres on the title line (`lh`) and not on the label. If it does not,
    put the label in the `li` before `PathMarker`'s reference line. The 1160px
    alignment test in `lernpfad.spec` must stay green.
  - Move the `TestimonialQuote` JSX. Its style is unchanged.
- [ ] **Step 4: Run `lernpfad.spec.ts` and `aufnahme.spec.ts`.** They should
      PASS, including the 320px test and the 1160 hanging-rail test.
- [ ] **Step 5:** Commit with the message „Aufnahme: Lernpfad mit Zeitangaben,
      Zitat gleich nach den Schritten“.

### Task 3: Grid of the five years

**Files:**

- Modify: `app/routes/aufnahme+/_index.tsx`. Replace `admissionFacts` and the
  `FigureRow` inside `AdmissionFacts` with `SchoolYearGrid`. The Agnes line
  stays. `FigureRow` and `keyFigures` stay for `#kosten`.
- Test: `tests/aufnahme.spec.ts`

**Interfaces:**

- Produces: `function SchoolYearGrid()`. It is a heading `p` plus
  `<ol aria-label="Fünf Walzjahre">` with 5 `li[data-year]` items, followed by
  the legend.
  - Each `li` has `data-year-kind` set to `entry`, `side`, `side free`, `plain`
    or `plain`.
  - The classes match the sketch: `entry` is `bg-primary text-white`; `side` is
    `bg-primary-50 border-primary-200`; `free` adds
    `ring-3 ring-inset ring-secondary`.

- [ ] **Step 1: Rewrite the test.**
  - Rename `shows the facts as a row of figures in Voraussetzungen` to
    `shows where to join among the five years`.
  - `#voraussetzungen [data-year]` has count 5, with texts containing
    `9.`/`Einstieg in die Walz`, `10.`/`Restplätze Delta 2`,
    `11.`/`Restplätze Gamma 3`, `12.` and `13.`/`Matura`.
  - The legend shows the three entries.
  - The Agnes link is visible and outside the list.
  - `Plätze frei` exact has count 0.
  - In `fits the figures into the column`, change the count from 6 to 3, since
    only the key figures remain.
  - Add a check at 375px: no `[data-year]` overflows
    (`scrollWidth > clientWidth` is false).
- [ ] **Step 2: Run `aufnahme.spec.ts`.** It should FAIL.
- [ ] **Step 3: Implement `SchoolYearGrid`.**
  - Use `grid grid-cols-5 gap-1.5`.
  - The figures are `font-condensed font-black text-2xl sm:text-4xl`, the labels
    `text-body-xs`.
  - Remove the now unused `admissionFacts` and the `current` flag on `Figure` if
    nothing else uses it.
- [ ] **Step 4: Run it again.** It should PASS.
- [ ] **Step 5:** Commit with the message „Aufnahme: die fünf Walzjahre als
      Raster, wo man einsteigen kann“.

### Task 4: Fees as a bar and an accordion

**Files:**

- Modify: `app/routes/aufnahme+/_index.tsx`. Replace the `<dl>` of
  `current.costs.list` with `FeeOverview`.
- Test: `tests/aufnahme.spec.ts`

**Interfaces:**

- Consumes: `annualFees` and `SEGMENT_LABEL_MIN_SHARE` from Task 1.
- Produces: `function FeeOverview({ list }: { list: Cost[] })`.
  - It renders the lead line, then a bar, then the rows.
  - The bar is `div[aria-hidden]` with one `flex-grow: perYear` segment per
    recurring fee. A segment shows the `de-AT` EUR amount only when
    `share ≥ SEGMENT_LABEL_MIN_SHARE`.
  - The rows are a header row, then one `details[data-fee]` per recurring fee,
    then `[data-fee-sum]` „Summe im Jahr“ with the total, then one
    `details[data-fee-once]` per one-off fee.
  - Each row's swatch colour is `FEE_COLOURS[i % FEE_COLOURS.length]`, with
    `FEE_COLOURS = ['bg-primary','bg-primary-800','bg-secondary','bg-secondary-800']`.
  - A fee without a description renders as a `div` with the same grid instead of
    `details`.
  - When total is 0, there is no bar and no sum row.
  - Use the existing `Intl.NumberFormat` options for amounts and pull them into
    one `formatEuro`.
  - The phone layout is title plus „im Jahr“ in the row, with amount and „wie
    oft“ under the title. From `sm`, all four columns show.

- [ ] **Step 1: Write the failing tests** in `aufnahme.spec.ts`:
  - `adds up the fees of a year`. There are at least one `[data-fee]` and one
    `[data-fee-once]`. Parse the „im Jahr“ cells (`[data-per-year]`) of
    `[data-fee]` and the `[data-fee-sum]` amount with
    `Number(text.replace(/\D/g,''))`. The sum equals the sum of the rows.
  - `opens a fee for its full description`. Each `[data-fee]` and
    `[data-fee-once]` that has a `summary` starts closed. Clicking the first one
    shows a description longer than 20 characters. Pressing Enter on the second
    one's focused summary opens it too.
  - `keeps the page from scrolling sideways with every fee open at 320px`. At
    width 320, set `open` on all `details`, then expect
    `document.documentElement.scrollWidth` ≤ 320.
- [ ] **Step 2: Run `aufnahme.spec.ts`.** It should FAIL.
- [ ] **Step 3: Implement `FeeOverview`.** The visual reference is the sketch's
      `.stack` and `.acc`. The `summary` shows the focus outline via the site's
      existing `focus-visible` ring classes, and the `+`/`–` sign is
      `aria-hidden`.
- [ ] **Step 4: Run `aufnahme.spec.ts`, `lernpfad.spec.ts` and `toc.spec.ts`.**
      All should PASS.
- [ ] **Step 5:** Commit with the message „Aufnahme: Beiträge als Balken und
      Tabelle zum Aufklappen“.

### Task 5: Verification and PR

- [ ] **Run the full local suite.** Run Vitest, `npm run typecheck`,
      `npm run lint`, and all mail-free e2e specs (every spec except
      `aufnahme-form.spec.ts`). All must be green with clean output.
- [ ] **Take screenshots.** Take before and after screenshots of the whole of
      `/aufnahme` at 375, 896, 1160 and 1440, with images decoded. Send them to
      Ferdinand.
- [ ] **Update the docs.** Add a line to the `#162` design doc
      (`2026-11-21-aufnahme-kapitel-design.md`, „Nach der Review-Runde“) that
      points to this spec, and to the PR body. No Claude attribution.
- [ ] **Push and wait for CI on #162.** Do not merge.
