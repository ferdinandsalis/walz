import { unstable_defineLoader as defineLoader } from '@remix-run/node'
import {
  Link,
  type MetaArgs_SingleFetch,
  useLoaderData,
} from '@remix-run/react'
import { getImageDimensions } from '@sanity/asset-utils'
import { loadQuery } from '@sanity/react-loader'
import { BabyIcon, DownloadIcon } from 'lucide-react'
import { urlFor } from '#app/sanity/instance.ts'
import { calculateCurrentYear } from '#app/utils/years.js'
import { yearQuery, YearSchema } from './$year.query.tsx'

export function meta({ data }: MetaArgs_SingleFetch<typeof loader>) {
  return [{ title: `Jahrgang ${data?.data.letter} | Walz` }]
}

export const loader = defineLoader(async ({ params }) => {
  const queryResult = await loadQuery(yearQuery, params, {
    perspective: 'published',
  })

  return {
    query: yearQuery,
    params,
    data: YearSchema.parse(queryResult.data),
  }
})

export default function Year() {
  const loaderData = useLoaderData<typeof loader>()
  const year = loaderData.data

  return (
    <article className="post space-y-8 hyphens-auto text-pretty">
      <header className="space-y-4">
        <hgroup>
          <p className="mb-1 font-condensed text-lg font-bold text-primary">
            Jahrgang
          </p>
          <h1 className="inline-flex gap-1 text-3xl font-bold lg:text-5xl">
            <span>{year.letter}</span>
            <span className="text-lg font-bold text-primary">
              {calculateCurrentYear(year.startedAt)}
            </span>
          </h1>
        </hgroup>

        <div>
          <p>
            Mentor:in{' '}
            <Link
              className="font-bold text-secondary hover:underline hover:underline-offset-2"
              to={`/ueber-uns/#${year.mentor?.name}`}
            >
              {year.mentor?.name}
            </Link>
          </p>
          <p>
            Erster Walztag{' '}
            {year.startedAt.toLocaleString('de-at', {
              dateStyle: 'long',
            })}
          </p>
        </div>
      </header>

      {year.photos ? (
        <YearPhotos photos={year.photos} letter={year.letter} />
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-r-md bg-gradient-to-t from-secondary/40 to-transparent">
          <BabyIcon size={96} className="w-12 stroke-secondary/20 md:w-24" />
        </div>
      )}

      {year.plan && (
        <div className="mt-4 flex items-center gap-1">
          <a
            href={year.plan}
            className="text-muted-foreground underline underline-offset-2"
          >
            Jahresplan herunterladen
          </a>
          <DownloadIcon className="stroke-primary" size={18} />
        </div>
      )}
    </article>
  )
}

function YearPhotos({
  photos,
  letter,
}: {
  photos: {
    asset?: any
    takenAt: Date
    attribution?: string
    alt?: string
    caption?: string
  }[]
  letter: string
}) {
  const currentPhoto = photos[0]
  const { width, height } = getImageDimensions(currentPhoto.asset)

  return (
    <figure className="max-w-3xl rounded-sm bg-card p-2 shadow">
      <img
        src={urlFor(currentPhoto).quality(80).width(1000).url()}
        width={width}
        height={height}
        alt={`${letter} Foto`}
        className="flex-1 rounded-sm object-cover object-center"
        style={{
          aspectRatio: width / height,
        }}
      />
    </figure>
  )
}
