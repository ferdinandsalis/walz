# Lernpfad Design Vocabulary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the admission pages the Lernpfad design vocabulary: a path rail
with section nodes, choice cards, notices, steps path and section map, built as
reusable UI components.

**Architecture:**

- Tokens go into `app/styles/app.css` and are registered with tailwind-merge.
- Small presentational components go into `app/components/ui/`.
- Section state is a pure function in `app/utils/aufnahme-form.ts`, computed
  during render from live or submitted values.
- The routes compose the components. Form behaviour (validation, no-JS
  show/hide, the error summary) stays as it is.

**Tech Stack:** React Router 7 (flat routes), React 19, TypeScript, Tailwind CSS
4, tailwind-merge (`cn`), Phosphor icons, Vitest 4 (`renderToStaticMarkup`,
jsdom where needed), Playwright 1.60, `@axe-core/playwright`.

**Spec:** `docs/plans/2026-10-07-lernpfad-design-vocabulary-design.md`. It
extends `docs/plans/2026-10-07-aufnahmeformular-redesign-design.md`. Executors
read the Lernpfad spec; exact classes, tokens, states and rules come from it
verbatim.

## Global Constraints

- **TDD:** every production change has a test that was watched failing first.
  Test output stays pristine; Vitest throws on an unmocked `console.error`.
- **Commits:** signed, no "Claude", no `Co-Authored-By`.
  - If GPG signing fails, report BLOCKED.
  - If a commit is denied by a permission check, report BLOCKED with the exact
    denial and do not work around it.
  - Verify every commit with `git log -1 --oneline`.
- **Runtime:** run Node via `mise exec node@24 --`.
- **Ports:** check a port with `nc -z -G 1 localhost <port>`; `lsof` hangs here.
  `:3000` is OrbStack's.
- **NO MAIL:** never run an e2e test that completes a submission. Always run
  Playwright with
  `--grep-invert "submits a complete form|should handle optional parent 2 fields|marks the button busy|posts once on a double click"`,
  and never write a test that completes a submission.
- **Owner decisions:**
  - The brand colours (`--primary`, `--secondary`) stay unchanged.
  - No spiral ornament anywhere.
  - The axe scans skip `color-contrast`; contrast is checked by hand.
  - Site-wide focus rules in `app.css` and `button.tsx` stay unchanged.
- **Nothing from the form spec may regress:**
  - legends stay the first child of their fieldset;
  - `noValidate` with `required`;
  - CSS `:has()` show/hide without JavaScript, including the `group/*` names;
  - `section-*` autofill tokens and `off` on the child fields;
  - native controls (no `appearance: none`);
  - the error summary's focus, count heading, `href` fallback and mail variant;
  - the danke h1 focus on mount;
  - the 44px touch-target, outline and first-screen tests in
    `tests/aufnahme-layout.spec.ts`;
  - the axe scans.
- **Placement:** non-route files under `app/routes/` must match `**/__*.*`. UI
  pieces go in `app/components/ui/`, domain logic in
  `app/utils/aufnahme-form.ts`.
- **Code style:** no semicolons, single quotes, prettier. Comments say what and
  why, never history.

## Review Focus

1. **A section with a server error that the parent then fixes** goes from
   `attention` to `done` without a resubmit, once the live values parse clean.
   E2E test in Task 5.
2. **A further guardian opened, filled, then cleared** brings the section-3 node
   back to `optional`. Unit test in Task 2.
3. **Keyboard focus on a `ChoiceCard` and on a `ChoiceList` row** is clearly
   visible, both before and after the restyle. E2E outline test in Task 5.
4. **The newsletter field after the site-wide `Input` change** is still 16px,
   with a visible `primary-700` focus outline and no layout jump. E2E test in
   Task 1.
5. **The confirmation page under `prefers-reduced-motion`** shows the drawn
   segment fully, never stuck at `scaleY(0)`. E2E test in Task 7.

---

## File map

| File                                                           | Change | Responsibility                                                              |
| -------------------------------------------------------------- | ------ | --------------------------------------------------------------------------- |
| `app/styles/app.css`                                           | modify | Tint tokens, Lernpfad tokens, usage comment                                 |
| `app/utils/extended-theme.ts`                                  | modify | Register the new class groups for `cn()`                                    |
| `app/components/ui/input.tsx`, `textarea.tsx`                  | modify | Focus outline, invalid fill, inset shadow; `h-12` on `Input` only           |
| `app/utils/aufnahme-form.ts` (+ test)                          | modify | `sectionOf`, `sectionStatus`                                                |
| `app/components/ui/path.tsx` (+ test)                          | create | `PathRail`, `PathNode`, `Waypoint`                                          |
| `app/components/ui/steps-path.tsx` (+ test)                    | create | `StepsPath`                                                                 |
| `app/components/ui/choice.tsx` (+ test)                        | create | `ChoiceCard`, `ChoiceList`                                                  |
| `app/components/ui/notice.tsx` (+ test)                        | create | `Notice`                                                                    |
| `app/components/ui/section-map.tsx` (+ test)                   | create | `SectionMap`                                                                |
| `app/routes/aufnahme+/formular.tsx`                            | modify | Compose the vocabulary, status per section, grouped summary, subgrid layout |
| `app/routes/aufnahme+/formular_.danke.tsx`                     | modify | Full steps, `Notice`                                                        |
| `app/routes/aufnahme+/_index.tsx`                              | modify | Compact steps, `Notice`s                                                    |
| `tests/aufnahme-form.spec.ts`, `tests/aufnahme-layout.spec.ts` | modify | E2E                                                                         |
| `tests/lernpfad.spec.ts`                                       | create | E2E for section map, reflow, danke motion, `/aufnahme`                      |

---

### Task 1: Tokens and shared control rules

**Files:**

- Modify: `app/styles/app.css`, `app/utils/extended-theme.ts`,
  `app/components/ui/input.tsx`, `app/components/ui/textarea.tsx`
- Test: `app/components/ui/text-controls.test.tsx`, `app/utils/misc.test.ts`
  (create if absent), `tests/lernpfad.spec.ts` (create)

**Interfaces:**

- Produces Tailwind classes that later tasks use:
  - colours: `bg-primary-50`, `text-primary-700`, `text-primary-800`,
    `border-primary`, `bg-secondary-50`, `text-secondary-700`,
    `text-secondary-800`, `bg-danger-50`, `bg-path`, `border-path`,
    `bg-path-done`;
  - spacing: `pl-path`, `sm:pl-path-wide`;
  - other: `rounded-choice`, `inset-shadow-field`,
    `motion-safe:animate-path-draw`.
- Produces the CSS variable `--path-gap`, defaulting to the page background,
  which `PathNode` uses for its ring.

**Steps:**

- [ ] **Step 1: Write the failing tests.**
  - `text-controls.test.tsx`:
    - `Input renders h-12, the primary-700 focus outline, the invalid fill and the inset shadow`.
      The markup contains `h-12`, `focus-visible:outline-2`,
      `focus-visible:outline-offset-2`, `focus-visible:outline-primary-700`,
      `aria-invalid:bg-danger-50`, `aria-invalid:border-input-invalid` and
      `inset-shadow-field`. It does not contain `focus-visible:ring-2`.
    - `Textarea gets the same focus, invalid and shadow classes but no h-12`.
  - `misc.test.ts` (`cn` merge):
    - `cn('inset-shadow-field', 'shadow-md')` keeps both;
    - `cn('rounded-choice', 'rounded-lg')` gives `'rounded-lg'`;
    - `cn('pl-path', 'pl-4')` gives `'pl-4'`;
    - `cn('text-primary-700', 'text-sm')` keeps both.
  - `tests/lernpfad.spec.ts`:
    - `the newsletter field keeps 16px and shows a visible focus outline`. On
      `/` at 375px, `input[name="email"]` has a computed `font-size` of `16px`.
      After `.focus()` with the keyboard (Tab into it), its `outline-style` is
      `solid` and its `outline-width` is `2px`. Its bounding box height is the
      same before and after focus.

- [ ] **Step 2: Run the tests to verify they fail.**

  Run:
  `mise exec node@24 -- npx vitest run app/components/ui/text-controls.test.tsx app/utils/misc.test.ts`
  Expected: FAIL.

  Then:
  `mise exec node@24 -- env PORT=4400 npx playwright test tests/lernpfad.spec.ts`
  Expected: FAIL on the outline.

- [ ] **Step 3: Implement.**
  - Add the spec's token block verbatim to `@theme`, with the spec's usage rules
    as a comment above it.
  - Set `--path-gap: var(--color-background)` in `:root`.
  - Register the new colour, spacing, radius, inset-shadow and animation names
    in `extended-theme.ts`, following how that file already extends
    tailwind-merge.
  - Update `Input` and `Textarea` per the spec's "Shared control rules":
    - remove the `focus-visible:ring-*` and `ring-offset-*` classes;
    - keep `text-base`, `aria-invalid:border-2` and
      `aria-invalid:border-input-invalid`.

- [ ] **Step 4: Run to verify they pass.** Same commands; expected PASS. Also
      run `npx playwright test tests/aufnahme-layout.spec.ts` (mail-free) and
      `npm run typecheck`.

- [ ] **Step 5: Commit:** "Add the Lernpfad tokens and an outline focus to text
      inputs".

### Task 2: Section state

**Files:**

- Modify: `app/utils/aufnahme-form.ts`, `app/utils/aufnahme-form.test.ts`

**Interfaces:**

- Consumes the existing `parseAufnahmeForm`, `hasParent2Data` and
  `AUFNAHME_FIELD_NAMES`.
- Produces exactly the spec's signatures:
  - `SectionKey`;
  - `SectionStatus`, the literal union
    `'open' | 'done' | 'attention' | 'optional'`;
  - `sectionOf(key: string): SectionKey | undefined`;
  - `sectionStatus(section, values: Record<string, string>, shownErrors: Record<string, string>): SectionStatus`.
- Also produces
  `SECTIONS: ReadonlyArray<{ key: SectionKey; number: 1 | 2 | 3 | 4; title: string; id: string }>`,
  in page order:

  | key       | number | title                                  | id            |
  | --------- | ------ | -------------------------------------- | ------------- |
  | `parent1` | 1      | `Ihre Angaben`                         | `abschnitt-1` |
  | `student` | 2      | `Ihr Kind`                             | `abschnitt-2` |
  | `parent2` | 3      | `Weitere erziehungsberechtigte Person` | `abschnitt-3` |
  | `final`   | 4      | `Zum Schluss`                          | `abschnitt-4` |

**Steps:**

- [ ] **Step 1: Write the failing tests.**
  - `sectionOf`:
    - one table row per mapping row of the spec;
    - `studentBirthdate` maps to `'student'`;
    - `'mail'` maps to `undefined`.
  - `sectionStatus`, for each case:
    - **Empty values and no shown errors:** `parent1` `open`, `student` `open`,
      `parent2` `optional`, `final` `open`.
    - **A complete valid fixture**, from the existing `validRaw`: `parent1`
      `done`, `student` `done`, `parent2` `optional`, `final` `open`.
    - **An invalid date** (`31`/`2`/`2012`) with otherwise valid child fields:
      `student` `open`.
    - **`shownErrors = { studentBirthdate: '…' }`:** `student` `attention`, even
      when the values parse clean (attention wins).
    - **A ticked child address box with empty child address fields:** `student`
      can be `done`. Unticked with empty fields: `open`.
    - **Parent 2 with name and phone:** `done`. With only a phone: `open`.
      Filled and then cleared (all parent-2 text fields `''`): `optional`.
    - **`final`:** with `source: 'anderes'` and an empty `sourceOther` it is
      `open`; with any shown `sourceOther` error it is `attention`; it is never
      `done` or `optional`.
  - `SECTIONS` matches the table above.

- [ ] **Step 2: Run to verify fail.**

  Run: `mise exec node@24 -- npx vitest run app/utils/aufnahme-form.test.ts`
  Expected: FAIL (not exported).

- [ ] **Step 3: Implement** per the spec's "Section state" rules, in that order.
      `sectionOf` uses prefixes plus explicit keys; there is no second field
      list.

- [ ] **Step 4: Run to verify pass.** Same command; expected PASS.

- [ ] **Step 5: Commit:** "Work out each Aufnahme form section's state from the
      submit rules".

### Task 3: Path primitives and steps path

**Files:**

- Create: `app/components/ui/path.tsx`, `app/components/ui/path.test.tsx`,
  `app/components/ui/steps-path.tsx`, `app/components/ui/steps-path.test.tsx`

**Interfaces:**

- Consumes the Task 1 classes.
- Produces:

  ```ts
  export type PathNodeState = 'open' | 'done' | 'attention' | 'optional'
  export function PathRail(props: {
    children: ReactNode
    dashed?: boolean
    className?: string
  }): JSX.Element
  export function PathNode(props: {
    state: PathNodeState
    number?: number
    className?: string
  }): JSX.Element
  export function Waypoint(props: { className?: string }): JSX.Element
  export function StepsPath(props: {
    steps: ReadonlyArray<{ title: string; description: string }>
    variant: 'compact' | 'full'
    heading: string
    headingAs?: 'h2' | 'h3'
    className?: string
  }): JSX.Element
  ```

  - `SectionStatus` (Task 2) is the same union as `PathNodeState`, so statuses
    pass straight through.
  - `PathNode` renders `data-node-state={state}` on its root, which the tests
    use.
  - `StepsPath` renders the heading with an id, and the `<ol>` with
    `aria-labelledby` pointing at it.

**Steps:**

- [ ] **Step 1: Write the failing tests** (static markup).
  - `PathNode`:
    - each state renders with `aria-hidden="true"`;
    - `done` contains the tick icon `svg` and no number;
    - `attention` contains the text `!`;
    - `open` and `optional` show the number;
    - `optional` carries a dashed border class.
  - `PathRail`:
    - the line element is `aria-hidden`;
    - `dashed` switches the line to a dashed style;
    - the children are wrapped in the `pl-path sm:pl-path-wide` indent.
  - `Waypoint` is `aria-hidden`.
  - `StepsPath`:
    - **`compact`** renders an `<ol>` labelled by the heading id, with four
      `<li>` holding the titles only (no descriptions), no "Erledigt", and a
      dashed rail.
    - **`full`** renders titles and descriptions. The first `<li>` text starts
      with the sr-only `Erledigt: `, which sits outside every `aria-hidden`
      element. The first node is `done`. It contains exactly one element with
      `motion-safe:animate-path-draw` and `origin-top`.
    - Markers are never rendered as outlined, unfilled circles: assert the
      compact dots carry `bg-path`.

- [ ] **Step 2: Run to verify fail.**

  Run:
  `mise exec node@24 -- npx vitest run app/components/ui/path.test.tsx app/components/ui/steps-path.test.tsx`
  Expected: FAIL.

- [ ] **Step 3: Implement** per the spec's `PathRail`/`PathNode`/`Waypoint` and
      `StepsPath` sections.
  - The node ring uses `var(--path-gap)`.
  - Icons come from Phosphor (`Check`), added to `types/phosphor-icons.d.ts` if
    missing.

- [ ] **Step 4: Run to verify pass.** Same command; expected PASS.

- [ ] **Step 5: Commit:** "Add path rail, nodes and a steps path to the UI kit".

### Task 4: Choice card, choice list and notice

**Files:**

- Create: `app/components/ui/choice.tsx`, `app/components/ui/choice.test.tsx`,
  `app/components/ui/notice.tsx`, `app/components/ui/notice.test.tsx`

**Interfaces:**

- Consumes `fieldIds` from `app/components/form-field.tsx`.
- Produces:

  ```ts
  export function ChoiceCard(props: {
    name: string
    label: ReactNode
    hint?: ReactNode
    defaultChecked?: boolean
    className?: string
  }): JSX.Element
  export function ChoiceList(props: {
    name: string
    options: ReadonlyArray<{
      value: string
      label: ReactNode
      after?: ReactNode
    }>
    defaultValue?: string
    className?: string
  }): JSX.Element
  export function Notice(props: {
    icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
    title?: ReactNode
    titleAs?: 'h2' | 'h3'
    children: ReactNode
    className?: string
  }): JSX.Element
  ```

  - **`ChoiceCard`:** the checkbox `id` and `name` are both `name`. The hint
    renders outside the `<label>` with `id={fieldIds(name).hintId}`, and the
    checkbox has `aria-describedby` pointing at it.
  - **`ChoiceList`:** renders `option.after` directly after that option's row.

**Steps:**

- [ ] **Step 1: Write the failing tests** (static markup).
  - `ChoiceCard`:
    - it contains a native `input[type=checkbox]` with id and name equal to
      `name`, and no `appearance-none`;
    - the hint paragraph is not inside the `<label>`;
    - `aria-describedby` is `${name}-hint`;
    - the label carries `min-h-12`;
    - the wrapper carries `has-[:checked]:bg-primary-50`,
      `has-[:checked]:border-primary` and
      `has-[:focus-visible]:outline-primary-700`;
    - the radius is `rounded-choice`.
  - `ChoiceList`:
    - it renders one native radio per option with the shared `name`;
    - `defaultValue` checks the matching radio;
    - every label carries `min-h-12`;
    - `after` content appears between its option's row and the next row.
  - `Notice`:
    - it has `bg-secondary-50`;
    - the icon is `aria-hidden` with `text-secondary-700`;
    - `title` with `titleAs="h2"` renders an `h2` with `text-secondary-800`;
    - without a title there is no heading.

- [ ] **Step 2: Run to verify fail.**

  Run:
  `mise exec node@24 -- npx vitest run app/components/ui/choice.test.tsx app/components/ui/notice.test.tsx`
  Expected: FAIL.

- [ ] **Step 3: Implement** per the spec's `ChoiceCard`/`ChoiceList` and
      `Notice` sections.

- [ ] **Step 4: Run to verify pass.** Expected PASS.

- [ ] **Step 5: Commit:** "Add choice cards, choice lists and notices to the UI
      kit".

### Task 5: The form on the path

**Files:**

- Modify: `app/routes/aufnahme+/formular.tsx`, `tests/aufnahme-form.spec.ts`,
  `tests/aufnahme-layout.spec.ts`, `app/routes/aufnahme+/formular.test.tsx`
  (jsdom)

**Interfaces:**

- Consumes Tasks 1–4: `SECTIONS`, `sectionOf`, `sectionStatus`, `PathRail`,
  `PathNode`, `Waypoint`, `StepsPath`, `ChoiceCard`, `ChoiceList`, `Notice`.
- Produces a local
  `useSectionStatuses(form ref, actionData, errors): Record<SectionKey, SectionStatus>`.
  - It returns `sectionStatus` for every key.
  - Values come from `liveValues ?? actionData?.values ?? {}`, where
    `liveValues` is `null` until mount. On mount and on the form's `input` and
    `change` it is set from the existing `formValues(form)`.
  - `errors` is the merged shown-errors record the page already computes.
  - Task 6 reuses this hook for the `SectionMap`.

**Steps:**

- [ ] **Step 1: Write the failing e2e and jsdom tests** (mail-free).
  - `marks section 1 done once it is filled` (hydrated): fill section 1 via the
    existing helper. `#abschnitt-1 [data-node-state]` has
    `data-node-state="done"`.
  - `marks only the sections with errors after an empty submit`, run both with
    JavaScript and in a `javaScriptEnabled: false` block:
    - `abschnitt-1` and `abschnitt-2` are `attention`;
    - `abschnitt-3` is `optional`;
    - `abschnitt-4` is `open`.
  - `turns a fixed section from attention to done without resubmitting` (Review
    Focus 1): empty submit, then fill section 1, and its node becomes `done`.
  - `tints the same-address card from the checkbox without JavaScript`
    (`javaScriptEnabled: false`): the card's computed background equals the
    `primary-50` colour while checked, and differs after unchecking.
  - `shows a visible focus outline on the choice card and the source rows`
    (Review Focus 3): Tab to `#studentSameAddress`, and the card wrapper's
    computed `outline-style` is `solid`. Do the same for a `source` radio row.
  - `groups the error summary by section` (jsdom, in `formular.test.tsx`):
    - the summary renders a group label "Ihre Angaben" as non-heading text
      followed by its links;
    - the existing query for the heading `/Ihre Angaben/` still finds exactly
      one heading;
    - an unknown key lands in the trailing group.
  - `keeps the date row inside the screen at 320px`: at 320×640,
    `document.documentElement.scrollWidth` is at most 320.
  - In `tests/aufnahme-layout.spec.ts`:
    - the existing first-screen bound (≤ 635 at 375×635) stays;
    - add `renders the submit label at 20px bold`: computed `font-size` is
      `20px` and `font-weight` is at least 700.

- [ ] **Step 2: Run to verify fail.**

  Run:
  `mise exec node@24 -- env PORT=4400 npx playwright test tests/aufnahme-form.spec.ts tests/aufnahme-layout.spec.ts --grep-invert`
  with the NO MAIL list from Global Constraints, then
  `mise exec node@24 -- npx vitest run app/routes/aufnahme+/formular.test.tsx`.
  Expected: the new tests FAIL.

- [ ] **Step 3: Implement** per the spec's "Placement → Form".
  - `FormSection` takes a `section: SectionKey` and a status. It renders the
    fieldset with `id`, and the legend (still the first child) with `PathNode`
    (`data-node-state`) and the title. All sections sit in one `PathRail`.
  - `SubHeading` gets a `Waypoint`.
  - `SameAddressCheckbox` becomes `ChoiceCard`. The source radios become
    `ChoiceList`, with the "Woher genau?" `Field` as the `after` of `anderes`,
    inside the existing `group/source` `FieldGroup`.
  - The privacy text becomes a `Notice` with the `Lock` icon.
  - The intro box becomes
    `StepsPath variant="compact" heading="So geht es weiter"`.
  - The submit label gets `font-condensed text-[1.25rem] font-bold`. The rail
    ends in a filled 12px dot beside the button.
  - The date row gets `flex-wrap`.
  - `ErrorSummary` groups entries with `sectionOf` in `SECTIONS` order, with
    non-heading group labels, nested `<ul>`s and a trailing group for keys
    without a section. Focus, `href` fallback, count heading and mail variant
    stay unchanged.

- [ ] **Step 4: Run to verify pass.**
  - The same commands; expected PASS.
  - Then the full mail-free Playwright run of all specs, plus `npx vitest run`,
    typecheck and lint.
  - Take 375px and 1280px screenshots of the empty and error states into
    `.superpowers/sdd/2026-10-07-lernpfad-design-vocabulary-plan/shots/`.
    Compare them with `.superpowers/sdd/design-exploration/shots/lernpfad-*` and
    fix obvious visual gaps.

- [ ] **Step 5: Commit** in two or three logical commits, e.g. "Put the Aufnahme
      form sections on a path", "Use choice cards and a notice on the Aufnahme
      form", "Group the Aufnahme error summary by section".

### Task 6: Section map beside the form

**Files:**

- Create: `app/components/ui/section-map.tsx`,
  `app/components/ui/section-map.test.tsx`
- Modify: `app/routes/aufnahme+/formular.tsx`, `tests/lernpfad.spec.ts`

**Interfaces:**

- Consumes `PathNode`, `PathNodeState` (Task 3); `SECTIONS` (Task 2); the
  `useSectionStatuses` hook (Task 5).
- Produces:

  ```ts
  export function SectionMap(props: {
    sections: ReadonlyArray<{
      id: string
      number: number
      title: string
      state: PathNodeState
    }>
    className?: string
  }): JSX.Element
  ```

  It renders a `nav` with `aria-label="Abschnitte"`, an `<ol>` of links
  (`href="#<id>"`), each with a `PathNode`, on a mini-rail. The panel sets
  `--path-gap` to its own background.

**Steps:**

- [ ] **Step 1: Write the failing tests.**
  - Unit (static markup):
    - it renders a nav labelled "Abschnitte" with four links in order;
    - each link holds an `aria-hidden` node with `data-node-state`;
    - there is no steps tail and no element marked "current".
  - E2E in `tests/lernpfad.spec.ts`:
    - `shows the section map beside the form on wide screens`: at 1280×900 the
      nav "Abschnitte" is visible and to the right of `#abschnitt-1`
      (bounding-box x). Clicking "Ihr Kind" scrolls `#abschnitt-2` into view
      (top within the viewport).
    - The same visibility check passes at 1024×768.
    - `hides the section map on phones`: at 375×812 the nav is not visible.
    - `mirrors the form's section state`: after filling section 1 at 1280, the
      map's first node is `done`.

- [ ] **Step 2: Run to verify fail.** Expected: FAIL.

- [ ] **Step 3: Implement.**
  - Move the route's root to
    `grid grid-cols-subgrid items-start gap-8 lg:col-span-2`, as
    `app/routes/aufnahme+/_index.tsx` does. The form column keeps its `max-w-xl`
    content width.
  - Render `SectionMap` after the form in the DOM, with
    `hidden lg:block lg:sticky lg:top-4 lg:col-start-2 lg:row-start-1` and
    `bg-muted/30 rounded-md p-6`.
  - Statuses come from `useSectionStatuses`.

- [ ] **Step 4: Run to verify pass.** Also run the full mail-free Playwright run
      and the axe spec.

- [ ] **Step 5: Commit:** "Show a section map beside the Aufnahme form on wide
      screens".

### Task 7: Confirmation page and /aufnahme on the path

**Files:**

- Modify: `app/routes/aufnahme+/formular_.danke.tsx`,
  `app/routes/aufnahme+/_index.tsx`, `tests/aufnahme-form.spec.ts`,
  `tests/lernpfad.spec.ts`

**Interfaces:**

- Consumes `StepsPath`, `Notice` (Tasks 3–4) and `AUFNAHME_STEPS`.

**Steps:**

- [ ] **Step 1: Write the failing e2e tests.**
  - **Confirmation page:**
    - the existing danke test still passes (h1 focused, four step titles, the
      "Für Ihr Kind bis zum Gespräch" heading);
    - add: the steps list is an `ol` labelled "So geht es weiter";
    - the first item's accessible text starts with "Erledigt:".
  - `draws the first segment fully under reduced motion` (Review Focus 5): with
    `page.emulateMedia({ reducedMotion: 'reduce' })`, the `.origin-top`
    segment's computed `transform` is `none`.
  - **`/aufnahme`:**
    - `shows the steps path and both notices`: under "Vorgehensweise" there is
      an `ol` labelled "So geht es weiter" with the four titles;
    - the texts "Aufnahmetermin" and "Plätze frei" each sit in an element with
      the `bg-secondary-50` class;
    - the "Zum Anmeldeformular" link still works.
  - `does not scroll sideways at 320px` for `/aufnahme/formular/danke` and
    `/aufnahme`.

- [ ] **Step 2: Run to verify fail.** Expected: the new tests FAIL.

- [ ] **Step 3: Implement** per the spec's "Placement → Confirmation page" and
      "→ /aufnahme".
  - Danke:
    - `StepsPath variant="full"`;
    - the "Für Ihr Kind" box becomes `Notice` with `titleAs="h2"` and a fitting
      icon (e.g. `Lightbulb`, added to the icon shim);
    - the mail links stay;
    - no seal.
  - `/aufnahme`:
    - the prose stays;
    - `StepsPath variant="compact"` follows it;
    - `AdmissionDay` and `LateralEntryBox` render through `Notice`, with
      content, links and CTA unchanged.

- [ ] **Step 4: Run to verify pass.** Also run the full mail-free Playwright run
      including axe, `npx vitest run`, typecheck and lint.

- [ ] **Step 5: Commit:** "Continue the path on the confirmation page and on
      /aufnahme".

### Task 8: Verification and build review (controller)

- [ ] **Step 1: Run everything mail-free.**
  - `npx vitest run`, lint, typecheck.
  - All Playwright specs with the NO MAIL `--grep-invert`.
- [ ] **Step 2: Build review by an independent agent.**
  - Screenshots at 320, 375, 1024 and 1280 of:
    - the form (empty, error, filled section 1, unticked address, further
      guardian open);
    - the confirmation page;
    - `/aufnahme`;
    - a page with the newsletter.
  - A keyboard pass.
  - A design-critique and accessibility review against the spec and the mockups.
- [ ] **Step 3:** One fix wave for the findings, then a scoped re-review.
- [ ] **Step 4:** A whole-branch final review of the Lernpfad range.
- [ ] **Step 5:** Ferdinand reviews the result. The submitting tests run exactly
      once before the push, only with his OK.
