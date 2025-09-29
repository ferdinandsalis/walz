import { loadQuery } from '@sanity/react-loader'
import { BabyIcon, DownloadIcon, GraduationCapIcon } from 'lucide-react'
import { Link, useLoaderData, href } from 'react-router'
import { z } from 'zod'
import { Divider } from '#app/components/ui/divider.tsx'
import { urlFor } from '#app/sanity/instance.ts'
import { alphabetMap } from '#app/sanity/schema/year.ts'
import { calculateCurrentYear } from '#app/utils/years.ts'
import { type QueryResult, type Year, YearSchema, jahrgaengeQuery } from './_index.query.ts'

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
            Aktuelle Jahrgänge
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {alumniYears.map(year => (
              <YearCard key={year._id} {...year} isAlumni />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function YearCard({ letter, startedAt, graduatedAt, mentor, photos, plan, isAlumni = false }: Year & { isAlumni?: boolean }) {
  return (
    <article className="flex flex-wrap rounded-md bg-card shadow-md transition-shadow hover:shadow-lg">
      <div className="relative flex flex-1 flex-col p-6">
        <div className="text-1xl absolute right-14 top-10 scale-[7] font-greek font-black lowercase text-primary opacity-10">
          {alphabetMap[letter]}
        </div>

        <div className="flex-1">
          <h1 className="inline-flex gap-1 text-3xl font-bold">
            <Link
              to={href(`/jahrgaenge/:year`, {
                year: `${letter}-${startedAt.getFullYear()}`,
              })}
              className="hover:text-secondary"
            >
              <span>{letter}</span>
              <span className="align-super text-lg font-bold text-primary">
                {calculateCurrentYear(startedAt)}
              </span>
            </Link>
          </h1>

          {isAlumni && graduatedAt && (
            <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-secondary/20 px-2 py-1">
              <GraduationCapIcon className="h-4 w-4" />
              <span className="text-sm font-bold">
                Matura {new Date(graduatedAt).getFullYear()}
              </span>
            </div>
          )}

          <div className="mt-4 space-y-1">
            <p className="text-sm text-muted-foreground">
              Start: {startedAt.getFullYear()}
              {graduatedAt && ` - ${new Date(graduatedAt).getFullYear()}`}
            </p>
            {mentor && (
              <p className="text-sm text-muted-foreground">
                Mentor:in: {mentor.name}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          {plan && (
            <a
              href={plan}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground underline underline-offset-2 hover:text-primary"
              download={`${letter}-jahresplan.pdf`}
            >
              Jahresplan
              <DownloadIcon className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>

      {photos && photos.length > 0 && (
        <div className="relative w-full overflow-hidden rounded-b-md bg-muted p-2 sm:w-40">
          <img
            src={urlFor(photos[0]).quality(70).width(400).height(400).url()}
            alt={`Jahrgang ${letter}`}
            className="aspect-square w-full rounded object-cover"
          />
        </div>
      )}

      {!photos && (
        <div className="flex w-full items-center justify-center bg-gradient-to-t from-muted/50 to-transparent p-4 sm:w-40">
          <BabyIcon className="h-16 w-16 text-muted-foreground/30" />
        </div>
      )}
    </article>
  )
}