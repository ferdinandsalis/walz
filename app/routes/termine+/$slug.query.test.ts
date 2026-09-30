import { evaluate, parse } from 'groq-js'
import { describe, expect, it } from 'vitest'
import { EventSchema } from '#app/sanity/models/event.ts'
import { eventBySlugQuery } from './$slug.query.ts'

const fileUrl =
  'https://cdn.sanity.io/files/iaejvb99/production/28d7aadc644103a43c3edef43e8d8d793d4ad989.jpg'

const dataset = [
  {
    _id: 'event-tag-der-offenen-tuer',
    _type: 'event',
    title: 'Tag der offenen Tür',
    slug: { _type: 'slug', current: 'tag-der-offenen-tuer' },
    start: { date: '2025-11-15', time: '15:00' },
    type: 'orientation',
    attachments: [
      {
        _key: '9a25ecb4e298',
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: 'file-28d7aadc644103a43c3edef43e8d8d793d4ad989-jpg',
        },
      },
    ],
  },
  {
    _id: 'file-28d7aadc644103a43c3edef43e8d8d793d4ad989-jpg',
    _type: 'sanity.fileAsset',
    url: fileUrl,
  },
]

describe('eventBySlugQuery', () => {
  it('resolves each attachment to its file URL', async () => {
    const result = await evaluate(parse(eventBySlugQuery), {
      dataset,
      params: { slug: 'tag-der-offenen-tuer' },
    })

    const event = EventSchema.parse(await result.get())

    expect(event.attachments).toEqual([
      { _type: 'file', asset: { url: fileUrl } },
    ])
  })
})
