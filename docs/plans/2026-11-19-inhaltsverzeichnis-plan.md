# Inhaltsverzeichnis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the grey "Inhalt" box on Über uns, Aktuelles, Aufnahme and Alumni with a table of contents that sits in the text on small screens, follows the reader as a small button, and marks the current section in the right column on wide screens.

**Architecture:** One module, `app/components/toc.tsx`, exports a pure rule for the current section, a hook that applies it to the page, `PageHead` (title, optional intro, in-flow list and floating pill) and `TocRail` (the right-column list). Each page passes its sections once as `{ name, id }` items to both. The root layout grid stays as it is.

**Tech Stack:** React 19, React Router 7, Tailwind CSS 4 (custom breakpoints `md` 768px, `lg` 896px), Vitest + Testing Library (jsdom), Playwright.

**Spec:** `docs/plans/2026-11-19-inhaltsverzeichnis-design.md` (look reference: https://claude.ai/artifact/2DUQmdpA4YwtvuGp2QY8rd, variant B)

## Global Constraints

- Copy: label "Auf dieser Seite", pill label "Inhalt", back link "↑ Nach oben". German only.
- Breakpoints: phone below `md` (768px); list beside the page head from `md` to below `lg`; rail from `lg` (896px). Pill only below `lg`.
- Current section: the last section whose top is at or above 40% of the viewport height; before the first section, the first one.
- Theme tokens only (`primary`, `foreground`, `muted-foreground`, `border`, `card`); section names in `font-condensed`; label in small spaced capitals (`text-body-2xs font-bold tracking-widest uppercase text-muted-foreground`, matching today's label).
- Touch targets in the phone list, pill and pill panel at least 44px tall (list rows 48px).
- Server HTML shows the in-flow list and the rail in their final place; the pill renders hidden and is `inert` until shown. All links are plain `#id` anchors and work without JavaScript.
- Hover motion on the in-flow dots is disabled under `prefers-reduced-motion` (`motion-reduce:`).
- Page titles keep their current pale styling (out of scope).
- Commits: no mention of Claude, no co-author line (project CLAUDE.md).
- Local Playwright: run only mail-free specs (`tests/toc.spec.ts`, `tests/pages.spec.ts`); never the Aufnahme form spec. The worktree needs `.env` copied in by Ferdinand; use `mise exec node@24 --`, a free `PORT` (check with `lsof -iTCP:<port>`; not 3000).

## Review Focus

1. A section id in the list that does not exist in the DOM (typo, content removed in Sanity) — the hook skips it, nothing crashes. Test in Task 1.
2. Opening a page with a hash (`/ueber-uns#leitbild`) — after load the rail marks "Leitbild", not the first section. Test in Task 4 (e2e).
3. Keyboard use of the pill — it is not focusable while hidden; Escape closes the panel and returns focus to the pill. Test in Task 3.
4. Narrow phones (320px) with a long section name in the pill — the name truncates with an ellipsis and the page never scrolls sideways. Test in Task 4 (e2e).
5. Tapping a link in the pill panel — the panel closes, the page jumps, the pill then shows the new section. Test in Task 3 (close) and Task 4 (jump).

---

### Task 1: Current-section rule and hook

**Files:**
- Modify: `app/components/toc.tsx` (add next to the old `Toc`, which the four pages use until Task 4 removes it)
- Test: `app/components/toc.test.tsx` (`@vitest-environment jsdom` docblock, like `photo-strip.test.tsx`)

**Interfaces:**
- Produces:
  - `export type TocSection = { name: string; id: string }`
  - `export function currentSectionId(sections: { id: string; top: number }[], line: number): string` — `sections` in page order, `top` = `getBoundingClientRect().top`.
  - `export function useCurrentSection(ids: string[]): string` — returns `ids[0]` during server render and before the first measurement; recomputes on `scroll` (passive) and `resize`, and once after mount; line = `window.innerHeight * 0.4`; ids without a DOM element are skipped.

- [ ] **Step 1: Write the failing tests**

```tsx
describe('currentSectionId', () => {
  const s = (id: string, top: number) => ({ id, top })
  it('is the first section before any section reaches the line', () => {
    expect(currentSectionId([s('a', 500), s('b', 900)], 400)).toBe('a')
  })
  it('is the last section whose top has reached the line', () => {
    expect(currentSectionId([s('a', -800), s('b', 120), s('c', 700)], 400)).toBe('b')
  })
  it('counts a section exactly on the line', () => {
    expect(currentSectionId([s('a', -10), s('b', 400)], 400)).toBe('b')
  })
  it('stays on the last section at the end of the page', () => {
    expect(currentSectionId([s('a', -900), s('b', -300)], 400)).toBe('b')
  })
})

describe('useCurrentSection', () => {
  // Helper in the test: create <section id> elements, stub each one's
  // getBoundingClientRect().top, set window.innerHeight = 1000 (line 400),
  // render a probe component that prints the hook result.
  it('follows the scroll position', () => { /* tops a:-500 b:100 → "b"; restub b:600, dispatch scroll → "a" */ })
  it('skips ids that are not on the page', () => { /* ids ['a','missing','b'] → no throw, "b" */ })
})
```

- [ ] **Step 2: Run** `mise exec node@24 -- npx vitest run app/components/toc.test.tsx` — expect FAIL (`currentSectionId` is not exported).
- [ ] **Step 3: Implement** `currentSectionId` and `useCurrentSection` in `app/components/toc.tsx` (`useEffect` + `useState`, listeners removed on unmount).
- [ ] **Step 4: Run** the same command — expect PASS.
- [ ] **Step 5: Commit** `git commit -m "Track which section of a page the reader is in"`

### Task 2: Right-column rail

**Files:**
- Modify: `app/components/toc.tsx`
- Test: `app/components/toc.test.tsx`

**Interfaces:**
- Consumes: `TocSection`, `useCurrentSection` (Task 1)
- Produces: `export function TocRail({ sections, className }: { sections: TocSection[]; className?: string }): JSX.Element` — a `<nav aria-label="Auf dieser Seite">` with the label, an `<ol>` of links (`href="#<id>"`), the current link carrying `aria-current="location"`, and an `<a href="#">↑ Nach oben</a>` that is visible only when `window.scrollY > window.innerHeight` (hidden state: `opacity-0 pointer-events-none` plus `aria-hidden` and `tabIndex={-1}`).

Look (from the spec): no box or background; links on a 2px left track (`border-l-2 border-border`), each link `-ml-0.5 border-l-2 border-transparent pl-4 py-1.5 font-condensed text-body-md text-muted-foreground hover:text-foreground`; current link `text-foreground font-bold border-primary`. The page decides placement and stickiness through `className`.

- [ ] **Step 1: Write the failing tests**

```tsx
describe('TocRail', () => {
  it('lists every section as an anchor link under "Auf dieser Seite"', () => {
    // nav named "Auf dieser Seite"; links "Menschen" → "#menschen", "Philosophie" → "#philosophie"
  })
  it('marks the section in view as the current location', () => {
    // with stubbed tops so "philosophie" is current: that link has aria-current="location", the other has none
  })
  it('offers "Nach oben" only after the first screen', () => {
    // scrollY 0 → link has aria-hidden="true"; scrollY 1200 (innerHeight 1000) + scroll event → no aria-hidden
  })
  it('renders the links in the server HTML', () => {
    // renderStatic(<TocRail …/>) contains href="#menschen"
  })
})
```

- [ ] **Step 2: Run** the test file — expect FAIL (`TocRail` not exported).
- [ ] **Step 3: Implement** `TocRail`.
- [ ] **Step 4: Run** — expect PASS.
- [ ] **Step 5: Commit** `git commit -m "Show the page's sections in the right column with the current one marked"`

### Task 3: Page head with in-flow list and floating pill

**Files:**
- Modify: `app/components/toc.tsx`
- Test: `app/components/toc.test.tsx`

**Interfaces:**
- Consumes: `TocSection`, `useCurrentSection` (Task 1)
- Produces: `export function PageHead({ title, sections, children }: { title: string; sections: TocSection[]; children?: React.ReactNode }): JSX.Element` — renders, in DOM order: the page `<h1>` (exactly today's classes: `font-condensed text-h1 text-muted-foreground font-bold opacity-20`), the in-flow `<nav aria-label="Auf dieser Seite">`, then `children` (the intro, if any). Also renders the pill (internal `TocPill`).

Layout (from the spec):
- Wrapper: `md:grid md:grid-cols-[minmax(0,1fr)_12rem] md:gap-x-12 md:items-start`; `h1` and `children` in column 1; the nav `md:col-start-2 md:row-span-2 md:row-start-1 md:border-l md:border-border md:pl-6 lg:hidden`. On a page without children the nav sits beside the title.
- In-flow list below `md`: `grid grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))] gap-x-6 border-t border-border`, each `li` `border-b border-border`, each link `flex min-h-12 items-center gap-3 font-condensed text-body-md font-bold hover:text-primary`, preceded by an orange dot (`size-1.5 rounded-full bg-primary`) that on hover grows to `h-3.5` and moves down slightly (`group-hover:`), with `motion-reduce:transition-none`. From `md`: one column, no row borders, `min-h-10`.
- Pill (`TocPill`, below `lg` only: `lg:hidden`): fixed, centred, `bottom: calc(1rem + env(safe-area-inset-bottom))`, max width `calc(100vw - 2rem)`. Button `aria-expanded`/`aria-controls`, dark (`bg-foreground text-background`), `min-h-12 rounded-full`, content: list icon (Phosphor `ListBullets`), "Inhalt" in small capitals, the current section name (`truncate`), chevron (Phosphor `CaretUp`, rotates when open). Shown once the in-flow nav's `getBoundingClientRect().bottom < 0`; hidden otherwise (wrapper `data-state="hidden"` with `inert` and a slide-down/fade transition, `motion-reduce:transition-none`). Panel above the button: white card (`bg-card rounded-xl shadow-lg`), label, the sections (current one `text-primary` with a dot and `aria-current="location"`), separator, "↑ Nach oben" (`href="#"`). Closes on: choosing any link in it, a click outside the pill, Escape (then focus returns to the button), and when the pill hides.

- [ ] **Step 1: Write the failing tests**

```tsx
describe('PageHead', () => {
  it('puts the in-flow list right after the title and before the intro', () => {
    // render with children <p>Intro</p>; DOM order h1 → nav "Auf dieser Seite" → "Intro"
  })
  it('renders title and list in the server HTML', () => { /* renderStatic contains <h1 …>Über uns and href="#menschen" */ })
})

describe('pill', () => {
  it('stays hidden and out of the tab order while the list is in view', () => {
    // in-flow nav bottom stubbed to 300 → pill wrapper has inert / button not reachable by role query { hidden: false }
  })
  it('appears with the current section once the list has scrolled away', () => {
    // nav bottom -10, section tops so "leitbild" is current, scroll event → button "Inhalt Leitbild" visible
  })
  it('opens the section list and closes it again when a section is chosen', () => {
    // click button → aria-expanded="true", panel links visible; click "Geschichte" → aria-expanded="false"
  })
  it('closes on Escape and gives focus back to the button', () => { /* … */ })
  it('closes on a click outside', () => { /* fireEvent.click(document.body) */ })
  it('hides and closes when the list comes back into view', () => { /* open, then nav bottom 200 + scroll → inert, aria-expanded="false" */ })
})
```

- [ ] **Step 2: Run** the test file — expect FAIL (`PageHead` not exported).
- [ ] **Step 3: Implement** `PageHead` and the internal `TocPill`.
- [ ] **Step 4: Run** — expect PASS.
- [ ] **Step 5: Commit** `git commit -m "Show the page's sections under the title and as a button while reading"`

### Task 4: Use it on the four pages

**Files:**
- Modify: `app/routes/ueber-uns+/_index.tsx`, `app/routes/aktuelles/route.tsx`, `app/routes/aufnahme+/_index.tsx`, `app/routes/alumni/route.tsx`
- Modify: `app/components/toc.tsx` (remove the old `Toc` export and its `BookOpen` import)
- Create: `tests/toc.spec.ts`

**Interfaces:**
- Consumes: `PageHead`, `TocRail`, `TocSection` (Tasks 2–3)

Per page: define the sections once (`const sections: TocSection[] = [...]`, same names and ids as today's links without `#`). Replace the `<h1>` and the grey TOC `<div>` with `<PageHead title="…" sections={sections}>` and `<TocRail sections={sections} className="hidden lg:block lg:sticky lg:top-4 lg:z-20 lg:col-start-2 lg:row-start-2" />`. On Über uns, move the three intro paragraphs (today the first child of the content grid, `max-w-2xl space-y-4 text-base md:text-xl`) into `PageHead`'s children, keeping their classes. Sections:
- Über uns: Menschen/menschen, Philosophie/philosophie, Leitbild/leitbild, Geschichte/geschichte
- Aktuelles: Schuljahr/schuljahr, Jahrgänge/jahrgaenge, Blog/blog
- Aufnahme: Vorgehensweise/vorgehensweise, Voraussetzungen/voraussetzungen, Kosten/kosten, Stipendien/stipendien
- Alumni: Ehrensache Walz/ehrensache, Ehemalige Jahrgänge/jahrgaenge

- [ ] **Step 1: Write the failing e2e spec** `tests/toc.spec.ts` (wait for hydration with `page.waitForFunction(() => '__reactRouterDataRouter' in window)` as in `pages.spec.ts`):
  - `at phone width the list sits under the title` — 375×812, `/ueber-uns`: nav "Auf dieser Seite" visible, its top is below the `h1` "Über uns" and above the text "Die Walz bietet fünf Jahrgängen".
  - `the button follows the reader and jumps to a section` — 375×812: button `/Inhalt/` not visible at top; scroll the "Philosophie" heading into view → button visible with text "Philosophie"; click it, click "Geschichte" in the panel → heading "Geschichte" in viewport, button text "Geschichte".
  - `no sideways scrolling on a narrow phone` — 320×640, scrolled to the end: `document.documentElement.scrollWidth <= 320`.
  - `at desktop width the right column marks the section in view` — 1440×900: in-flow list hidden, pill hidden; rail link "Menschen" has `aria-current="location"`; scroll "Leitbild" heading to the top → rail "Leitbild" current.
  - `opening a section link marks that section` — 1440×900, `/ueber-uns#leitbild` → rail "Leitbild" current.
  - `every page with a table of contents links to real sections` — for `/aktuelles`, `/aufnahme`, `/alumni`, `/ueber-uns` at 1440: each rail link's target id exists.
- [ ] **Step 2: Run** `mise exec node@24 -- env PORT=<free> npx playwright test tests/toc.spec.ts` — expect FAIL (no nav "Auf dieser Seite" with the new structure / no rail).
- [ ] **Step 3: Migrate** the four pages and remove the old `Toc`.
- [ ] **Step 4: Run** `tests/toc.spec.ts` and `tests/pages.spec.ts` — expect PASS. Then `mise exec node@24 -- npm run typecheck`, `npm run lint`, `npx vitest run` — all clean, no warnings.
- [ ] **Step 5: Visual check** — screenshots of `/ueber-uns` and `/aufnahme` at 390, 820, 1100, 1440px before (live site) and after (local), compared against the demo; fix spacing differences that are not intended.
- [ ] **Step 6: Commit** `git commit -m "Use the new table of contents on Über uns, Aktuelles, Aufnahme and Alumni"`
