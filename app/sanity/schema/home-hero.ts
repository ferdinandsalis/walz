import { defineField } from 'sanity'

export default {
  name: 'home-hero',
  title: 'Home Hero',
  type: 'document',
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Titel',
    }),
    defineField({
      name: 'image',
      title: 'Hauptbild',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: Rule => Rule.required(),
    }),
  ],
}
