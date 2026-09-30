import { z } from 'zod'

export const AttachmentSchema = z.object({
  _type: z.literal('file'),
  asset: z
    .object({
      url: z.string(),
    })
    .nullable(),
})

export const EventSchema = z.object({
  _id: z.string(),
  _type: z.literal('event'),
  title: z.string(),
  slug: z.string().nullable().optional(),
  location: z.string().nullable(),
  cover: z
    .object({
      _type: z.literal('image'),
      asset: z.object({
        _ref: z.string(),
      }),
    })
    .optional()
    .nullable(),
  description: z.array(z.any()).nullable(),
  start: z.object({
    date: z.coerce.date(),
    time: z.string().optional(),
  }),
  end: z
    .object({
      date: z.coerce.date().optional(),
      time: z.string().optional(),
    })
    .nullable(),
  type: z
    .union([
      z.literal('general'),
      z.literal('talk'),
      z.literal('holiday'),
      z.literal('theater'),
      z.literal('exam'),
      z.literal('project'),
      z.literal('orientation'),
    ])
    .nullable(),
  attachments: z.array(AttachmentSchema).nullable().optional(),
})

export function tType(type: Event['type']) {
  switch (type) {
    case 'general':
      return 'Allgemein'
    case 'talk':
      return 'Präsentation'
    case 'holiday':
      return 'Ferien'
    case 'theater':
      return 'Theater'
    case 'exam':
      return 'Prüfung'
    case 'project':
      return 'Projekt'
    case 'orientation':
      return 'Kennenlernen'
    default:
      return type
  }
}
