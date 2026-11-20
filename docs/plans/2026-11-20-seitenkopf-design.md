# Seitenkopf — design

## Intent

The large pale page title is a typographic accent, not the reader's
orientation: the navigation shows where the reader is. Ferdinand wants it to
read as a deliberate accent, ideally vertical beside the text column, as it
once was. On wide screens the left navigation also lacks a marker for the
current page. Agreed in the demo (https://claude.ai/artifact/XjZc2sqKZDRSrg1oYYE92H):
"Vertikal" for the title and "Strich" for the marker.

## Goals

1. **Title from 1160px (`xl`):** the page title runs vertically, bottom to top,
   at the right edge of the navigation column, top-aligned with the text and
   sticky with the navigation. Museo Sans Condensed bold, muted, about 30%
   opacity, `min(5rem, 9vh)` so long titles ("Die Walz kennenlernen", 8.7em
   tall) fit a 720px-high window.
2. **Title below 1160px:** horizontal as today, slightly darker (opacity 20% →
   40%).
3. **Current page in the left navigation from 1160px:** a 3px orange bar left of
   the link text, like the rail's mark for the current section. Below 1160px the
   existing underline stays.
4. **Intro on Über uns:** no automatic hyphenation, lines at most 36rem,
   `text-wrap: pretty` (Ferdinand: "Ohne Trennung").
5. **Phone:** 32px instead of 16px between the logo row and the page below
   600px (root `gap-y-4` → `gap-y-8`).

## Non-goals

- No change to the root layout grid. Measured at 1160px: the header column is
  248px wide, logo and labels end at 128px, so the 80px-wide title fits in the
  remaining 120px without taking width from the text.
- No change to the navigation's three forms.

## Anti-goals

- The page must keep exactly one visible-to-assistive-tech `h1` with the page
  title at every width: from `xl` the `h1` is visually hidden (`sr-only`), the
  vertical title is `aria-hidden`.
- A page without the accent title (home, Rundgang, Jahrgang, Termin, Beitrag,
  Beiträge, Aufnahme-Formular) shows no vertical title.

## Approaches

- **A. Title in the root header, read from the route (chosen).** Each page names
  its title once in its route `handle`; a shared `PageTitle` renders the `h1`
  from it, and the root header renders the vertical copy. It rides the header's
  existing sticky positioning and needs no grid change.
- B. A new spine column in the root grid, as in the demo. Rejected: at 1160px it
  would cut the text column from 568px to under 470px, and every page relies on
  the root grid.
- C. Make the page's own `h1` sticky and shift it left. Rejected: inside
  `PageHead` its sticky range ends with the page head, so it would not follow
  the reader.

## Decided details

- The Philosophie sub-pages' own invisible rotated "Über uns" `h1` is removed;
  their route names "Über uns" so they get the same vertical title from `xl`.
  Below `xl` they keep their current head (no extra large title).
- The 13 copies of the pale-title class string collapse into `PageTitle`.
- Branch `claude/walz-seitenkopf` builds on PR #155 (it uses `PageHead`).

## Left to the builder

- Name and shape of the route handle field and the hook that reads it; the hook
  is unit-tested (title shown, none when no route names one, deepest route wins).
