import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ImageComponent } from './$slug.tsx'

const imageValue = (extra: Record<string, unknown>) => ({
  _type: 'image',
  asset: { _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-800x600-jpg' },
  ...extra,
})

describe('ImageComponent', () => {
  it('renders the caption below the image', () => {
    const markup = renderToStaticMarkup(
      <ImageComponent
        value={imageValue({ caption: 'Schülerinnen im Garten' })}
      />,
    )

    expect(markup).toContain('Schülerinnen im Garten')
  })

  it('renders the attribution below the image', () => {
    const markup = renderToStaticMarkup(
      <ImageComponent value={imageValue({ attribution: 'Foto: Agnes' })} />,
    )

    expect(markup).toContain('Foto: Agnes')
  })

  it('renders both caption and attribution when both are present', () => {
    const markup = renderToStaticMarkup(
      <ImageComponent
        value={imageValue({
          caption: 'Schülerinnen im Garten',
          attribution: 'Foto: Agnes',
        })}
      />,
    )

    expect(markup).toContain('Schülerinnen im Garten')
    expect(markup).toContain('Foto: Agnes')
  })
})
