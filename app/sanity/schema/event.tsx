import { Calendar1Icon } from 'lucide-react'
import { defineField, defineType, type ObjectInputProps } from 'sanity'
import { z } from 'zod'

export const AttachmentSchema = z.object({
  _type: z.literal('file'),
  asset: z.object({
    _type: z.literal('reference'),
    _ref: z.string(),
    url: z.string(),
  }),
})

export const EventSchema = z.object({
  _id: z.string(),
  _type: z.literal('event'),
  title: z.string(),
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
      return 'Vortrag'
    case 'holiday':
      return 'Ferien'
    case 'theater':
      return 'Theater'
    case 'exam':
      return 'Prüfung'
    case 'project':
      return 'Projekt'
    default:
      return type
  }
}

function MyTimeInput(props: ObjectInputProps) {
  return <input type="time" {...props.elementProps} />
}

export default defineType({
  name: 'event',
  title: 'Ereignis',
  type: 'document',
  icon: Calendar1Icon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Titel',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'array',
      title: 'Beschreibung',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
        },
      ],
    }),
    defineField({
      name: 'cover',
      type: 'image',
      title: 'Deckbild',
      description: 'Bild für das Ereignis',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'location',
      type: 'string',
      title: 'Ort',
    }),
    defineField({
      name: 'type',
      type: 'string',
      title: 'Typ',
      options: {
        layout: 'dropdown',
        list: [
          { title: 'Allgemein', value: 'general' },
          { title: 'Vortrag', value: 'talk' },
          { title: 'Ferien', value: 'holiday' },
          { title: 'Theater', value: 'theater' },
          { title: 'Prüfung', value: 'exam' },
          { title: 'Projekt', value: 'project' },
          { title: 'Kennenlernen', value: 'orientation' },
        ],
      },
    }),
    defineField({
      name: 'year',
      type: 'reference',
      title: 'Jahrgang',
      to: [{ type: 'year' }],
      weak: true,
    }),
    defineField({
      name: 'attachments',
      type: 'array',
      title: 'Anhänge',
      of: [{ type: 'file' }],
      options: {
        layout: 'grid',
      },
    }),
    // timezone is constant for all events and for start and end
    defineField({
      name: 'timeZone',
      type: 'string',
      title: 'Zeitzone',
      hidden: true,
      initialValue: 'Europe/Vienna',
    }),
    defineField({
      name: 'start',
      type: 'object',
      title: 'Start',
      validation: rule => rule.required(),
      fields: [
        defineField({
          name: 'date',
          type: 'date',
          title: 'Datum',
          validation: rule => rule.required(),
        }),
        defineField({
          name: 'time',
          type: 'string',
          title: 'Uhrzeit',
          validation: rule =>
            rule.custom(time => {
              if (time && /^\d{2}:\d{2}$/.test(time)) {
                return true
              } else if (!!time) {
                return 'Ungültiges Zeitformat'
              }
              return true
            }),
          components: {
            // @ts-ignore
            input: MyTimeInput,
          },
        }),
      ],
    }),
    defineField({
      name: 'end',
      type: 'object',
      title: 'Ende',
      validation: rule =>
        rule.custom((end, context) => {
          if (end?.date && end?.time) {
            return true
          }
          if (!end?.date && end?.time) {
            return 'Enddatum fehlt'
          }
          if (end?.date && context.document?.start) {
            // @ts-ignore
            const startDate = new Date(context.document.start.date)
            // @ts-ignore
            const endDate = new Date(end.date)
            if (endDate < startDate) {
              return 'Enddatum liegt vor dem Startdatum'
            }
          }
          return true
        }),
      fields: [
        defineField({
          name: 'date',
          type: 'date',
          title: 'Datum',
        }),
        defineField({
          name: 'time',
          type: 'string',
          title: 'Uhrzeit',
          validation: rule =>
            rule.custom(time => {
              if (time && /^\d{2}:\d{2}$/.test(time)) {
                return true
              } else if (!!time) {
                return 'Ungültiges Zeitformat'
              }
              return true
            }),
          components: {
            // @ts-ignore
            input: MyTimeInput,
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      start: 'start',
      end: 'end',
      type: 'type',
    },
    prepare({ title, start, end, type }) {
      const startString = new Date(start?.date).toLocaleDateString('de-AT')
      const endString = end?.date
        ? new Date(end.date).toLocaleDateString('de-AT')
        : null
      return {
        title: `${type ? `${tType(type)}: ` : ''}${title}`,
        subtitle: endString ? `${startString} – ${endString}` : startString,
      }
    },
  },
  orderings: [
    {
      title: 'Startdatum, Absteigend',
      name: 'start',
      by: [{ field: 'start.date', direction: 'desc' }],
    },
  ],
})
