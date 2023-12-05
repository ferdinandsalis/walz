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
      name: 'description',
      type: 'string',
      title: 'Beschreibung',
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
        ]
      }
    },

    {
      name: 'givenNames',
      type: 'string',
      title: 'Vorname(n)',
    },
    {
      name: 'familyName',
      type: 'string',
      title: 'Nachname',
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
}
