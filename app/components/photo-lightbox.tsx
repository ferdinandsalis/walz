import { type SanityImageSource } from '@sanity/image-url'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import {
  type CarouselApi,
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
  attribution?: string
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
  // Opened without a DialogTrigger, so Radix has nothing to return focus to;
  // remember what was focused on open (the tapped photo) and restore it.
  const focusOnOpen = useRef<HTMLElement | null>(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        onOpenAutoFocus={() => {
          focusOnOpen.current = document.activeElement as HTMLElement | null
        }}
        onCloseAutoFocus={event => {
          if (!focusOnOpen.current) return
          event.preventDefault()
          focusOnOpen.current.focus()
        }}
        className="max-h-[95vh] w-[95vw] max-w-6xl overflow-hidden border-0 bg-transparent p-0 shadow-none"
      >
        <DialogTitle className="sr-only">Foto</DialogTitle>
        <LightboxSlides photos={photos} startIndex={startIndex} />
      </DialogContent>
    </Dialog>
  )
}

/**
 * Mounts fresh on every open, so it starts at `startIndex`. Arrow keys work
 * wherever focus is in the dialog (it opens focused on the close button).
 */
function LightboxSlides({
  photos,
  startIndex,
}: {
  photos: LightboxPhoto[]
  startIndex: number
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [index, setIndex] = useState(startIndex)
  const hasSeveral = photos.length > 1

  useEffect(() => {
    if (!api) return
    const onSelect = () => setIndex(api.selectedScrollSnap())
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  useEffect(() => {
    if (!hasSeveral) return
    function onKeyDown(event: KeyboardEvent) {
      // The carousel already handled keys pressed while focus is inside it.
      if (event.defaultPrevented) return
      const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key]
      if (!step) return
      event.preventDefault()
      const next = (index + step + photos.length) % photos.length
      setIndex(next)
      api?.scrollTo(next)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [api, index, hasSeveral, photos.length])

  return (
    <Carousel setApi={setApi} opts={{ startIndex, loop: hasSeveral }}>
      <CarouselContent>
        {photos.map((photo, photoIndex) => (
          <CarouselItem
            key={photoIndex}
            className="flex items-center justify-center"
          >
            <figure className="relative flex max-h-[90vh] items-center justify-center">
              <img
                src={urlFor(photo.image).quality(90).width(2400).url()}
                alt={photo.alt ?? ''}
                className="max-h-[90vh] w-auto rounded-sm object-contain"
              />
              {(photo.caption || photo.attribution) && (
                <figcaption className="pointer-events-none absolute right-0 bottom-0 left-0 rounded-b-sm bg-linear-to-t from-black/80 via-black/60 to-transparent p-6 pt-12">
                  <div className="font-condensed text-body-sm text-white">
                    {photo.caption}
                  </div>
                  {photo.attribution && (
                    <div className="text-body-xs text-right text-white/80">
                      {photo.attribution}
                    </div>
                  )}
                </figcaption>
              )}
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
      {hasSeveral && (
        <>
          <p className="text-body-xs absolute top-4 left-4 rounded-full bg-black/50 px-3 py-1 text-white tabular-nums">
            {index + 1} / {photos.length}
          </p>
          <div className="pointer-events-none absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between">
            <CarouselPrevious className="pointer-events-auto static translate-y-0" />
            <CarouselNext className="pointer-events-auto static translate-y-0" />
          </div>
        </>
      )}
    </Carousel>
  )
}
