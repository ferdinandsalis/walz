# Lernpfad Design Vocabulary

## Overview

The rebuilt admission form works, but its look is plain. This spec gives the
site a richer, reusable design vocabulary called **Lernpfad**. The admission
pages adopt it first: `/aufnahme/formular`, `/aufnahme/formular/danke` and
`/aufnahme`.

**The idea.** The Walz logo's spiral is titled "Walz Lernpfad" in
`app/components/brand.tsx`. The form becomes the first stretch of that path:

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
- errors and the error summary;
- autofill;
- show/hide without JavaScript;
- accessibility rules.

Only the visual layer and three placements change.

## Decisions

| Topic                   | Decision                                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| Direction               | A "Lernpfad" from the design exploration (B "Mappe" and C "Plakat" rejected)                                 |
| Scope                   | Form, confirmation page, `/aufnahme` (steps + info boxes), and a section map beside the form on wide screens |
| "Done" node             | Exact: computed from `parseAufnahmeForm` per section once hydrated; without JavaScript, plain numbered nodes |
| Brand colours and fonts | Unchanged. New tints and shades are derived from them; the orange button stays orange                        |
| Submit label            | "Anmeldung absenden" at 20px bold condensed, which counts as large text and passes 3:1 on orange. Form only  |
| Other site pages        | Not touched in this branch (curriculum path, site-wide TOC and contrast fixes are follow-ups)                |

## Visual reference

The mockups and screenshots live in `.superpowers/sdd/design-exploration/`. That
folder is git-ignored and serves as a local reference only; this spec is the
binding text.

- `lernpfad.html` (open with `?state=progress`, `?state=error` or
  `?page=danke`).
- `shots/lernpfad-375-*.png` and `shots/lernpfad-1280-*.png`.
- `proposal.md` §2–3 and §8.

Where a mockup and this spec disagree, the spec wins. The mockups still show the
old intro sentence.

## Tokens

All tokens go into the `@theme` block of `app/styles/app.css`.

**Brand tints and shades.** Derived from the brand colours, never replacing
them:

```css
--color-primary-50: hsl(15 90% 97%); /* surface: checked, selected */
--color-primary-100: hsl(15 88% 93%); /* focus halo, ornament */
--color-primary-200: hsl(15 85% 84%); /* rail, decorative lines */
--color-primary-700: hsl(15 85% 38%); /* small orange text, 6.0:1 */
--color-primary-800: hsl(15 80% 30%); /* numbers in nodes, 8.5:1 */
--color-secondary-50: hsl(198 76% 96%); /* notice surface */
--color-secondary-100: hsl(198 72% 90%);
--color-secondary-200: hsl(198 70% 80%); /* decorative only */
--color-secondary-700: hsl(198 90% 28%); /* blue text and icons, 6.8:1 */
--color-secondary-800: hsl(198 85% 22%); /* blue headings, 9.5:1 */
--color-danger-50: hsl(345 80% 97%); /* invalid input fill */
```

**Lernpfad tokens:**

```css
--color-path: var(--color-primary-200);
--color-path-done: var(--color-primary);
--spacing-path: 2.5rem; /* content indent from the rail, phone */
--spacing-path-wide: 3.5rem; /* from the sm breakpoint (600px) */
--radius-choice: 0.75rem;
--shadow-field: inset 0 1px 2px hsl(15 20% 40% / 0.08);
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

**Usage rules.** These go as a comment above the tokens, because without them
the tints get misused:

- Blue is decoration: edges, washes, numerals.
- Blue text uses `secondary-700` or `-800`.
- Small orange text uses `primary-700` or `-800`.
- White text on orange only at 18.66px bold or larger.
- The `-50` tints are surfaces, never text.

## Shared control rules

These apply site-wide through `Input` and `Textarea`.

- **Height:** 48px (`h-12`). Today it is 40px.
- **Focus:** 2px `primary` border plus a 4px `primary-100` halo, never blue. It
  replaces the blue-grey ring on these two controls only. `Button` keeps its own
  focus treatment, and the form's local focus outline on the submit button
  stays.
- **Invalid:** 2px `foreground-danger` border plus a `danger-50` fill. The error
  icon and text stay above the input, as today.
- **Inner shadow:** `--shadow-field`.

Contrast:

- The input border stays at 3:1 or more against white, `primary-50` and
  `secondary-50` (measured: 3.41 on the tints).
- The newsletter input inherits all of this. Check it in the screenshots.

## Components

All components live in `app/components/ui/`, one file each unless noted. Every
ornament is `aria-hidden`, and every state an ornament shows also exists as
text.

### `PathRail` and `PathNode` (`path.tsx`)

**`PathRail`** wraps content and draws a 2px `--color-path` line down its left
edge.

- The content is indented `--spacing-path` (phone) or `--spacing-path-wide` (sm
  and up).
- The rail is a pseudo-element or an `aria-hidden` span; no text lives in it.
- The rail is solid by default. A `dashed` prop draws it dashed, which is used
  after the current step in `StepsPath`.

**`PathNode`** is a 32px circle on the rail.

- It shows a condensed number and has a `ring-4 ring-background`, so the rail
  seems to pass behind it.
- **States:**

  | State       | Look                                    |
  | ----------- | --------------------------------------- |
  | `open`      | orange ring, `primary-800` number       |
  | `done`      | filled `primary` with a white tick icon |
  | `attention` | danger ring on a `danger-50` fill       |
  | `optional`  | dashed ring                             |

- The node is `aria-hidden`. The section title in the legend carries the
  meaning.

**`Waypoint`** is a 10px `--color-path` dot beside a sub-heading on the rail
("Wohnadresse", "Schule").

### `StepsPath` (`steps-path.tsx`)

`AUFNAHME_STEPS` drawn on a `PathRail`, in two sizes:

- **`compact`:** 12px filled dots (never outlined circles, which read as radio
  buttons) and titles only. Used in the form intro and on `/aufnahme`.
- **`full`:** 32px `PathNode`s, each with its title and description. Used on the
  confirmation page. Step 1 is `done`.

The rail is solid up to the current step and dashed after it. On the
confirmation page the segment from step 1 to step 2 draws in once with
`animate-path-draw`; under `prefers-reduced-motion` it is static.

The markup is an ordered list (`<ol>`). On the confirmation page, step 1 keeps
the sr-only "Erledigt: " prefix it has today.

### `SpiralMark` (`spiral-mark.tsx`)

The logo spiral as a standalone inline SVG, `aria-hidden`. It reuses the path
data from `brand.tsx`; extract it there instead of copying it. It has three
uses:

- a filled node at the end of the form's rail, beside the submit button;
- the seal above the confirmation h1;
- a large `primary-100` crop in the section map panel on wide screens.

### `ChoiceCard` and `ChoiceList` (`choice.tsx`)

**`ChoiceCard`** wraps one native 20px checkbox and its label and hint.

- The row is 48px or taller, with border `border-border` and radius
  `--radius-choice`.
- When checked, the CSS `:has(:checked)` gives it
  `border-primary bg-primary-50`. No JavaScript is involved.
- It is used for both "Wohnt an Ihrer Adresse" boxes.

**`ChoiceList`** is a grouped list of native radio rows with dividers.

- Each row is 48px or taller, and the checked row is tinted `primary-50`.
- It is used for "Wie haben Sie von der Walz erfahren?".
- "Woher genau?" stays directly under "Anderes" and is revealed by CSS, as
  today.

Native controls stay native: no `appearance: none`. Both components keep the
ids, names, `defaultChecked` logic and `aria` wiring the form already has.

### `Notice` (`notice.tsx`)

A `bg-secondary-50` panel with a `secondary-700` Phosphor icon, `rounded-md` and
padding. It takes an optional title. It is used for:

- the form's privacy note;
- the "Für Ihr Kind bis zum Gespräch" box on the confirmation page;
- the two info boxes on `/aufnahme` (`AdmissionDay`, `LateralEntryBox`).

The info boxes keep their content, links and CTA button.

### `SectionMap` (`section-map.tsx`)

A sticky panel in the site's right column, shown from the `lg` breakpoint, where
the root grid in `app/root.tsx` gains its 320px column. It uses the same sticky
`bg-muted/30` panel styling as the `Toc` on `/aufnahme`. The form route moves to
the subgrid layout that `/aufnahme` already uses, so the panel can sit in that
column. It renders:

- a `nav` with `aria-label="Abschnitte"`;
- the four form sections as links on a mini-rail, each with its `PathNode` state
  (the same states as in the form);
- a `SpiralMark` node labelled "Anmeldung absenden";
- the remaining steps after it as a dashed `StepsPath` (titles only).

Section links jump to the section legend. The map is hidden below the right
column's breakpoint, where the form's own rail does the job.

### Error summary, grouped

The summary keeps its heading, focus behaviour and links. Its entries are
grouped under each section's node and title, so the list doesn't read as broken
numbering. Each group heading is the existing section title. Entry order stays
page order.

## The "done" state

**`sectionStatus`** is a new function in `app/utils/aufnahme-form.ts`:

```ts
export type SectionKey = 'parent1' | 'student' | 'parent2' | 'final'
export type SectionStatus = 'open' | 'done' | 'attention' | 'optional'
export function sectionStatus(
  section: SectionKey,
  values: Record<string, string>,
  shownErrors: ReadonlySet<string>,
): SectionStatus
```

- **Field to section mapping:**
  - `parent1*` belongs to `parent1`;
  - `student*`, `currentGrade` and `schoolHistory` belong to `student`;
  - `parent2*` belongs to `parent2`;
  - `source` and `sourceOther` belong to `final`.

  The mapping is derived from `AUFNAHME_FIELD_NAMES`, not from a second list.

- **`attention`** applies when any field of the section has a shown error,
  whether from the server or a live check.
- **`done` for `parent1` and `student`** applies when
  `parseAufnahmeForm(values)` reports no error for any field of the section.
- **`parent2`:**
  - `optional` when `hasParent2Data(values)` is false;
  - otherwise `done` once it has no parse error, else `open`.
- **`final`:**
  - `optional` while no source is chosen;
  - `done` once one is chosen and `sourceOther` (when relevant) has no error.
- **Otherwise** the status is `open`.

**On the page:**

- The form computes the status from the live form values on `input` and
  `change`, reusing the existing `formValues` handler path. It only does this
  after hydration.
- Without JavaScript, and before hydration, every required section renders
  `open` and the optional ones `optional`.
- The form rail and the `SectionMap` show the same status.
- The node is decoration. A screen-reader user gets section completeness from
  the fields and the error summary, as today. No live announcements are added.

## Placement

### Form (`/aufnahme/formular`)

- **Intro:** a compact `StepsPath` replaces today's "So geht es weiter" box.
- **Sections:** each section's fieldset sits on one continuous `PathRail`.
  - The numbered legend circle becomes a `PathNode` with the computed state.
  - The sub-headings "Wohnadresse" and "Schule" get a `Waypoint`.
  - The further-guardian `<details>` uses the `optional` node.
- **Choices:** "Wohnt an Ihrer Adresse" (both) becomes a `ChoiceCard`, and the
  source radios become a `ChoiceList`.
- **Privacy note:** becomes a `Notice` with the lock icon.
- **Submit:** "Anmeldung absenden" at 20px bold condensed. The rail ends in a
  `SpiralMark` node beside the button.
- **Right column on wide screens:** `SectionMap`.
- **First screen:** the first input must still end at or above 624px at 375×650.
  The existing layout test guards this; with the compact steps the mockup
  measured 620px at 812, so re-measure.

### Confirmation page (`/aufnahme/formular/danke`)

- A `SpiralMark` seal sits above the h1, which keeps its focus-on-mount.
- The steps become a `full` `StepsPath`, with step 1 `done` and the draw-in
  animation.
- The "Für Ihr Kind" box becomes a `Notice`.
- The mail links stay.

### `/aufnahme`

- **Vorgehensweise:** the prose stays unchanged (it addresses the child with
  "du"). A compact `StepsPath` follows it; the step titles are address-neutral.
- **Info boxes:** `AdmissionDay` and `LateralEntryBox` become `Notice`s, with
  their content, links and CTA unchanged.

## Accessibility

- Every legend stays the first child of its fieldset.
- All ornaments are `aria-hidden`:
  - rail, nodes, waypoints, dots;
  - spiral;
  - draw-in segment.
- Non-interactive markers must look different from controls: they are filled,
  smaller, or numbered.
- **Reflow.** At 320px and at 200% zoom:
  - nothing overflows horizontally;
  - long legends ("Weitere erziehungsberechtigte Person (optional)") wrap beside
    the node.
- **Motion:** one animation only, and none under `prefers-reduced-motion`.
- **Checks:** the axe scans stay green. Contrast is checked by hand against the
  usage rules above, because the scans skip `color-contrast` by the owner's
  decision.
- **No mail:** the no-mail rule for e2e runs stands.

## Testing

- **Unit (Vitest):**
  - `sectionStatus`: every state for every section, including a ticked address
    box and a hidden `sourceOther`.
  - Static-markup tests for `PathNode` states, `ChoiceCard` (native input kept,
    wiring kept), `Notice`, and the `StepsPath` list semantics and step-1
    "Erledigt".
- **E2E, mail-free only:**
  - the section-1 node turns `done` after filling section 1 (hydrated);
  - a section with a shown error shows `attention`;
  - the `ChoiceCard` tint follows the checkbox without JavaScript;
  - `SectionMap` links jump to the sections at 1280px and the map is hidden at
    375px;
  - the first-screen bound holds;
  - the confirmation page shows the `full` steps;
  - `/aufnahme` shows the compact steps and both notices.
  - The existing e2e and axe tests stay green.
- **Build review:** screenshots at 320, 375 and 1280 of every changed page and
  state, compared against the Lernpfad mockups, plus a keyboard pass. Then an
  independent design and accessibility review, a revision, and a review by
  Ferdinand.

## Copy needing sign-off

- `aria-label="Abschnitte"` on the `SectionMap` (screen readers only).
- No visible copy changes.

## Out of scope

- A path on `/curriculum`.
- Replacing the `Toc` site-wide.
- Brand-colour changes.
- Site-wide `Button` label sizes.
- Fixing blue headings and orange small text elsewhere (proposal §10).
- Echoing the parent's address inside the "Wohnt an Ihrer Adresse" card.
