/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { stubCarouselBrowserApis } from '#tests/setup/stub-carousel-apis.ts'
import { ImageComponent, PhotoStripBlock } from './$slug.tsx'

const stripPhoto = (key: string, caption: string) => ({
  _key: key,
  asset: { _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-800x600-jpg' },
  caption,
})

beforeEach(() => {
  stubCarouselBrowserApis()
})

describe('PhotoStripBlock', () => {
  it('renders each photo of the strip with its caption', () => {
    render(
      <PhotoStripBlock
        value={{
          photos: [stripPhoto('a', 'Wandertag'), stripPhoto('b', 'Gipfel')],
        }}
      />,
    )

    expect(screen.getByText('Wandertag')).toBeTruthy()
    expect(screen.getByText('Gipfel')).toBeTruthy()
  })

  it('renders nothing for a strip without photos', () => {
    const { container: withoutField } = render(<PhotoStripBlock value={{}} />)
    const { container: emptyList } = render(
      <PhotoStripBlock value={{ photos: [] }} />,
    )

    expect(withoutField.innerHTML).toBe('')
    expect(emptyList.innerHTML).toBe('')
  })

  it('shows the photo credit in the lightbox', () => {
    render(
      <PhotoStripBlock
        value={{
          photos: [
            { ...stripPhoto('a', 'Wandertag'), attribution: 'Foto: Agnes' },
            stripPhoto('b', 'Gipfel'),
          ],
        }}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Wandertag' }))

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Foto: Agnes')).toBeTruthy()
  })
})

describe('ImageComponent', () => {
  const image = (extra: Record<string, unknown>) => ({
    _type: 'image',
    asset: { _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-800x600-jpg' },
    ...extra,
  })

  it('opens the image in the lightbox when tapped', () => {
    render(
      <ImageComponent value={image({ caption: 'Schülerinnen im Garten' })} />,
    )

    fireEvent.click(
      screen.getByRole('button', { name: /Schülerinnen im Garten/ }),
    )

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Schülerinnen im Garten')).toBeTruthy()
  })

  it('shows the image credit in the lightbox', () => {
    render(
      <ImageComponent
        value={image({ caption: 'Im Garten', attribution: 'Foto: Agnes' })}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Im Garten' }))

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Foto: Agnes')).toBeTruthy()
  })

  it('names the zoom button by its visible caption, followed by its alt text', () => {
    render(
      <ImageComponent
        value={image({ caption: 'Im Garten', alt: 'Kinder pflanzen Salat' })}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Im Garten – Kinder pflanzen Salat' }),
    ).toBeTruthy()
  })

  it('names the zoom button even without caption or alt', () => {
    render(<ImageComponent value={image({})} />)

    expect(screen.getByRole('button', { name: 'Foto vergrößern' })).toBeTruthy()
  })
})
