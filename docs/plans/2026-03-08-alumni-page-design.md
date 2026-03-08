# Alumni Page Design

## Overview

New standalone page at `/alumni` with two sections: "Ehrensache Walz" (scholarship/donation initiative) and "Ehemalige Jahrgänge" (alumni year listings moved from `/jahrgaenge`). New "Alumni" nav item added after "Aufnahme".

## Navigation

Add `{ name: 'Alumni', to: '/alumni' }` to `navigation.main` in `shell.tsx`, after Aufnahme. Also add to footer navigation. The nav structure (mobile collapsible, md horizontal, xl sidebar) stays the same — "Alumni" is short enough to fit the horizontal row.

## Page Structure (`/alumni`)

Route: `app/routes/alumni/route.tsx` (standalone, not a layout route)

### Layout

Same grid pattern as other pages: `grid grid-cols-subgrid items-start gap-8 lg:col-span-2`

- Faded page title "Alumni" (h1, same pattern as all pages)
- Sticky sidebar TOC with links to `#ehrensache` and `#jahrgaenge`
- Content column with two sections separated by `<Divider />`

### Section 1: Ehrensache Walz (`#ehrensache`)

- Heading: "Ehrensache Walz" in `text-h2 text-primary`
- Subtitle: "Stipendien für Walzist*innen"
- Prose blocks (max-w-2xl, text-base md:text-xl) for:
  - Initiative intro
  - "Der Gedanke" — story/motivation
  - "Ziel" — mission
  - "Erfolg" — impact (4 scholarships in 24/25, demand higher)
- CTA text: "Unterstütze Ehrensache Walz..."
- Donation card (prominent, using site's accent style `border-secondary/30 bg-secondary/20`):
  - Bank details: UniCredit Bank Austria, IBAN AT47 1200 0094 3508 9999, ref "Ehrensache Walz"
  - Tax note: Walz is tax-deductible, name + birthdate needed
  - Contact: Mateja Ostrogonac

### Section 2: Ehemalige Jahrgänge (`#jahrgaenge`)

- Heading: "Ehemalige Jahrgänge" in `text-h2 text-primary`
- Grid of `YearCard` components (reused from `aktuelles/route.tsx`)
- Data: `alumniYears` query (graduated years, ordered by graduatedAt desc)

### Data Loading

- Query file: `app/routes/alumni/query.ts` — GROQ query for alumni years only (subset of existing jahrgaenge query)
- Loader returns alumni years, validated with existing `YearSchema`

## Changes to Existing Pages

### `/jahrgaenge`

- Remove alumni section entirely (the `#alumni` section with `alumniYears` grid)
- Remove `alumniYears` from query and loader
- Add a link/note pointing to `/alumni` for past years

### Footer (`shell.tsx`)

- Add "Alumni" link to footer nav alongside other main links

## Content Source

All Ehrensache Walz text is hardcoded (not from Sanity). Alumni years come from existing Sanity year documents via GROQ query.
