import { type SanityImageObject } from '@sanity/image-url'
import React from 'react'
import { PhotoLightbox } from '#app/components/photo-lightbox.tsx'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '#app/components/ui/carousel.tsx'
import { urlFor } from '#app/sanity/instance.ts'

export type StripPhoto = {
  key: string
  image: { asset?: { _ref: string } } & Record<string, unknown>
  caption?: string
  alt?: string
  attribution?: string
}

/**
 * Swipeable row of square thumbnails; tapping one opens the lightbox with
 * this strip's photos. Photos without an uploaded image are skipped.
 */
export function PhotoStrip({
  photos,
  itemClassName = 'sm:basis-1/2 md:basis-1/3',
}: {
  photos: StripPhoto[]
  itemClassName?: string
}) {
  const validPhotos = React.useMemo(
    () => photos.filter(photo => photo.image?.asset),
    [photos],
  )
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null)

  if (validPhotos.length === 0) return null

  return (
    <>
      <Carousel
        opts={{
          loop: true,
          align: 'start',
          duration: 20,
        }}
      >
        <div className="bg-muted/30 rounded px-4 py-4 md:-mx-4">
          <CarouselContent className="-ml-2">
            {validPhotos.map((photo, index) => (
              <CarouselItem key={photo.key} className={`pl-2 ${itemClassName}`}>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  aria-label={photo.alt || photo.caption || 'Foto vergrößern'}
                  className="group relative block w-full cursor-zoom-in overflow-hidden rounded"
                >
                  <img
                    src={urlFor(photo.image as SanityImageObject)
                      .height(512)
                      .width(512)
                      .format('webp')
                      .url()}
                    alt={photo.alt ?? photo.caption ?? ''}
                    className="rounded object-cover shadow-sm"
                  />
                  {photo.caption && (
                    <div className="font-condensed absolute right-0 bottom-0 left-0 flex appearance-none items-center justify-start gap-1 bg-black/10 p-1.5 px-3">
                      <span className="text-card text-xs drop-shadow-sm">
                        {photo.caption}
                      </span>
                    </div>
                  )}
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
        <div className="mt-4 flex justify-center gap-2 px-8">
          <CarouselPrevious variant="ghost" />
          <CarouselNext variant="ghost" />
        </div>
      </Carousel>

      <PhotoLightbox
        photos={validPhotos.map(photo => ({
          image: photo.image as SanityImageObject,
          alt: photo.alt ?? photo.caption,
          caption: photo.caption,
          attribution: photo.attribution,
        }))}
        open={lightboxIndex !== null}
        startIndex={lightboxIndex ?? 0}
        onOpenChange={open => {
          if (!open) setLightboxIndex(null)
        }}
      />
    </>
  )
}
