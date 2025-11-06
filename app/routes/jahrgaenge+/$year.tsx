import { getImageDimensions } from '@sanity/asset-utils'
import { loadQuery } from '@sanity/react-loader'
import { BabyIcon, DownloadIcon, ZoomInIcon } from 'lucide-react'
import { useState } from 'react'
import {
  type LoaderFunctionArgs,
  Link,
  type MetaArgs,
  useLoaderData,
} from 'react-router'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '#app/components/ui/dialog.tsx'
import { urlFor } from '#app/sanity/instance.ts'
import { type Photo, type Year } from '#app/sanity/schema/year.ts'
import { selectFeaturedPhoto } from '#app/utils/featured-photo.ts'
import { cn } from '#app/utils/misc.tsx'
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

      {year.photos && year.photos.length > 0 ? (
        <YearPhotos photos={year.photos} letter={year.letter} featuredPhoto={year.featuredPhoto} />
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
  featuredPhoto,
}: {
  photos: Photo[]
  letter: string
  featuredPhoto?: Year['featuredPhoto']
}) {
  const featured = selectFeaturedPhoto(photos, featuredPhoto)
  const initialIndex = photos.findIndex(p => p.asset._ref === featured.asset._ref)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(initialIndex >= 0 ? initialIndex : 0)
  const selectedPhoto = photos[selectedPhotoIndex]
  const { width, height } = getImageDimensions(selectedPhoto.asset)

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col gap-4 lg:flex-row">
        <Dialog>
          <figure className="group flex-1">
            <div className="relative flex">
              <DialogTrigger asChild>
                <button className="relative w-full cursor-zoom-in">
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
                  <div className="absolute right-2 top-2 rounded-full bg-black/50 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <ZoomInIcon className="h-5 w-5 text-white" />
                  </div>
                </button>
              </DialogTrigger>
              {selectedPhoto.motto && (
                <figcaption className="pointer-events-none absolute bottom-0 left-0 right-0 rounded-b-sm bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6 pt-12">
                  <p className="font-condensed text-body-sm text-white">
                    Motto: "{selectedPhoto.motto}"
                  </p>
                </figcaption>
              )}
            </div>
          </figure>
          <DialogContent className="max-h-[95vh] w-[95vw] max-w-7xl overflow-hidden p-0">
            <div className="relative flex items-center justify-center bg-black">
              <img
                src={urlFor(selectedPhoto).quality(90).width(2400).url()}
                width={width}
                height={height}
                alt={`${letter} Foto (vergrößert)`}
                className="max-h-[95vh] w-auto object-contain"
                style={{
                  aspectRatio: width / height,
                }}
              />
              {selectedPhoto.motto && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6 pt-12">
                  <p className="font-condensed text-lg text-white">
                    Motto: "{selectedPhoto.motto}"
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

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
