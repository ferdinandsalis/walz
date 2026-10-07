# Lernpfad Design Vocabulary

## Overview

The rebuilt admission form works, but its look is plain. This spec gives the
site a richer, reusable design vocabulary called **Lernpfad**. The admission
pages adopt it first: `/aufnahme/formular`, `/aufnahme/formular/danke` and
`/aufnahme`.

**The idea.** The Walz logo's spiral is titled "Walz Lernpfad". The form becomes
the first stretch of that path:

- a rail runs down the form, with a node per section;
- a filled node marks a finished section;
- the same rail carries on into "So geht es weiter" on the confirmation page and
  on `/aufnahme`.

Parents see how far they are and what happens after sending, which is what
drives abandonment.

This spec extends the form spec
(`docs/plans/2026-10-07-aufnahmeformular-redesign-design.md`). Everything
approved there stays:

- fields, order, copy;
- errors and the error summary behaviour;
- autofill;
- show/hide without JavaScript;
- accessibility rules.

Only the visual layer and three placements change.

## Decisions

| Topic                   | Decision                                                                                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Direction               | A "Lernpfad" from the design exploration (B "Mappe" and C "Plakat" rejected)                                                                            |
| Scope                   | Form, confirmation page, `/aufnahme` (steps + info boxes), and a section map beside the form on wide screens                                            |
| Section state on nodes  | Exact: computed from `parseAufnahmeForm`, the same rules the submit uses. Before hydration and without JavaScript it reflects the submitted values only |
| Brand colours and fonts | Unchanged. New tints and shades are derived from them; the orange button stays orange                                                                   |
| Spiral                  | Not used as an ornament (no seal, no spiral marks); the rail and nodes carry the idea                                                                   |
| Submit label            | "Anmeldung absenden" at 20px bold condensed, which counts as large text and passes 3:1 on orange (measured 3.23). Form only                             |
| Other site pages        | Not touched in this branch                                                                                                                              |

## Visual reference

The mockups and screenshots live in `.superpowers/sdd/design-exploration/`. That
folder is git-ignored and serves as a local reference only; this spec is the
binding text.

- `lernpfad.html` (open with `?state=progress`, `?state=error` or
  `?page=danke`).
- `shots/lernpfad-375-*.png` and `shots/lernpfad-1280-*.png`.

Where a mockup and this spec disagree, the spec wins. The mockups still show:

- the old intro sentence;
- the spiral seal and marks;
- a "current" fill and outlined circles in the section map.

None of these ship.

## Tokens

All tokens go into the `@theme` block of `app/styles/app.css` as literal `hsl()`
values. Unlike the themeable `:root` channels, these tints have no dark-mode
variant.

**Brand tints and shades.** Derived from the brand colours, never replacing
them:

```css
--color-primary-50: hsl(15 90% 97%); /* surface: checked, selected */
--color-primary-100: hsl(15 88% 93%); /* ornament */
--color-primary-200: hsl(15 85% 84%); /* rail, decorative lines */
--color-primary-700: hsl(
  15 85% 38%
); /* small orange text, focus outline, 6.0:1 */
--color-primary-800: hsl(15 80% 30%); /* numbers in nodes, 8.5:1 */
--color-secondary-50: hsl(198 76% 96%); /* notice surface */
--color-secondary-200: hsl(198 70% 80%); /* decorative only */
--color-secondary-700: hsl(198 90% 28%); /* blue icons, 6.8:1 */
--color-secondary-800: hsl(198 85% 22%); /* blue headings and titles, 9.5:1 */
--color-danger-50: hsl(345 80% 97%); /* invalid input fill */
```

**Lernpfad tokens:**

```css
--color-path: var(--color-primary-200);
--color-path-done: var(--color-primary);
--spacing-path: 2.5rem; /* content indent from the rail, phone */
--spacing-path-wide: 3.5rem; /* from the sm breakpoint (600px) */
--radius-choice: 0.75rem;
--inset-shadow-field: inset 0 1px 2px hsl(15 20% 40% / 0.08);
--animate-path-draw: path-draw 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s both;
@keyframes path-draw {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}
```

Every new class group gets registered in `app/utils/extended-theme.ts`, so
`cn()` (tailwind-merge) resolves conflicts with built-in classes: colours,
spacing, radius, inset shadow and animation.

**Usage rules.** These go as a comment above the tokens:

- Blue is decoration: edges, washes, numerals.
- Blue text uses `secondary-700` or `-800`.
- Small orange text uses `primary-700` or `-800`.
- White text on orange only at 18.66px bold or larger.
- The `-50` tints are surfaces, never text.

## Shared control rules

**`Input` only:**

- Height 48px (`h-12`). Today it is 40px.
- `Textarea` keeps its row-based height.

**`Input` and `Textarea`:**

- **Focus:** a 2px `primary-700` outline at 2px offset
  (`focus-visible:outline-2 outline-offset-2`). It replaces today's blue-grey
  ring. The border is untouched by focus, so it keeps showing the state (grey or
  invalid), and nothing changes width on focus.
- **Invalid:** keeps today's 2px `border-input-invalid` border and adds a
  `danger-50` fill. The error icon and text stay above the input.
- **Inner shadow:** `inset-shadow-field`.

**Contrast:**

- The focus outline is 5.6:1 or more against the page and the tints.
- The input border stays at 3:1 or more against white, `primary-50` and
  `secondary-50`.

**Usages:** `Input` and `Textarea` appear only in `formular.tsx` and
`newsletter.tsx`. The newsletter field (on most pages, including the
confirmation page) inherits the focus and shadow; check it in the screenshots.

## Components

All components live in `app/components/ui/`.

The rail, nodes, waypoints and dots are decoration (`aria-hidden`). This is
intended:

- The `done` and `optional` states, and the section numbers, exist only
  visually. Screen-reader users get completeness from the fields and the error
  summary, as today.
- Hiding the node changes a section's accessible group name from "1 Ihre
  Angaben" to "Ihre Angaben".
- `attention` is not colour-only: its node shows a "!" glyph, as `done` shows a
  tick.

### `PathRail`, `PathNode`, `Waypoint` (`path.tsx`)

**`PathRail`** wraps content and draws a 2px `--color-path` line down its left
edge.

- The content is indented `--spacing-path` (phone) or `--spacing-path-wide` (sm
  and up).
- Nodes sit centred on the rail.
- A `dashed` prop draws the line dashed.

**`PathNode`** is a 32px circle with a condensed number.

- A ring in the colour of the surface behind it makes the rail seem to pass
  behind the node. The ring colour is a CSS variable (`--path-gap`), set by each
  surface: the page background, the `bg-muted/30` panel, the white summary.
- **States:**

  | State       | Look                                  |
  | ----------- | ------------------------------------- |
  | `open`      | orange ring, `primary-800` number     |
  | `done`      | filled `primary` with a white tick    |
  | `attention` | danger ring on `danger-50` with a "!" |
  | `optional`  | dashed ring, `primary-800` number     |

**`Waypoint`** is a 10px filled `--color-path` dot beside a sub-heading on the
rail ("Wohnadresse", "Schule").

Non-interactive markers are always filled, smaller or numbered, never outlined
like a radio button.

### `StepsPath` (`steps-path.tsx`)

`AUFNAHME_STEPS` drawn on a `PathRail`. It is an ordered list (`<ol>`) under the
existing "So geht es weiter" heading, with the list labelled by that heading.

| Variant   | Where                   | Markers                         | Text                  | Done state | Rail                                      |
| --------- | ----------------------- | ------------------------------- | --------------------- | ---------- | ----------------------------------------- |
| `compact` | Form intro, `/aufnahme` | 12px filled `--color-path` dots | Titles only           | None       | Dashed throughout: everything lies ahead  |
| `full`    | Confirmation page       | 32px `PathNode`s                | Titles + descriptions | Step 1     | Solid from step 1 to step 2, dashed after |

**`full` details:**

- Step 2 is `open` and steps 3–4 use filled 12px dots.
- The sr-only "Erledigt: " prefix of step 1 sits in the list item's text,
  outside the `aria-hidden` node.
- The solid segment draws in once with
  `motion-safe:animate-path-draw origin-top`. Under `prefers-reduced-motion` it
  is static.

### `ChoiceCard` and `ChoiceList` (`choice.tsx`)

**`ChoiceCard`** wraps one native 20px checkbox.

- **Label:** fills the whole row (48px or more), so the full row is the hit
  target.
- **Hint:** stays outside the `<label>`, linked by `aria-describedby` as today,
  so it is not read twice.
- **Shape:** border `border-border`, radius `--radius-choice`.
- **Checked:** `:has(:checked)` gives `border-primary bg-primary-50`.
- **Focus:** `:has(:focus-visible)` draws the `primary-700` outline around the
  card.
- **Use:** both "Wohnt an Ihrer Adresse" boxes.

**`ChoiceList`** is a grouped list of native radio rows with dividers, used for
"Wie haben Sie von der Walz erfahren?".

- Each row is 48px or taller, and its label fills it.
- The checked row is tinted `primary-50`.
- The list keeps the `group/source` wrapper, so "Woher genau?" stays directly
  under "Anderes" and is still revealed by CSS.

Native controls stay native: no `appearance: none`. Ids, names, `defaultChecked`
logic and `aria` wiring stay as they are.

### `Notice` (`notice.tsx`)

A `bg-secondary-50` panel with a `secondary-700` Phosphor icon, `rounded-md` and
padding.

- **Title:** optional. It takes a heading level (`as="h2"`/`"h3"`) and is
  coloured `secondary-800`.
- **Uses:**
  - the form's privacy note (lock icon, no title);
  - "Für Ihr Kind bis zum Gespräch" on the confirmation page, which stays a
    heading;
  - the two info boxes on `/aufnahme` (`AdmissionDay`, `LateralEntryBox`), which
    keep their content, links and CTA.

### `SectionMap` (`section-map.tsx`)

A `nav` with `aria-label="Abschnitte"`, listing the four form sections as links
on a mini-rail, each with its `PathNode` state.

- No scroll-spy and no "current" highlight.
- No steps tail, because the steps already appear in the intro.
- Links jump to the section fieldsets, which get the ids `abschnitt-1` …
  `abschnitt-4`.

**Placement:**

- It sits in the site's right column from the `lg` breakpoint, where the root
  grid in `app/root.tsx` gains its 320px column.
- It comes after the form in the DOM and is hidden below `lg`.
- Classes: `hidden lg:block lg:sticky lg:top-4 lg:col-start-2 lg:row-start-1`.
- The form route moves to the subgrid layout `/aufnahme` uses
  (`grid grid-cols-subgrid lg:col-span-2`), with the form in the first column.
- The panel uses the `bg-muted/30 rounded-md p-6` styling of the `Toc` on
  `/aufnahme`.
- **Check:** at 896–1160px (`lg`) as well as at 1280.

### Error summary, grouped

The summary keeps everything it has today:

- the count heading;
- focus on each new result (`tabIndex=-1`);
- the `href` fallback;
- page order;
- the mail-failure variant.

**Changes:**

- The entries are grouped by section.
- A group is a list item holding a non-heading label (the section title as plain
  text) and a nested `<ul>` of links.
- Errors whose key maps to no section go into a trailing group without a label.
- One shared `sectionOf()` decides the grouping, the same function
  `sectionStatus` uses.

## Section state

Two new functions in `app/utils/aufnahme-form.ts`:

```ts
export type SectionKey = 'parent1' | 'student' | 'parent2' | 'final'
export type SectionStatus = 'open' | 'done' | 'attention' | 'optional'
export function sectionOf(fieldOrErrorKey: string): SectionKey | undefined
export function sectionStatus(
  section: SectionKey,
  values: Record<string, string>,
  shownErrors: Record<string, string>,
): SectionStatus
```

**`sectionOf`** maps by name prefix, plus explicit entries:

| Key                                                         | Section     |
| ----------------------------------------------------------- | ----------- |
| `parent1*`                                                  | `parent1`   |
| `student*`, including the date error key `studentBirthdate` | `student`   |
| `currentGrade`, `schoolHistory`                             | `student`   |
| `parent2*`                                                  | `parent2`   |
| `source`, `sourceOther`                                     | `final`     |
| anything else                                               | `undefined` |

**`sectionStatus`** applies these rules in order; the first match wins:

1. **`attention`** when any key in `shownErrors` maps to the section.
2. **`done`:**
   - for `parent1` and `student`, when `parseAufnahmeForm(values)` reports no
     error that maps to the section;
   - for `parent2`, when `hasParent2Data(values)` is true and there is no such
     error.
3. **`optional`** for `parent2` when `hasParent2Data(values)` is false.
4. **`open`** otherwise.

`final` is only ever `open` or `attention`. It holds the submit, so it is never
shown as skippable or done.

**On the page.** The status is computed during render:
`sectionStatus(key, liveValues ?? actionData?.values ?? {}, shownErrors)`.

- **`liveValues`** is `null` on the server and until hydration. After hydration,
  the form reads `formValues(form)` once on mount, which picks up restored and
  autofilled values, and then again on `input` and `change`.
- **Server and first client render** therefore match. Without JavaScript, the
  nodes reflect the last submitted values, so an empty form shows open, open,
  optional, open.
- **Where it shows:** the form rail and the `SectionMap` show the same status.
  The section-3 legend's node carries the parent-2 status; the `<details>`
  summary gets no node of its own.
- **No live announcements** are added.

## Placement

### Form (`/aufnahme/formular`)

- **Intro:** a `compact` `StepsPath` under "So geht es weiter" replaces today's
  box.
- **Sections:** each section fieldset sits on one continuous `PathRail`.
  - The legend stays the fieldset's first child, and its numbered circle becomes
    a `PathNode`.
  - The sub-headings "Wohnadresse" and "Schule" get a `Waypoint`.
- **Choices:** both "Wohnt an Ihrer Adresse" boxes become `ChoiceCard`s, and the
  source radios become a `ChoiceList`.
- **Privacy note:** a `Notice`.
- **Submit:** "Anmeldung absenden" at 20px bold condensed. The rail ends in a
  filled 12px dot beside the button.
- **Date row:** wraps (`flex-wrap`), so it fits the 248px content width at
  320px.
- **Right column at `lg` and up:** `SectionMap`.
- **First screen:** `tests/aufnahme-layout.spec.ts` keeps passing, with the
  first input's bottom at or above 635px at 375×635. Re-measure, because `h-12`
  adds 8px.

### Confirmation page (`/aufnahme/formular/danke`)

- The h1 keeps its focus-on-mount. There is no seal.
- **Steps:** a `full` `StepsPath`, with step 1 done and the one draw-in
  animation.
- **"Für Ihr Kind bis zum Gespräch":** a `Notice` with an `h2` title.
- **Mail links:** stay.

### `/aufnahme`

- **Vorgehensweise:** the prose stays unchanged (it addresses the child with
  "du"). A `compact` `StepsPath` follows it; the step titles are
  address-neutral.
- **Info boxes:** `AdmissionDay` and `LateralEntryBox` become `Notice`s, with
  their content, links and CTA unchanged.

## Accessibility

- **Kept from the form:**
  - every legend stays the fieldset's first child;
  - `noValidate` with `required` stays;
  - native controls;
  - `section-*` autofill tokens and `off` on the child fields;
  - the 44px touch-target tests;
  - the outline test on the privacy link and the submit button;
  - the confirmation h1 focus.
- **Decoration** is `aria-hidden`: rail, nodes, waypoints, dots and the draw-in
  segment.
- **Reflow:** at 320px and at 200% zoom nothing overflows horizontally, and long
  legends ("Weitere erziehungsberechtigte Person (optional)") wrap beside the
  node.
- **Motion:** one animation only, `motion-safe`.
- **Checks:** the axe scans stay green. Contrast is checked by hand against the
  usage rules, because the scans skip `color-contrast` by the owner's decision.
- **No mail:** e2e runs stay mail-free.

## Testing

**Unit (Vitest):**

- `sectionOf`: every prefix, the explicit keys, `studentBirthdate`, and an
  unknown key.
- `sectionStatus`, covering each section and state:
  - the empty form;
  - an invalid date;
  - a ticked or unticked address box;
  - a hidden `sourceOther`;
  - parent 2 given or absent;
  - `final` never returning `done` or `optional`.
- Static-markup tests:
  - `PathNode` (states and glyphs);
  - `ChoiceCard` (native input kept, hint outside the label, wiring kept);
  - `Notice` (heading level);
  - `StepsPath` (list semantics, step-1 "Erledigt" outside `aria-hidden`);
  - the grouped summary (no extra headings, the trailing group).
- **Tailwind merge:** `cn()` resolves the new token classes against built-in
  ones (e.g. `inset-shadow-field` and `shadow-md` both survive, while
  `rounded-choice` vs `rounded-lg` keeps the later one).

**E2E, mail-free only:**

- After filling section 1 (hydrated), its node turns `done`.
- After an empty submit, sections 1 and 2 show `attention` and sections 3 and 4
  do not, with JavaScript and without it.
- The `ChoiceCard` tint follows the checkbox without JavaScript.
- At 1280px the `SectionMap` links jump to the sections; at 375px the map is
  hidden.
- At 320px nothing scrolls horizontally on the form, the confirmation page and
  `/aufnahme`.
- The first-screen test holds.
- The confirmation page shows the `full` steps.
- `/aufnahme` shows the compact steps and both notices.
- The existing e2e and axe tests stay green.

**Build review:**

- Screenshots at 320, 375, 1024 and 1280 of every changed page and state,
  compared against the Lernpfad mockups (minus the dropped spiral).
- A keyboard pass.
- An independent design and accessibility review, then a revision, then
  Ferdinand's review.

## Copy needing sign-off

- `aria-label="Abschnitte"` on the `SectionMap` (screen readers only).
- No visible copy changes.

## Out of scope

- A path on `/curriculum`.
- Replacing the `Toc` site-wide.
- Any spiral ornament.
- Brand-colour changes.
- Site-wide `Button` label sizes.
- Fixing blue headings and orange small text elsewhere.
- Echoing the parent's address inside the "Wohnt an Ihrer Adresse" card.
