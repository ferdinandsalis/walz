import { useLoaderData } from 'react-router'
import { type PageTitleHandle, PageTitle } from '#app/components/page-title.tsx'
import { loadQuery } from '#app/sanity/loader.server.ts'
import { curriculumQuery, type CurriculumQueryResult } from './query.ts'
import { YearSection } from './year-section.tsx'

export const handle: PageTitleHandle = { pageTitle: 'Curriculum' }

export function meta() {
  return [{ title: 'Curriculum | Walz' }]
}

export async function loader() {
  const queryResult = await loadQuery<CurriculumQueryResult>(curriculumQuery)
  return { data: queryResult.data }
}

// The page's two own texts; the years' texts come from Sanity. The heading's
// line break takes the place of a dash.
const journeyHeading = [
  'Fünf Jahre Walz',
  'von Wien in die Welt und zur Matura',
]
const noExamsText = 'Keine – ein Jahr Time-out vom Prüfungsstress'

export default function Curriculum() {
  const { data } = useLoaderData<typeof loader>()

  return (
    <div className="relative grid grid-cols-subgrid items-start gap-8 lg:col-span-2">
      <PageTitle />

      <div className="col-start-1 space-y-24 pb-16">
        <h2 className="font-condensed text-primary max-w-prose text-4xl/tight font-bold text-balance sm:text-5xl/tight">
          {journeyHeading[0]}
          <br />
          {journeyHeading[1]}
        </h2>

        {data.years.map((year, i) => (
          <YearSection
            key={year._key}
            year={year}
            n={i + 1}
            noExamsText={noExamsText}
          />
        ))}
      </div>
    </div>
  )
}
