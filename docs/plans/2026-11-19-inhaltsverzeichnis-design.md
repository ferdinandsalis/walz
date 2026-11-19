# Inhaltsverzeichnis — design

## Intent

Ferdinand wants the site's typography and whitespace to look right at whatever
size a reader's window happens to be, from a phone to a wide desktop. The table
of contents (the "Inhalt" box on Über uns, Aktuelles, Aufnahme and Alumni) is
an essential part of those pages, because each one gathers several sub-pages:
a reader should see at once what is on the page and get to any part quickly.
Today it takes space at the wrong moments and gives nothing back while reading:

- Below 1024px the grey box sits *above* the page title and, on a phone, fills
  most of the first screen together with the menu button; once scrolled past
  it is gone.
- From 1024px it sticks in the right column as a grey box but never shows
  where the reader is.

The agreed look comes from the demo
(https://claude.ai/artifact/2DUQmdpA4YwtvuGp2QY8rd, variant B, version 2).

## Goals

One `Toc` behaviour shared by the four pages, changing with available width:

1. **Phone (below 700px):** directly under the page title, a "Auf dieser Seite"
   label and the sections as a two-column list (one column when names do not
   fit), each row at least 48px tall, separated by hairlines, a small orange dot
   as bullet. No box.
2. **Middle (700–1023px):** the same list in a narrow column (about 12rem) to
   the right of the page head, separated from it by a thin vertical line; one
   section per row, no row hairlines. The page head is the title plus, where the
   page has one, its intro text (only Über uns has an intro today; on the
   others the list sits beside the title).
3. **Floating button (below 1024px):** once the in-flow list has scrolled out of
   view, a dark pill appears centred at the bottom of the screen: list icon,
   "INHALT", the name of the current section, and a chevron. Tapping it opens a
   small white panel above it with all sections (current one in orange with a
   dot) and "↑ Nach oben". Choosing a link, tapping outside or Escape closes
   it. The pill hides again when the in-flow list comes back into view. It
   clears the phone's bottom safe area.
4. **Wide (1024px and up):** in the existing right column, sticky near the top,
   without box or background: the label, then the sections on a thin vertical
   track; the current section is dark and bold with an orange segment on the
   track, the others muted. After the first screen, "↑ Nach oben" fades in
   under the list.
5. **Current section:** the last section whose top has passed a line 40% down
   the viewport; before the first section, the first one.
6. **Hover on in-flow list items:** the dot stretches downwards into a short
   line, hinting that the link jumps further down the page. No motion with
   `prefers-reduced-motion`.

## Non-goals

- No change to the main navigation (its three forms stay; the active-page
  marker in the left navigation is a later step together with other navigation
  work).
- No change to the root layout grid in `app/root.tsx`; many other pages use
  the right column too.
- No sub-section entries (e.g. "Mentor:innen" under "Menschen").
- No change to the existing `BackToTop` component or where it is used.
- No change to the large pale page title. It is a typographic accent rather
  than the reader's orientation (the navigation shows the current page). It
  originally ran vertically beside the content column; bringing that back is
  explored separately in the demo, together with the navigation. The demo's
  solid dark title is not part of this change.

## Anti-goals

- The TOC must never push the page title down or cover running text while
  reading.
- No layout shift on hydration: the server-rendered page shows the in-flow list
  and the rail exactly as they end up; only the pill (hidden at first) and the
  current-section marking depend on JavaScript.
- Links keep working without JavaScript (plain `#anchor` links).

## Approaches

- **A. In-flow list + floating pill + quiet rail (chosen).** The list shows
  what is on the page right where the page starts, costs nothing while reading
  on small screens, and the rail uses the space that wide screens already have.
  Tested in the demo at 390, 820, 1100 and 1440px.
- B. Sticky TOC at every width (a bar under the header on small screens).
  Always reachable, but takes height permanently on a phone. Rejected: that is
  exactly the space problem we are fixing.
- C. Icon-only popover at every width. Least space, but hides what the page
  contains until someone taps; on load the reader no longer sees the page's
  parts. Rejected because the overview is the TOC's main job.

Within A, two placements of the in-flow list at middle widths were compared in
the demo: under the title (A) and beside the page head (B). Ferdinand chose B.
The demo's down-arrows were replaced by dots because they looked noisy.

## Decided details

- Visual tokens come from the existing theme (`primary`, `muted-foreground`,
  `border`, Museo Sans / Museo Sans Condensed); label in small spaced capitals,
  section names in Museo Sans Condensed.
- Section list is passed once per page as `{ name, id }` items; all three
  places (in-flow, pill panel, rail) render from it.

## Left to the builder

- How the component is split (e.g. in-flow list, rail and pill as parts of one
  `Toc` module) and how each page places the in-flow part beside its head.
- How the current section is tracked (scroll listener or IntersectionObserver),
  as long as the rule in goal 5 holds; the rule itself is a pure function with
  unit tests.
- Exact breakpoints may follow the existing Tailwind ones (`lg` = 1024px); the
  700px switch may become `md` (768px) if that fits the page heads better.
- Tests: unit tests for the current-section rule and pill visibility;
  Playwright checks on `/ueber-uns` at phone width (list under title, pill
  appears after scrolling, panel opens and jumps) and at 1440px (rail marks the
  section in view). The existing `pages.spec.ts` checks stay green.
