# Aufnahme-Kapitel mit Bild: Implementation Plan

> Execution: native, in this session (Ferdinand: "Passt, umsetzen").

**Goal:** Voraussetzungen, Kosten und Stipendien auf /aufnahme open with a photo
carrying their title. The page also gets fact tiles, key figures and an alumni
quote.

**Architecture:** Everything lives in `app/routes/aufnahme+/_index.tsx`. That
file holds a `ChapterOpener`, a `FactTile` and a `TestimonialQuote`. The query
`_index.query.ts` additionally loads the first testimonial.

**Spec:** `docs/superpowers/specs/2026-11-21-aufnahme-kapitel-design.md`

## Global Constraints

- The body text is not reworded, and there is no yearly sum.
- Locally, run only mail-free e2e tests. The submitting aufnahme-form tests must
  not run.
- Run tools with `mise exec node@24 --` and use the dev server on port 4455.

## Review Focus

- **No testimonial in Sanity:** the quote block is omitted and the page does not
  crash. Zod marks the testimonial optional/nullable.
- **Testimonial year without `graduatedAt`:** the Maturajahr is omitted.
- **320 px:** nothing overflows. The existing loop in `lernpfad.spec.ts` covers
  this.
- **Anchors `#voraussetzungen` etc.:** they stay on the article. `toc.spec`
  covers this.
- **Weight of `walz_paint.jpg`:** it must be ≤ ~400 KB after shrinking.

### Task 1: Tests first

**Files:** create `tests/aufnahme.spec.ts`, modify
`tests/lernpfad.spec.ts:142-146`.

- [ ] Write the tests in `aufnahme.spec.ts`:
  - `opens each section with a photo under its title`: for Voraussetzungen,
    Kosten und Finanzierung and Stipendien, `#<id> figure img` has a non-empty
    `alt`, and the `h1` is visible.
  - `shows the facts as tiles in Voraussetzungen`: `#voraussetzungen` contains
    the texts `9.`, `9.–11.` and `Restplätze`. The link `agnes.chorherr@walz.at`
    exists, and `Plätze frei` occurs 0 times.
  - `shows the key figures on costs`: `#kosten` contains `über 90 %` and
    `€ 15.729` as separate figures (`[data-figure]`, count 2).
  - `lets a graduate speak before the scholarships`: one `figure blockquote`
    sits between `#kosten` and `#stipendien`, and its `figcaption` contains
    `Maturajahr`.
- [ ] In lernpfad, replace the `Plätze frei` notice check with:
      `#voraussetzungen` has exactly one `.bg-secondary-50`, which is the notice
      in step 1. Correction: that notice sits in `#vorgehensweise`, so the rule
      becomes "`.bg-secondary-50` occurs once on the page".
- [ ] Run the tests: they FAIL.

### Task 2: Query

- [ ] Add
      `"testimonial": *[_type=="testimonial"]|order(orderRank)[0]{name, quote, year->{letter, graduatedAt}}`
      to `aufnahmeQuery`.
- [ ] Extend the zod schema: `testimonial` is optional and nullable,
      `graduatedAt` is nullable and coerced to a date.

### Task 3: Markup

- [ ] Add `ChapterOpener({ id?, title, image, alt, position? })`. It renders a
      `figure` with an `img` and the `h1` in the tab. It replaces the
      free-standing `h1` of the three articles.
- [ ] Add three `FactTile`s and remove `LateralEntryBox`.
- [ ] Add a figures row in Kosten (`data-figure`).
- [ ] Make the amounts in the cost list orange and `text-h4`.
- [ ] Add `TestimonialQuote` between Kosten and Stipendien.
- [ ] Run the tests: they PASS.

### Task 4: Assets and cleanup

- [ ] Shrink `walz_paint.jpg`: `sips -Z 1600` and quality ~80.
- [ ] Delete `public/__mockup`.

### Task 5: Verification and PR

- [ ] Run `aufnahme.spec`, `lernpfad.spec` and `toc.spec` against port 4455.
- [ ] Run Vitest, typecheck and lint.
- [ ] Take screenshots at 1440 and 375.
- [ ] Commit, push, open the PR. Squash with an explicit message and no Claude
      attribution.
