import { type SanityImageSource } from '@sanity/image-url'
import { type ReactNode } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '#app/components/ui/carousel.tsx'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '#app/components/ui/dialog.tsx'
import { urlFor } from '#app/sanity/instance.ts'

export type LightboxPhoto = {
  image: SanityImageSource
  alt?: string
  caption?: ReactNode
}

/**
 * Fullscreen, swipeable photo viewer. Controlled via `open`/`onOpenChange`;
 * the carousel mounts fresh on each open, so `startIndex` is always honored.
 */
export function PhotoLightbox({
  photos,
  open,
  onOpenChange,
  startIndex = 0,
}: {
  photos: LightboxPhoto[]
  open: boolean
  onOpenChange: (open: boolean) => void
  startIndex?: number
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] w-[95vw] max-w-6xl overflow-hidden border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Foto</DialogTitle>
        <Carousel opts={{ startIndex, loop: photos.length > 1 }}>
          <CarouselContent>
            {photos.map((photo, index) => (
              <CarouselItem
                key={index}
                className="flex items-center justify-center"
              >
                <figure className="relative flex max-h-[90vh] items-center justify-center">
                  <img
                    src={urlFor(photo.image).quality(90).width(2400).url()}
                    alt={photo.alt ?? ''}
                    className="max-h-[90vh] w-auto rounded-sm object-contain"
                  />
                  {photo.caption && (
                    <figcaption className="pointer-events-none absolute bottom-0 left-0 right-0 rounded-b-sm bg-linear-to-t from-black/80 via-black/60 to-transparent p-6 pt-12">
                      <div className="font-condensed text-body-sm text-white">
                        {photo.caption}
                      </div>
                    </figcaption>
                  )}
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
          {photos.length > 1 && (
            <div className="pointer-events-none absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between">
              <CarouselPrevious className="pointer-events-auto static translate-y-0" />
              <CarouselNext className="pointer-events-auto static translate-y-0" />
            </div>
          )}
        </Carousel>
      </DialogContent>
    </Dialog>
  )
}
