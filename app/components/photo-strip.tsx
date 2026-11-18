import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import { getImageDimensions } from '@sanity/asset-utils'
import { type SanityImageObject } from '@sanity/image-url'
import React from 'react'
import { PhotoLightbox } from '#app/components/photo-lightbox.tsx'
import { visibleFocusOutline } from '#app/components/visible-focus.ts'
import { urlFor } from '#app/sanity/instance.ts'

export type StripPhoto = {
  key: string
  image: { asset?: { _ref: string } } & Record<string, unknown>
  caption?: string
  alt?: string
  attribution?: string
}

type Crop = { top: number; bottom: number; left: number; right: number }

/**
 * Largest photo height in CSS pixels (`--photo-height` from `sm` up), used for
 * the image's intrinsic size and to load it sharp on high-density screens.
 */
const PHOTO_HEIGHT = 256

/** Width / height of the photo as shown, after the crop set in the Studio. */
export function photoAspectRatio(image: StripPhoto['image']) {
  const { width, height } = getImageDimensions(
    image as Parameters<typeof getImageDimensions>[0],
  )
  const crop = image.crop as Crop | undefined
  if (!crop) return width / height
  return (
    (width * (1 - crop.left - crop.right)) /
    (height * (1 - crop.top - crop.bottom))
  )
}

/**
 * Accessible name for a button that opens a photo. It starts with the visible
 * caption, so voice control users can say what they see, and adds the alt
 * text for screen reader users.
 */
export function photoButtonLabel({
  caption,
  alt,
}: {
  caption?: string
  alt?: string
}) {
  return [caption, alt].filter(Boolean).join(' – ') || 'Foto vergrößern'
}

type ScrollState = { canScrollBack: boolean; canScrollOn: boolean }

/**
 * A row of photos in their own shape that scrolls sideways when it doesn't
 * fit; tapping a photo opens the lightbox with this strip's photos. Photos
 * without an uploaded image are skipped.
 */
export function PhotoStrip({ photos }: { photos: StripPhoto[] }) {
  const validPhotos = React.useMemo(
    () => photos.filter(photo => photo.image?.asset),
    [photos],
  )
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null)
  const [scroll, setScroll] = React.useState<ScrollState>({
    canScrollBack: false,
    canScrollOn: false,
  })
  const scrollerRef = React.useRef<HTMLDivElement>(null)

  const measure = React.useCallback(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const { scrollLeft, clientWidth, scrollWidth } = scroller
    setScroll({
      canScrollBack: scrollLeft > 1,
      canScrollOn: scrollLeft + clientWidth < scrollWidth - 1,
    })
  }, [])

  React.useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(scroller)
    return () => observer.disconnect()
  }, [measure, validPhotos])

  function scrollByPage(direction: 1 | -1) {
    const scroller = scrollerRef.current
    scroller?.scrollBy({ left: direction * scroller.clientWidth * 0.8 })
  }

  function focusNeighbour(event: React.KeyboardEvent<HTMLDivElement>) {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key]
    if (!step) return
    const buttons = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>(
        '[role=listitem] button',
      ),
    )
    const current = buttons.indexOf(event.target as HTMLButtonElement)
    const next = buttons[current + step]
    if (current === -1 || !next) return
    event.preventDefault()
    next.focus()
  }

  if (validPhotos.length === 0) return null

  const isScrollable = scroll.canScrollBack || scroll.canScrollOn

  return (
    <div className="my-8">
      <div
        ref={scrollerRef}
        role="list"
        aria-label="Fotostrecke"
        onScroll={measure}
        onKeyDown={focusNeighbour}
        // On phones the row runs to the screen edge (--bleed); from `sm` up
        // it stops at the text column, with just enough room for the focus
        // outline, which the scroller would otherwise clip. The padding
        // offsets the negative margin, so photos start and snap at the text.
        className="mx-[calc(-1*var(--bleed))] -my-1 flex snap-x snap-mandatory scroll-px-(--bleed) [scrollbar-width:none] gap-3 overflow-x-auto px-(--bleed) py-1 [--bleed:--spacing(4)] [--photo-height:--spacing(56)] motion-safe:scroll-smooth sm:[--bleed:--spacing(1)] sm:[--photo-height:--spacing(64)] [&::-webkit-scrollbar]:hidden"
      >
        {validPhotos.map((photo, index) => {
          // An explicit width keeps the photo's shape; sizing the figure from
          // its content lets a narrow caption squeeze the photo.
          const aspectRatio = photoAspectRatio(photo.image)
          return (
            <div
              key={photo.key}
              role="listitem"
              className="flex-none snap-start"
            >
              <figure
                style={{ width: `calc(var(--photo-height) * ${aspectRatio})` }}
                className="group max-w-[80vw]"
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  aria-label={photoButtonLabel(photo)}
                  className={`block w-full cursor-zoom-in overflow-hidden rounded ${visibleFocusOutline}`}
                >
                  <img
                    src={urlFor(photo.image as SanityImageObject)
                      .height(PHOTO_HEIGHT * 2)
                      .auto('format')
                      .url()}
                    alt={photo.alt ?? photo.caption ?? ''}
                    width={Math.round(PHOTO_HEIGHT * aspectRatio)}
                    height={PHOTO_HEIGHT}
                    loading="lazy"
                    className="bg-muted h-(--photo-height) w-full object-cover transition-[filter] group-hover:brightness-95"
                  />
                </button>
                {photo.caption && (
                  <figcaption className="text-body-xs text-muted-foreground group-hover:text-foreground mt-2 line-clamp-2 leading-snug transition-colors">
                    {photo.caption}
                  </figcaption>
                )}
              </figure>
            </div>
          )
        })}
      </div>
      {isScrollable && (
        // Touch screens swipe the row; the cut-off photo shows there is more.
        <div className="mt-3 flex justify-end gap-2 pointer-coarse:hidden">
          <StripButton
            direction={-1}
            disabled={!scroll.canScrollBack}
            onClick={() => scrollByPage(-1)}
          />
          <StripButton
            direction={1}
            disabled={!scroll.canScrollOn}
            onClick={() => scrollByPage(1)}
          />
        </div>
      )}

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
    </div>
  )
}

function StripButton({
  direction,
  disabled,
  onClick,
}: {
  direction: 1 | -1
  disabled: boolean
  onClick: () => void
}) {
  const Icon = direction === 1 ? ArrowRight : ArrowLeft
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 1 ? 'Weitere Fotos' : 'Vorherige Fotos'}
      className={`border-border bg-card text-foreground hover:bg-muted flex size-9 items-center justify-center rounded-full border transition-colors disabled:pointer-events-none disabled:opacity-40 ${visibleFocusOutline}`}
    >
      <Icon className="size-4" />
    </button>
  )
}
