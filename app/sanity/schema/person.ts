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
      name: 'roles',
      type: 'array',
      of: [
        {
          type: 'string',
        },
      ],
    },
    {
      name: 'givenNames',
      type: 'string',
      title: 'Given Names',
    },
    {
      name: 'familyName',
      type: 'string',
      title: 'Family Name',
    },
    {
      name: 'email',
      type: 'string',
      title: 'Email',
    },
    {
      name: 'phone',
      type: 'string',
      title: 'Phone',
    },
    {
      name: 'website',
      type: 'string',
      title: 'Website',
    },
  ],
}
