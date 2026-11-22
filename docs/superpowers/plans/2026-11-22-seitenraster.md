# Seitenraster: rechte Spalte gedeckelt – Implementation Plan

> Execution: native, in this session (Ferdinand: "Passt, umsetzen").

**Goal:** Just after `lg` and `xl`, the text column gets the space first,
because the right column is capped at 14rem.

**Architecture:** One class change in the root grid in `app/root.tsx:150`. A new
e2e spec measures the computed columns of the page grid.

**Tech Stack:** Tailwind 4 arbitrary grid templates, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-22-seitenraster-design.md`

## Global Constraints

- The breakpoints, the 248px navigation column and the text column maxima
  (732/792px) stay unchanged.
- Locally, run only mail-free e2e tests. Never run the submitting aufnahme-form
  tests.
- Use `mise exec node@24 --` and the dev server on port 4455.

## Review Focus

- **Section map on /aufnahme/formular (min 259px > 14rem):** it keeps its full
  width beside the form. The existing lernpfad tests at 1024 and 1280 cover
  this.
- **TOC entries:** they wrap at most onto two lines and stay clickable. The
  `toc.spec` test covers this.
- **/kontakt:** the address does not overflow its column. The new test checks
  the scrollWidth.

### Task 1: Test, then grid

**Files:**

- Create: `tests/seitenraster.spec.ts`
- Modify: `app/root.tsx:150`

- [ ] **Write the test.** Name it
      `gives the text column room beside the right column at <width>px on <path>`.
      It loops over the widths 896 and 1160 and the paths `/aufnahme`,
      `/ueber-uns` and `/kontakt`.
  - Read `getComputedStyle(grid).gridTemplateColumns` from the page grid, the
    parent of `<main>` or the root `div.grid`.
  - The text column is the second-to-last-but-one track: track index 1 at lg and
    index 2 at xl.
  - Assert that the text column is ≥ 540.
  - Assert that `document.documentElement.scrollWidth` ≤ width.
- [ ] **Run it.** It should fail with text columns of 464–515.
- [ ] **Change the grid.** In `app/root.tsx:150`, set
      `minmax(min-content,320px)` to `minmax(min-content,14rem)` in both `lg:`
      and `xl:`.
- [ ] **Run the new spec.** It passes. Then run `lernpfad.spec`, `toc.spec`,
      `aufnahme.spec` and the other mail-free specs. All are green.
- [ ] **Commit.**

### Task 2: Verification and PR

- [ ] Take after screenshots at 896, 1160 and 1440 and compare them with the
      before set.
- [ ] Run Vitest, typecheck and lint.
- [ ] Push and open the PR without Claude attribution.
