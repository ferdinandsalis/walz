import { UserIcon } from 'lucide-react'
import { defineField, defineType } from 'sanity'
import { z } from 'zod'

export const PersonSchema = z.object({
  givenNames: z.string(),
  familyName: z.string(),
  portrait: z.any(),
  roles: z.array(z.string()),
  description: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  priority: z.number(),
  inactive: z.boolean(),
})

export type Person = z.infer<typeof PersonSchema>

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
      name: 'priority',
      type: 'number',
      title: 'Priorität',
    }),
    defineField({
      name: 'inactive',
      description: 'Person ist nicht mehr aktiv',
      type: 'boolean',
      title: 'Inaktiv',
      initialValue: false,
    }),
    defineField({
      name: 'givenNames',
      description: 'Vorname(n)',
      type: 'string',
      title: 'Vorname(n)',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'familyName',
      description: 'Nachname',
      type: 'string',
      title: 'Nachname',
      validation: Rule => [Rule.required()],
    }),
    defineField({
      name: 'description',
      type: 'string',
      title: 'Beschreibung',
      validation: Rule => Rule.required().min(4).max(60),
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
      // check
      options: {
        layout: 'list',
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
