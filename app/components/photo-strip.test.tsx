/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { stubCarouselBrowserApis } from '#tests/setup/stub-carousel-apis.ts'
import { PhotoStrip, type StripPhoto } from './photo-strip.tsx'

const photo = (key: string, caption?: string): StripPhoto => ({
  key,
  image: { asset: { _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-800x600-jpg' } },
  caption,
})

beforeEach(() => {
  stubCarouselBrowserApis()
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

  it('omits the caption bar for photos without caption', () => {
    const { container } = render(<PhotoStrip photos={[photo('a')]} />)

    expect(container.querySelector('.bg-black\\/10')).toBeNull()
    expect(container.querySelector('img')?.getAttribute('alt')).toBe('')
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
    expect(within(dialog).getAllByText('A2').length).toBeGreaterThan(0)
    expect(within(dialog).queryByText('B1')).toBeNull()
  })
})
