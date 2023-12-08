import { SchemaTypeDefinition } from 'sanity'

export default {
  name: 'person',
  title: 'Person',
  type: 'document',
  options: {
    hotspot: true,
  },
  fields: [
    {
      name: 'portrait',
      type: 'image',
      title: 'Portrait',
    },
    {
      name: 'givenNames',
      type: 'string',
      title: 'Vorname(n)',
      validation: Rule => Rule.required(),
    },
    {
      name: 'familyName',
      type: 'string',
      title: 'Nachname',
      validation: Rule => [Rule.required()],
    },

    {
      name: 'description',
      type: 'string',
      title: 'Beschreibung',
      validation: Rule => Rule.required().min(8).max(40),
    },

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

    {
      name: 'email',
      type: 'string',
      title: 'Email',
    },
    {
      name: 'phone',
      type: 'string',
      title: 'Telefon',
    },
    {
      name: 'website',
      type: 'url',
      title: 'Webseite',
    },
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
} as SchemaTypeDefinition
