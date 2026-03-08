# Alumni Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to
> implement this plan task-by-task.

**Goal:** Add a new `/alumni` page with Ehrensache Walz donation content and
alumni year listings (moved from `/jahrgaenge`), plus an "Alumni" nav item.

**Architecture:** Standalone route at `app/routes/alumni/route.tsx` with a
colocated GROQ query file. Reuses `YearCard` from `aktuelles/route.tsx` and
`Toc` component. Ehrensache content is hardcoded. Alumni years removed from
`/jahrgaenge` and its query simplified.

**Tech Stack:** React Router v7, Sanity CMS (GROQ queries), Tailwind CSS, Zod
validation

---

### Task 1: Add "Alumni" to navigation

**Files:**

- Modify: `app/components/shell.tsx`

**Step 1: Add nav item to `navigation.main` array**

In `app/components/shell.tsx`, add Alumni after Aufnahme in the
`navigation.main` array:

```typescript
const navigation = {
  main: [
    { name: 'Aktuelles', to: '/aktuelles' },
    { name: 'Über Uns', to: '/ueber-uns' },
    { name: 'Curriculum', to: '/curriculum' },
    { name: 'Aufnahme', to: '/aufnahme' },
    { name: 'Alumni', to: '/alumni' },
  ],
  // ... rest unchanged
```

**Step 2: Verify dev server shows the new nav item**

Note: The footer already renders `navigation.main` via `.map()`, so adding to
the array covers both nav and footer automatically.

Run: `npm run dev` (if not running) Check: Navigate to localhost — "Alumni"
should appear in nav after "Aufnahme" at all breakpoints.

**Step 3: Commit**

```bash
git add app/components/shell.tsx
git commit -m "Add Alumni nav item"
```

---

### Task 2: Create Alumni page query

**Files:**

- Create: `app/routes/alumni/query.ts`

**Step 1: Create the query file**

Create `app/routes/alumni/query.ts`. This is a subset of the existing jahrgaenge
query — only alumni years:

```typescript
import { defineQuery } from 'groq'
import { z } from 'zod'
import { PhotoSchema } from '#app/sanity/schema/year.tsx'
import { PersonSchema } from '../ueber-uns+/_index.query.ts'

export const alumniQuery = defineQuery(`{
  "alumniYears": *[_type == "year" && defined(graduatedAt)] | order(graduatedAt desc) {
    _id,
    _type,
    startedAt,
    graduatedAt,
    "plan": plan.asset->url,
    letter,
    mentor->{
      familyName,
      givenNames,
      "name": givenNames + " " + familyName,
      slug
    },
    photos[] {
      _key,
      takenAt,
      motto,
      caption,
      attribution,
      alt,
      asset
    } | order(takenAt desc),
    featuredPhoto
  }
}`)

export const YearSchema = z.object({
  _id: z.string(),
  _type: z.literal('year'),
  letter: z.string(),
  startedAt: z.coerce.date(),
  graduatedAt: z.coerce.date().nullable(),
  mentor: PersonSchema.pick({ givenNames: true, familyName: true })
    .extend({
      name: z.string(),
      slug: z.object({ current: z.string() }),
    })
    .nullable(),
  photos: z.array(PhotoSchema).nullable(),
  plan: z.string().nullable(),
  featuredPhoto: z.string().optional().nullable(),
})

export type Year = z.infer<typeof YearSchema>

export type AlumniQueryResult = {
  alumniYears: Year[]
}
```

**Step 2: Commit**

```bash
git add app/routes/alumni/query.ts
git commit -m "Add Alumni page GROQ query"
```

---

### Task 3: Create Alumni page route

**Files:**

- Create: `app/routes/alumni/route.tsx`

**Step 1: Create the route file**

Create `app/routes/alumni/route.tsx`:

```tsx
import { loadQuery } from '@sanity/react-loader'
import { HeartHandshakeIcon } from 'lucide-react'
import { Link, useLoaderData } from 'react-router'
import { z } from 'zod'
import { Toc } from '#app/components/toc.tsx'
import { Divider } from '#app/components/ui/divider.tsx'
import { YearCard } from '../aktuelles/route.tsx'
import { alumniQuery, type AlumniQueryResult, YearSchema } from './query.ts'

export function meta() {
  return [{ title: 'Alumni | Walz' }]
}

export async function loader() {
  const queryResult = await loadQuery<AlumniQueryResult>(alumniQuery)

  return {
    query: alumniQuery,
    data: {
      alumniYears: z.array(YearSchema).parse(queryResult.data.alumniYears),
    },
  }
}

export default function Alumni() {
  const loaderData = useLoaderData<typeof loader>()
  const { alumniYears } = loaderData.data

  return (
    <div className="relative grid grid-cols-subgrid items-start gap-8 lg:col-span-2">
      <h1 className="font-condensed text-h1 font-bold text-muted-foreground opacity-20">
        Alumni
      </h1>

      <div className="row-start-1 rounded-md bg-muted/30 p-6 lg:sticky lg:top-4 lg:z-20 lg:col-start-2 lg:row-start-2">
        <Toc
          links={[
            { name: 'Ehrensache Walz', to: '#ehrensache' },
            { name: 'Ehemalige Jahrgänge', to: '#jahrgaenge' },
          ]}
        />
      </div>

      <div className="col-start-1 grid grid-cols-1 gap-16 hyphens-auto text-balance">
        <div className="max-w-2xl space-y-4 text-base md:text-xl">
          <p>Ehemalige Jahrgänge und Ehrensache Walz.</p>
        </div>

        <section id="ehrensache" className="space-y-8">
          <h2 className="font-condensed text-h2 font-bold text-primary">
            Ehrensache Walz
          </h2>
          <p className="font-condensed text-h4 text-secondary">
            Stipendien für Walzist*innen
          </p>

          <div className="max-w-2xl space-y-4 text-base md:text-xl">
            <p>
              „Ehrensache Walz" wurde vom Vater eines Ex-Walzisten ins Leben
              gerufen. Ziel der Initiative ist es, Jugendlichen den Besuch der
              Walz zu ermöglichen, auch wenn ihre Familien die dafür notwendigen
              finanziellen Mittel nicht vollständig aufbringen können.
            </p>
          </div>

          <article className="space-y-4">
            <h3 className="font-condensed text-h3 font-bold text-secondary">
              Der Gedanke
            </h3>
            <div className="max-w-2xl space-y-4 text-base md:text-xl">
              <p>
                Vielen Eltern und ehemaligen Jugendlichen ist bewusst, dass der
                Besuch der Walz eine ganz besondere Chance ist. Gerade in einem
                turbulenten Lebensalter und oft nach Jahren der Unlust hat die
                Walz vielen geholfen, wieder arbeitsfähig zu werden und die
                eigene Persönlichkeit zu entfalten. Die Betreuung vieler
                Jugendlicher durch die Projektleiter*innen und Mentor*innen geht
                sehr oft weit über den in der Walz ohnehin sehr hohen Level
                hinaus.
              </p>
              <p>
                Aus Dankbarkeit und Verbundenheit mit der Walz entstand die
                Initiative „Ehrensache Walz". Heute wird sie von Eltern
                (ehemaliger) Walzist*innen sowie von ehemaligen Walzist*innen
                selbst weitergetragen.
              </p>
            </div>
          </article>

          <article className="space-y-4">
            <h3 className="font-condensed text-h3 font-bold text-secondary">
              Ziel
            </h3>
            <div className="max-w-2xl space-y-4 text-base md:text-xl">
              <p>
                Die Initiative möchte möglichst vielen Jugendlichen, unabhängig
                von der finanziellen Situation ihrer Familien, eine Walzkarriere
                ermöglichen.
              </p>
            </div>
          </article>

          <article className="space-y-4">
            <h3 className="font-condensed text-h3 font-bold text-secondary">
              Erfolg
            </h3>
            <div className="max-w-2xl space-y-4 text-base md:text-xl">
              <p>
                Im Schuljahr 24/25 konnten durch diese Unterstützung vier
                Teilstipendien vergeben werden. Der Bedarf ist jedoch viel
                höher.
              </p>
            </div>
          </article>

          <div className="max-w-2xl space-y-4 text-base md:text-xl">
            <p className="font-bold">
              Unterstütze „Ehrensache Walz" mit einer einmaligen oder
              regelmäßigen Spende und ermögliche Jugendlichen den Besuch der
              Walz.
            </p>
          </div>

          <div className="max-w-2xl rounded-lg border border-secondary/30 bg-secondary/20 p-6 ring-8 ring-muted/20 md:p-8">
            <div className="mb-4 flex items-center gap-2">
              <HeartHandshakeIcon size={28} className="stroke-secondary" />
              <h3 className="font-condensed text-h4 font-bold text-primary">
                Spendenkonto
              </h3>
            </div>

            <dl className="space-y-2 text-base md:text-body-md">
              <div>
                <dt className="text-body-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Bankverbindung
                </dt>
                <dd>UniCredit Bank Austria</dd>
              </div>
              <div>
                <dt className="text-body-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Name
                </dt>
                <dd>W@lz Wiener Lernzentrum</dd>
              </div>
              <div>
                <dt className="text-body-xs font-bold uppercase tracking-widest text-muted-foreground">
                  IBAN
                </dt>
                <dd className="font-bold text-primary">
                  AT47 1200 0094 3508 9999
                </dd>
              </div>
              <div>
                <dt className="text-body-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Verwendungszweck
                </dt>
                <dd>Ehrensache Walz</dd>
              </div>
            </dl>

            <div className="mt-6 space-y-3 border-t border-secondary/20 pt-4 text-body-sm">
              <p>
                Die Walz ist spendenbegünstigt. Für die steuerliche Begünstigung
                benötigen wir Name und Geburtsdatum.
              </p>
              <p>
                Für Fragen zu der Initiative, Spenden und der steuerlichen
                Absetzbarkeit steht{' '}
                <strong className="text-primary">Mateja Ostrogonac</strong>{' '}
                gerne zur Verfügung.
              </p>
            </div>
          </div>
        </section>

        <Divider />

        <section id="jahrgaenge" className="space-y-8">
          <h2 className="font-condensed text-h2 font-bold text-primary">
            Ehemalige Jahrgänge
          </h2>
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns:
                'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
            }}
          >
            {alumniYears.map(year => (
              <YearCard key={year._id} {...year} />
            ))}
          </div>
        </section>

        <Divider className="bg-transparent" />
      </div>
    </div>
  )
}
```

**Step 2: Verify the page renders**

Run: `npm run dev` (if not running) Check: Navigate to `/alumni` — page should
render with Ehrensache Walz content and alumni year cards.

**Step 3: Commit**

```bash
git add app/routes/alumni/route.tsx
git commit -m "Add Alumni page with Ehrensache Walz and alumni year listings"
```

---

### Task 4: Visual review and refinement (frontend-design skill)

**REQUIRED SKILL:** Use the `frontend-design` skill for this task.

**Step 1: Review the Alumni page in-browser**

Run the dev server (`npm run dev` if not running). Open `/alumni` in the browser
using browser-tools. Take a screenshot and evaluate against the project's design
system:

- Does the page match the visual style of existing pages (`/ueber-uns`,
  `/unterstuetzende`)?
- Is the donation card prominent and inviting, not generic?
- Does typography, spacing, and color use match the site's existing tokens?
- Is there clear visual hierarchy: story → impact → CTA?
- Does the page look cohesive at mobile, md, and lg breakpoints?

**Step 2: Refine styling if needed**

Fix any visual issues found. Common things to check:

- Donation card should feel warm/inviting (it's a charity ask, not a form)
- Spacing between sections should match other pages
- The IBAN should be easy to copy/read

**Step 3: Check navigation at all breakpoints**

Verify "Alumni" fits in the horizontal nav at md breakpoint without wrapping or
overflow. If it wraps, adjust font size or padding.

**Step 4: Commit any refinements**

```bash
git add -u
git commit -m "Refine Alumni page styling"
```

---

### Task 5: Simplify Jahrgänge page (remove alumni section)

**Files:**

- Modify: `app/routes/jahrgaenge+/_index.tsx`
- Modify: `app/routes/jahrgaenge+/_index.query.ts`

**Step 1: Remove alumniYears from the GROQ query**

In `app/routes/jahrgaenge+/_index.query.ts`, remove the entire `"alumniYears"`
block from the query string (lines 31-55), remove `alumniYears` from
`QueryResult` type (line 76). The query should only return `currentYears`.
Update the type:

```typescript
export type QueryResult = {
  currentYears: Year[]
}
```

**Step 2: Update the Jahrgänge route**

In `app/routes/jahrgaenge+/_index.tsx`:

1. Remove `alumniYears` from the loader's `data` object
2. Remove `alumniYears` from the destructuring in the component
3. Remove the `<Divider />` and the alumni `<section>` entirely
4. Add a link to `/alumni` for past years after the current years section

Replace the component with:

```tsx
import { loadQuery } from '@sanity/react-loader'
import { Link, useLoaderData } from 'react-router'
import { z } from 'zod'
import {
  type QueryResult,
  YearSchema,
  jahrgaengeQuery,
} from './_index.query.ts'
import { YearCard } from '../aktuelles/route.tsx'

export function meta() {
  return [{ title: 'Jahrgänge | Walz' }]
}

export async function loader() {
  const queryResult = await loadQuery<QueryResult>(jahrgaengeQuery)

  return {
    query: jahrgaengeQuery,
    data: {
      currentYears: z.array(YearSchema).parse(queryResult.data.currentYears),
    },
  }
}

export default function Jahrgaenge() {
  const loaderData = useLoaderData<typeof loader>()
  const { currentYears } = loaderData.data

  return (
    <div className="relative grid grid-cols-subgrid items-start gap-8 lg:col-span-2">
      <h1 className="font-condensed text-h1 font-bold text-muted-foreground opacity-20">
        Jahrgänge
      </h1>

      <div className="col-start-1 grid grid-cols-1 gap-16">
        <section id="current" className="space-y-8">
          <h2 className="font-condensed text-2xl font-bold text-primary md:text-4xl">
            Aktuelle
          </h2>
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns:
                'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
            }}
          >
            {currentYears.map(year => (
              <YearCard key={year._id} {...year} />
            ))}
          </div>
        </section>

        <p className="text-body-md text-muted-foreground">
          <Link
            to="/alumni#jahrgaenge"
            prefetch="intent"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Ehemalige Jahrgänge →
          </Link>
        </p>
      </div>
    </div>
  )
}
```

**Step 3: Verify both pages work**

Check: `/jahrgaenge` shows only current years with link to alumni. `/alumni`
shows all alumni years.

**Step 4: Commit**

```bash
git add app/routes/jahrgaenge+/_index.tsx app/routes/jahrgaenge+/_index.query.ts
git commit -m "Remove alumni section from Jahrgänge, link to Alumni page"
```

---

### Task 6: Add E2E test for Alumni page

**Files:**

- Modify: `tests/pages.spec.ts`

**Step 1: Add Alumni page test**

Add to `tests/pages.spec.ts`:

```typescript
test('has alumni page', async ({ page }) => {
  await page.goto('/alumni')

  await expect(
    page.getByRole('heading', { name: 'Ehrensache Walz' }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Ehemalige Jahrgänge' }),
  ).toBeVisible()
  await expect(page.getByText('AT47 1200 0094 3508 9999')).toBeVisible()
})
```

**Step 2: Run E2E tests**

Run: `npm run test:e2e:run` Expected: All tests pass including the new alumni
test.

**Step 3: Commit**

```bash
git add tests/pages.spec.ts
git commit -m "Add E2E test for Alumni page"
```

---

### Task 7: Typecheck and lint

**Step 1: Run typecheck**

Run: `npm run typecheck` Expected: No type errors.

**Step 2: Run lint**

Run: `npm run lint` Expected: No lint errors.

**Step 3: Run format**

Run: `npm run format`

**Step 4: Commit any formatting changes**

```bash
git status
# If any files changed:
git add -u
git commit -m "Format"
```
