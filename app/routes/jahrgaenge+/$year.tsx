import { getImageDimensions } from '@sanity/asset-utils'
import { loadQuery } from '@sanity/react-loader'
import { BabyIcon, DownloadIcon } from 'lucide-react'
import { useState } from 'react'
import {
  type LoaderFunctionArgs,
  Link,
  type MetaArgs,
  useLoaderData,
} from 'react-router'
import { cn } from '#app/utils/misc.tsx'
import { urlFor } from '#app/sanity/instance.ts'
import { calculateCurrentYear } from '#app/utils/years.js'
import { yearQuery, YearSchema } from './$year.query.tsx'

export function meta({ data }: MetaArgs<typeof loader>) {
  return [{ title: `Jahrgang ${data?.data.letter} | Walz` }]
}

export async function loader({ params }: LoaderFunctionArgs) {
  const [letter, startedAt] = params?.year?.split('-') ?? []
  const queryResult = await loadQuery(
    yearQuery,
    { letter, startedAt },
    {
      perspective: 'published',
    },
  )

  return {
    query: yearQuery,
    params,
    data: YearSchema.parse(queryResult.data),
  }
}

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
        <div className="max-w-3xl rounded-sm bg-card p-2 shadow">
          <div className="flex aspect-video flex-1 items-center justify-center rounded-r-md bg-gradient-to-t from-secondary/20 to-transparent">
            <BabyIcon size={96} className="w-12 stroke-secondary/40 md:w-24" />
          </div>
        </div>
      )}

      {year.plan && (
        <div className="mt-4 flex items-center gap-1">
          <a
            href={year.plan}
            className="text-muted-foreground underline underline-offset-2"
            download={`${year.letter}-${year.plan}.pdf`}
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
    motto?: string
    attribution?: string
    alt?: string
    caption?: string
  }[]
  letter: string
}) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const selectedPhoto = photos[selectedPhotoIndex]
  const { width, height } = getImageDimensions(selectedPhoto.asset)

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col gap-4 lg:flex-row">
        <figure className="relative flex-1">
          <img
            src={urlFor(selectedPhoto).quality(80).width(1000).url()}
            width={width}
            height={height}
            alt={`${letter} Foto`}
            className="w-full rounded-sm object-cover object-center shadow-md"
            style={{
              aspectRatio: width / height,
            }}
          />
          {selectedPhoto.motto && (
            <figcaption className="absolute bottom-0 left-0 right-0 rounded-b-sm bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6 pt-12">
              <p className="font-condensed text-lg text-white">
                Motto: "{selectedPhoto.motto}"
              </p>
            </figcaption>
          )}
        </figure>

        {photos.length > 1 && (
          <div className="flex flex-row gap-4 overflow-x-auto lg:flex-col lg:overflow-x-visible">
            {photos.map((photo, index) => {
              const year = new Date(photo.takenAt).getFullYear()
              return (
                <button
                  key={index}
                  onClick={() => setSelectedPhotoIndex(index)}
                  className={cn(
                    'group relative overflow-hidden rounded-sm transition-all',
                    selectedPhotoIndex === index
                      ? 'ring-2 ring-inset'
                      : 'hover:opacity-80',
                  )}
                >
                  <img
                    src={urlFor(photo)
                      .quality(70)
                      .width(150)
                      .height(100)
                      .fit('crop')
                      .url()}
                    alt={`${letter} Foto ${year}`}
                    className="w-30 h-20 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                    <span className="text-xs font-medium text-white">
                      {year}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
