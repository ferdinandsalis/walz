import { Newspaper } from '@phosphor-icons/react'
import { defineArrayMember, defineField, defineType } from 'sanity'

// Beitrag

const bodyImageFields = [
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
]

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: Newspaper,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Titel',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'cover',
      title: 'Titelbild',
      type: 'image',
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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: rule => rule.required(),
    }),
    defineField({
      title: 'Vorschautext',
      name: 'previewText',
      type: 'text',
      validation: Rule => Rule.required() && Rule.max(148),
    }),
    defineField({
      title: 'Beitrag',
      name: 'body',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: bodyImageFields,
        }),
        defineArrayMember({
          name: 'photoStrip',
          type: 'object',
          title: 'Fotostrecke',
          fields: [
            defineField({
              name: 'photos',
              title: 'Fotos',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'image',
                  options: {
                    hotspot: true,
                  },
                  fields: bodyImageFields,
                }),
              ],
              validation: Rule => Rule.required().min(2),
            }),
          ],
          preview: {
            select: {
              photos: 'photos',
            },
            prepare({ photos }) {
              const count = photos?.length ?? 0
              return {
                title: 'Fotostrecke',
                subtitle:
                  count === 0
                    ? 'Keine Fotos'
                    : `${count} ${count === 1 ? 'Foto' : 'Fotos'}`,
                media: photos?.[0],
              }
            },
          },
        }),
        defineArrayMember({
          type: 'block',
          marks: {
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'External link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                  {
                    title: 'Open in new tab',
                    name: 'blank',
                    description:
                      'Read https://css-tricks.com/use-target_blank/',
                    type: 'boolean',
                  },
                ],
              },
              {
                name: 'internalLink',
                type: 'object',
                title: 'Internal link',
                fields: [
                  {
                    name: 'reference',
                    type: 'reference',
                    title: 'Reference',
                    to: [{ type: 'post' }],
                  },
                ],
              },
            ],
          },
        }),
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Veröffentlichungsdatum',
      type: 'datetime',
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      cover: 'cover',
    },
    prepare(selection) {
      const { title, cover } = selection
      return { media: cover, title: `${title}` }
    },
  },
})
