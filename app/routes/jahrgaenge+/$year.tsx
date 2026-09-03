import {
  Baby,
  DownloadSimple,
  MagnifyingGlassPlus,
} from '@phosphor-icons/react'
import { getImageDimensions } from '@sanity/asset-utils'
import { loadQuery } from '@sanity/react-loader'
import { useState } from 'react'
import {
  type LoaderFunctionArgs,
  Link,
  type MetaArgs,
  useLoaderData,
} from 'react-router'
import { PhotoLightbox } from '#app/components/photo-lightbox.tsx'
import { urlFor } from '#app/sanity/instance.ts'
import { type Photo, type Year } from '#app/sanity/schema/year.tsx'
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
    <article className="post space-y-8 text-pretty hyphens-auto">
      <header className="space-y-4">
        <hgroup>
          <p className="font-condensed text-primary mb-1 text-lg font-bold">
            Jahrgang
          </p>
          <h1 className="inline-flex gap-1 text-3xl font-bold lg:text-5xl">
            <span>{year.letter}</span>
            <span className="text-primary text-lg font-bold">
              {calculateCurrentYear(year.startedAt)}
            </span>
          </h1>
        </hgroup>

        <div>
          <p>
            Mentor:in{' '}
            <Link
              className="text-secondary font-bold hover:underline hover:underline-offset-2"
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
        <YearPhotos
          photos={year.photos}
          letter={year.letter}
          featuredPhoto={year.featuredPhoto}
        />
      ) : (
        <div
          data-testid="year-photos-empty"
          className="bg-card max-w-3xl rounded-sm p-2 shadow-sm"
        >
          <div className="from-secondary/20 flex aspect-video flex-1 items-center justify-center rounded-r-md bg-linear-to-t to-transparent">
            <Baby size={96} className="text-secondary/40 w-12 md:w-24" />
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
          <DownloadSimple className="text-primary" size={18} />
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
  const initialIndex = photos.findIndex(
    p => p.asset._ref === featured.asset._ref,
  )
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0,
  )
  const selectedPhoto = photos[selectedPhotoIndex]
  const { width, height } = getImageDimensions(selectedPhoto.asset)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col gap-4 lg:flex-row">
        <figure className="group flex-1">
          <div className="relative flex">
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="relative w-full cursor-zoom-in"
            >
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
              <div className="absolute top-2 right-2 rounded-full bg-black/50 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <MagnifyingGlassPlus className="h-5 w-5 text-white" />
              </div>
            </button>
            {selectedPhoto.motto && (
              <figcaption className="pointer-events-none absolute right-0 bottom-0 left-0 rounded-b-sm bg-linear-to-t from-black/80 via-black/60 to-transparent p-6 pt-12">
                <p className="font-condensed text-body-sm text-white">
                  Motto: "{selectedPhoto.motto}"
                </p>
              </figcaption>
            )}
          </div>
        </figure>

        <PhotoLightbox
          photos={photos.map(photo => ({
            image: photo,
            alt: `${letter} Foto`,
            caption: photo.motto ? `Motto: "${photo.motto}"` : undefined,
          }))}
          open={lightboxOpen}
          startIndex={selectedPhotoIndex}
          onOpenChange={setLightboxOpen}
        />

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
                    className="h-20 w-30 object-cover"
                  />
                  <div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/60 to-transparent p-1">
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
