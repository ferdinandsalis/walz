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

/** Thumbnail height in CSS pixels; matches the `h-48` class on the image. */
const THUMBNAIL_HEIGHT = 192

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

/**
 * First and last index of the items at least half inside the viewport.
 * Positions are relative to the start of the scrolled content.
 */
export function visibleRange(
  items: Array<{ left: number; width: number }>,
  scrollLeft: number,
  viewportWidth: number,
): [number, number] {
  const viewportRight = scrollLeft + viewportWidth
  const visible = items.flatMap(({ left, width }, index) => {
    const overlap =
      Math.min(left + width, viewportRight) - Math.max(left, scrollLeft)
    return overlap >= width / 2 ? [index] : []
  })
  if (visible.length === 0) return [0, 0]
  return [visible[0]!, visible[visible.length - 1]!]
}

type ScrollState = {
  canScrollBack: boolean
  canScrollOn: boolean
  range: [number, number]
}

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
    range: [0, 0],
  })
  const scrollerRef = React.useRef<HTMLDivElement>(null)

  const measure = React.useCallback(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const { scrollLeft, clientWidth, scrollWidth } = scroller
    // Photos in the faded margin don't count as shown.
    const bleed = parseFloat(getComputedStyle(scroller).paddingLeft) || 0
    const items = Array.from(scroller.children, item => {
      const element = item as HTMLElement
      return { left: element.offsetLeft, width: element.offsetWidth }
    })
    setScroll({
      canScrollBack: scrollLeft > 1,
      canScrollOn: scrollLeft + clientWidth < scrollWidth - 1,
      range: visibleRange(items, scrollLeft + bleed, clientWidth - 2 * bleed),
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
  const [first, last] = scroll.range

  return (
    <div className="my-4">
      <div className="relative">
        <div
          ref={scrollerRef}
          role="list"
          aria-label="Fotostrecke"
          onScroll={measure}
          onKeyDown={focusNeighbour}
          // The row bleeds into the page margin (--bleed), where photos fade
          // out; padding offsets the negative margin, so photos still start
          // and snap at the text column. The vertical padding leaves room for
          // the focus outline, which the scroller would otherwise clip.
          className="relative mx-[calc(-1*var(--bleed))] -my-1 flex snap-x snap-mandatory scroll-px-(--bleed) [scrollbar-width:none] gap-3 overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_calc(var(--bleed)-4px),black_calc(100%-var(--bleed)+4px),transparent)] px-(--bleed) py-1 [--bleed:--spacing(4)] motion-safe:scroll-smooth sm:[--bleed:--spacing(8)] xl:[--bleed:--spacing(16)] [&::-webkit-scrollbar]:hidden"
        >
          {validPhotos.map((photo, index) => {
            // An explicit width keeps the photo's shape; sizing the figure
            // from its content lets a narrow caption squeeze the photo.
            const width = Math.round(
              THUMBNAIL_HEIGHT * photoAspectRatio(photo.image),
            )
            return (
              <div
                key={photo.key}
                role="listitem"
                className="flex-none snap-start"
              >
                <figure style={{ width }} className="max-w-[80vw]">
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    aria-label={photoButtonLabel(photo)}
                    className={`block cursor-zoom-in overflow-hidden rounded transition-opacity hover:opacity-90 ${visibleFocusOutline}`}
                  >
                    <img
                      src={urlFor(photo.image as SanityImageObject)
                        .height(THUMBNAIL_HEIGHT * 2)
                        .auto('format')
                        .url()}
                      alt={photo.alt ?? photo.caption ?? ''}
                      width={width}
                      height={THUMBNAIL_HEIGHT}
                      loading="lazy"
                      className="bg-muted h-48 w-full object-cover"
                    />
                  </button>
                  {photo.caption && (
                    <figcaption className="text-body-xs text-muted-foreground mt-1.5 leading-snug">
                      {photo.caption}
                    </figcaption>
                  )}
                </figure>
              </div>
            )
          })}
        </div>
        {scroll.canScrollBack && (
          <StripButton direction={-1} onClick={() => scrollByPage(-1)} />
        )}
        {scroll.canScrollOn && (
          <StripButton direction={1} onClick={() => scrollByPage(1)} />
        )}
      </div>
      {isScrollable && (
        <p className="text-body-xs text-muted-foreground mt-2 text-right tabular-nums">
          {first === last ? first + 1 : `${first + 1}–${last + 1}`} von{' '}
          {validPhotos.length}
        </p>
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
  onClick,
}: {
  direction: 1 | -1
  onClick: () => void
}) {
  const Icon = direction === 1 ? ArrowRight : ArrowLeft
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 1 ? 'Weitere Fotos' : 'Vorherige Fotos'}
      className={`bg-background/90 text-foreground hover:bg-background absolute top-24 flex size-9 -translate-y-1/2 items-center justify-center rounded-full shadow-md transition-colors ${direction === 1 ? 'right-2' : 'left-2'}`}
    >
      <Icon className="size-4" />
    </button>
  )
}
