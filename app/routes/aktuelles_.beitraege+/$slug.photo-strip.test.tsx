/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { stubCarouselBrowserApis } from '#tests/setup/stub-carousel-apis.ts'
import { PhotoStripBlock } from './$slug.tsx'

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
})
