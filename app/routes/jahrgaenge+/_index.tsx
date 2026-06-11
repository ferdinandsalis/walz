import { loadQuery } from '@sanity/react-loader'
import { Link, useLoaderData } from 'react-router'
import { z } from 'zod'
import { YearCard } from '../aktuelles/route.tsx'
import {
  type QueryResult,
  YearSchema,
  jahrgaengeQuery,
} from './_index.query.ts'

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
      <h1 className="font-condensed text-h1 text-muted-foreground font-bold opacity-20">
        Jahrgänge
      </h1>

      <div className="col-start-1 grid grid-cols-12 gap-x-4 gap-y-16 sm:gap-x-6 lg:gap-x-8">
        <section id="current" className="col-span-12 space-y-8">
          <h2 className="font-condensed text-primary text-2xl font-bold md:text-4xl">
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

        <p className="text-body-md text-muted-foreground col-span-12">
          <Link
            to="/alumni#jahrgaenge"
            prefetch="intent"
            className="hover:text-foreground underline underline-offset-2"
          >
            Ehemalige Jahrgänge →
          </Link>
        </p>
      </div>
    </div>
  )
}
