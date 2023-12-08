import { SchemaTypeDefinition, defineField } from 'sanity'

// Beitrag

export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Titel',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Hauptbild',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    {
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 200, // will be ignored if slugify is set
        slugify: input =>
          input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
    },
    {
      title: 'Beitrag',
      name: 'body',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'publishedAt',
      title: 'Veröffentlichungsdatum',
      type: 'datetime',
    },
  ],
} as SchemaTypeDefinition
