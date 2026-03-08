import { ChatCircleText } from '@phosphor-icons/react'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'home-shoutout',
  title: 'Home Shoutout Box',
  type: 'document',
  icon: ChatCircleText,
  orderings: [
    {
      title: 'Reihenfolge (Neueste zuerst)',
      name: 'createdAtDesc',
      by: [{ field: '_createdAt', direction: 'desc' }]
    },
    {
      title: 'Reihenfolge (Älteste zuerst)', 
      name: 'createdAtAsc',
      by: [{ field: '_createdAt', direction: 'asc' }]
    }
  ],
  fields: [
    defineField({
      name: 'emoji',
      title: 'Emoji',
      type: 'string',
      description: 'Optional: Emoji das vor dem Titel angezeigt wird (z.B. 👋)',
      validation: Rule => Rule.max(10),
    }),
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'text',
      description: 'Haupttext der Shoutout Box',
      validation: Rule => Rule.required().max(200),
      rows: 3,
    }),
    defineField({
      name: 'subtitle',
      title: 'Untertitel',
      type: 'text',
      description: 'Optional: Zusätzlicher Text unter dem Titel',
      validation: Rule => Rule.max(300),
      rows: 2,
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      description: 'Optional: Text für den Button. Wenn leer, wird kein Button angezeigt.',
      validation: Rule => Rule.max(50),
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button Link',
      type: 'string',
      description: 'Link für den Button. Erforderlich wenn Button Text gesetzt ist.',
      validation: Rule => 
        Rule.custom((buttonLink, context) => {
          const buttonText = (context.parent as any)?.buttonText
          if (buttonText && !buttonLink) {
            return 'Button Link ist erforderlich wenn Button Text gesetzt ist.'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      emoji: 'emoji',
      createdAt: '_createdAt'
    },
    prepare(selection) {
      const { title, emoji, createdAt } = selection
      const displayEmoji = emoji ? `${emoji} ` : ''
      const createdDate = createdAt ? new Date(createdAt).toLocaleDateString('de-DE') : ''
      
      return { 
        title: `${displayEmoji}${title || 'Ohne Titel'}`,
        subtitle: createdDate,
        media: () => '📋'
      }
    },
  },
})