import { Calendar } from '@phosphor-icons/react'
import { defineField, defineType, type ObjectInputProps } from 'sanity'
import { tType } from '#app/sanity/models/event.ts'

function MyTimeInput(props: ObjectInputProps) {
  return <input type="time" {...props.elementProps} />
}

export default defineType({
  name: 'event',
  title: 'Ereignis',
  type: 'document',
  icon: Calendar,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Titel',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description:
        'Eindeutiger Pfad für den direkten Link zu diesem Termin (/termine/…).',
      options: {
        source: doc => {
          const title = (doc.title as string | undefined) ?? ''
          const date = (doc.start as { date?: string } | undefined)?.date ?? ''
          return `${title} ${date}`.trim()
        },
        maxLength: 96,
      },
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
          { title: 'Präsentation', value: 'talk' },
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
