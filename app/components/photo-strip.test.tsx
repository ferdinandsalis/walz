/**
 * @vitest-environment jsdom
 */
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { stubCarouselBrowserApis } from '#tests/setup/stub-carousel-apis.ts'
import {
  PhotoStrip,
  photoAspectRatio,
  visibleRange,
  type StripPhoto,
} from './photo-strip.tsx'

const ref = 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-800x600-jpg'

const photo = (key: string, caption?: string): StripPhoto => ({
  key,
  image: { asset: { _ref: ref } },
  caption,
})

beforeEach(() => {
  stubCarouselBrowserApis()
})

describe('photoAspectRatio', () => {
  it("uses the uploaded image's dimensions", () => {
    expect(photoAspectRatio({ asset: { _ref: ref } })).toBeCloseTo(800 / 600)
  })

  it('applies the crop set in the Studio', () => {
    const cropped = {
      asset: { _ref: ref },
      crop: { left: 0.25, right: 0.25, top: 0, bottom: 0 },
    }

    expect(photoAspectRatio(cropped)).toBeCloseTo(400 / 600)
  })
})

describe('visibleRange', () => {
  const items = [0, 208, 416, 624].map(left => ({ left, width: 200 }))

  it('counts photos that are at least half in view', () => {
    expect(visibleRange(items, 0, 450)).toEqual([0, 1])
  })

  it('follows the scroll position', () => {
    expect(visibleRange(items, 200, 450)).toEqual([1, 2])
  })
})

describe('PhotoStrip', () => {
  it('renders a thumbnail button per photo with its caption', () => {
    render(
      <PhotoStrip
        photos={[
          photo('a', 'Wandertag'),
          photo('b', 'Gipfel'),
          photo('c', 'Hütte'),
        ]}
      />,
    )

    expect(
      screen.getAllByRole('button', { name: /Wandertag|Gipfel|Hütte/ }),
    ).toHaveLength(3)
    expect(screen.getByText('Wandertag')).toBeTruthy()
    expect(screen.getByText('Gipfel')).toBeTruthy()
    expect(screen.getByText('Hütte')).toBeTruthy()
  })

  it('skips photos without an uploaded image', () => {
    render(
      <PhotoStrip
        photos={[
          photo('a', 'Wandertag'),
          { key: 'empty', image: {}, caption: 'Leer' },
          photo('b', 'Gipfel'),
        ]}
      />,
    )

    expect(screen.queryByText('Leer')).toBeNull()
    expect(screen.getAllByRole('img')).toHaveLength(2)
  })

  it('renders nothing when no photo has an image', () => {
    const { container } = render(
      <PhotoStrip photos={[{ key: 'empty', image: {}, caption: 'Leer' }]} />,
    )

    expect(container.innerHTML).toBe('')
  })

  it('renders no caption for photos without caption', () => {
    const { container } = render(<PhotoStrip photos={[photo('a')]} />)

    expect(container.querySelector('figcaption')).toBeNull()
    expect(container.querySelector('img')?.getAttribute('alt')).toBe('')
  })

  it('lazy-loads thumbnails in their own shape', () => {
    render(<PhotoStrip photos={[photo('a', 'Wandertag')]} />)
    const img = screen.getByRole('img')

    expect(img.getAttribute('loading')).toBe('lazy')
    expect(img.getAttribute('width')).toBe('256')
    expect(img.getAttribute('height')).toBe('192')
  })

  it('hides the scroll buttons and counter when all photos fit', () => {
    render(<PhotoStrip photos={[photo('a', 'A1'), photo('b', 'A2')]} />)

    expect(screen.queryByRole('button', { name: 'Weitere Fotos' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Vorherige Fotos' })).toBeNull()
    expect(screen.queryByText(/von 2/)).toBeNull()
  })

  it('offers to scroll on and shows the counter when the row overflows', () => {
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(1000)
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(400)

    render(
      <PhotoStrip
        photos={[photo('a', 'A1'), photo('b', 'A2'), photo('c', 'A3')]}
      />,
    )

    expect(screen.getByRole('button', { name: 'Weitere Fotos' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Vorherige Fotos' })).toBeNull()
    expect(screen.getByText(/von 3/)).toBeTruthy()
  })

  it('moves focus between photos with the arrow keys', () => {
    render(
      <PhotoStrip
        photos={[photo('a', 'A1'), photo('b', 'A2'), photo('c', 'A3')]}
      />,
    )
    const first = screen.getByRole('button', { name: 'A1' })
    const second = screen.getByRole('button', { name: 'A2' })

    first.focus()
    fireEvent.keyDown(first, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(second)

    fireEvent.keyDown(second, { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(first)
  })

  it('returns focus to the tapped photo when the lightbox closes', async () => {
    render(<PhotoStrip photos={[photo('a1', 'A1'), photo('a2', 'A2')]} />)
    const thumbnail = screen.getByRole('button', { name: 'A2' })

    thumbnail.focus()
    fireEvent.click(thumbnail)
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })

    expect(screen.queryByRole('dialog')).toBeNull()
    // Radix moves focus on close in a timeout, after the dialog unmounts.
    await waitFor(() => expect(document.activeElement).toBe(thumbnail))
  })

  it("opens the lightbox at the tapped photo with only this strip's photos", () => {
    render(
      <>
        <PhotoStrip photos={[photo('a1', 'A1'), photo('a2', 'A2')]} />
        <PhotoStrip photos={[photo('b1', 'B1'), photo('b2', 'B2')]} />
      </>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'A2' }))

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('2 / 2')).toBeTruthy()
    expect(within(dialog).queryByText('B1')).toBeNull()
  })
})
