import { loadQuery } from '@sanity/react-loader'
import { GraduationCapIcon } from 'lucide-react'
import { useLoaderData } from 'react-router'
import { z } from 'zod'
import { Divider } from '#app/components/ui/divider.tsx'
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
      alumniYears: z.array(YearSchema).parse(queryResult.data.alumniYears),
    },
  }
}

export default function Jahrgaenge() {
  const loaderData = useLoaderData<typeof loader>()
  const { currentYears, alumniYears } = loaderData.data

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
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))' }}>
            {currentYears.map(year => (
              <YearCard key={year._id} {...year} />
            ))}
          </div>
        </section>

        <Divider />

        <section id="alumni" className="space-y-8">
          <h2 className="font-condensed text-2xl font-bold text-primary md:text-4xl">
            Alumni
          </h2>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))' }}>
            {alumniYears.map(year => (
              <YearCard key={year._id} {...year} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
