/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { stubCarouselBrowserApis } from '#tests/setup/stub-carousel-apis.ts'
import { PhotoLightbox, type LightboxPhoto } from './photo-lightbox.tsx'

const photos: LightboxPhoto[] = ['Eins', 'Zwei', 'Drei'].map(caption => ({
  image: { asset: { _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-800x600-jpg' } },
  caption,
}))

beforeEach(() => {
  stubCarouselBrowserApis()
})

const renderLightbox = (startIndex: number) =>
  render(
    <PhotoLightbox
      photos={photos}
      open
      onOpenChange={() => {}}
      startIndex={startIndex}
    />,
  )

describe('PhotoLightbox', () => {
  it('shows which photo is open', () => {
    renderLightbox(1)

    expect(within(screen.getByRole('dialog')).getByText('2 / 3')).toBeTruthy()
  })

  it('moves through the photos with the arrow keys', () => {
    renderLightbox(1)
    const dialog = screen.getByRole('dialog')

    fireEvent.keyDown(document.activeElement ?? dialog, { key: 'ArrowRight' })
    expect(within(dialog).getByText('3 / 3')).toBeTruthy()

    fireEvent.keyDown(document.activeElement ?? dialog, { key: 'ArrowRight' })
    expect(within(dialog).getByText('1 / 3')).toBeTruthy()

    fireEvent.keyDown(document.activeElement ?? dialog, { key: 'ArrowLeft' })
    expect(within(dialog).getByText('3 / 3')).toBeTruthy()
  })

  it('shows no counter for a single photo', () => {
    render(
      <PhotoLightbox
        photos={photos.slice(0, 1)}
        open
        onOpenChange={() => {}}
      />,
    )

    expect(
      within(screen.getByRole('dialog')).queryByText(/\d \/ \d/),
    ).toBeNull()
  })
})
