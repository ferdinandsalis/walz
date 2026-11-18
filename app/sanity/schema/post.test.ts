import { validateDocument } from '@sanity/validation'
import { createSchema } from 'sanity'
import { describe, expect, it } from 'vitest'
import { schemaTypes } from './index.ts'

const schema = createSchema({ name: 'test', types: schemaTypes })

const photo = (key: string) => ({
  _key: key,
  _type: 'image',
  asset: { _type: 'reference', _ref: 'image-abc-800x600-jpg' },
})

const postWithPhotoStrip = (photoStrip: Record<string, unknown>) => ({
  _id: 'drafts.post',
  _type: 'post',
  _createdAt: '2026-11-18T00:00:00Z',
  _updatedAt: '2026-11-18T00:00:00Z',
  _rev: '1',
  title: 'Wandertag',
  slug: { _type: 'slug', current: 'wandertag' },
  publishedAt: '2026-11-18T00:00:00Z',
  body: [{ _key: 'strip', _type: 'photoStrip', ...photoStrip }],
})

async function photoStripErrors(photoStrip: Record<string, unknown>) {
  const { markers } = await validateDocument({
    document: postWithPhotoStrip(photoStrip),
    schema,
  })
  return markers.filter(
    marker =>
      marker.level === 'error' && marker.path.some(part => part === 'photos'),
  )
}

describe('Fotostrecke validation', () => {
  it('rejects a Fotostrecke without photos', async () => {
    expect(await photoStripErrors({})).not.toHaveLength(0)
  })

  it('rejects a Fotostrecke with a single photo', async () => {
    expect(await photoStripErrors({ photos: [photo('a')] })).not.toHaveLength(
      0,
    )
  })

  it('accepts a Fotostrecke with two photos', async () => {
    expect(
      await photoStripErrors({ photos: [photo('a'), photo('b')] }),
    ).toHaveLength(0)
  })
})
