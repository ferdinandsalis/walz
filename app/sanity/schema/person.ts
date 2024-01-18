import { UserIcon } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  icon: UserIcon,
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: 'portrait',
      type: 'image',
      title: 'Portrait',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'caption',
          type: 'string',
          title: 'Image caption',
          description: 'Caption displayed below the image.',
        },
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessiblity.',
        },
        {
          name: 'attribution',
          type: 'string',
          title: 'Image attribution',
          description: 'Attribution of the image.',
        },
      ],
    }),
    defineField({
      name: 'givenNames',
      type: 'string',
      title: 'Vorname(n)',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'familyName',
      type: 'string',
      title: 'Nachname',
      validation: Rule => [Rule.required()],
    }),
    defineField({
      name: 'description',
      type: 'string',
      title: 'Beschreibung',
      validation: Rule => Rule.required().min(4).max(40),
    }),
    {
      name: 'roles',
      title: 'Rolle(n)',
      type: 'array',
      of: [
        {
          type: 'string',
        },
      ],
      options: {
        layout: 'radio',
        list: [
          { title: 'Leitung', value: 'leadership' },
          { title: 'Mentor', value: 'mentor' },
          { title: 'Projektleiter', value: 'project_lead' },
          { title: 'Administrator', value: 'administrator' },
          { title: 'Therapeut', value: 'therapist' },
        ],
      },
      validation: Rule => [Rule.required()],
    },

    defineField({
      name: 'email',
      type: 'string',
      title: 'Email',
    }),
    defineField({
      name: 'phone',
      type: 'string',
      title: 'Telefon',
    }),
    defineField({
      name: 'website',
      type: 'url',
      title: 'Webseite',
    }),
  ],
  preview: {
    select: {
      givenNames: 'givenNames',
      familyName: 'familyName',
      portrait: 'portrait',
    },
    prepare(selection) {
      const { givenNames, familyName, portrait } = selection
      return { media: portrait, title: `${familyName}, ${givenNames}` }
    },
  },
})
