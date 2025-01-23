import { CameraIcon, ClipboardIcon } from 'lucide-react'
import { defineField, defineArrayMember, defineType } from 'sanity'

export const curriculum = defineType({
  name: 'curriculum',
  title: 'Curriculum',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Beschreibung',
    }),
    {
      name: 'years',
      type: 'array',
      title: 'Jahre',
      of: [
        {
          type: 'object',
          title: 'Jahr',
          fields: [
            {
              name: 'yearNumber',
              type: 'number',
              title: 'Jahr',
              validation: Rule => Rule.required().min(1).max(5),
            },
            {
              name: 'title',
              type: 'string',
              title: 'Titel',
              validation: Rule => Rule.required(),
            },
            {
              name: 'description',
              type: 'text',
              title: 'Beschreibung',
              validation: Rule => Rule.required(),
            },
            {
              name: 'projects',
              type: 'array',
              title: 'Projekte',
              of: [{ type: 'reference', to: [{ type: 'project' }] }],
            },
            {
              name: 'externalExams',
              type: 'array',
              title: 'Externe Prüfungen',
              of: [{ type: 'string' }],
            },
          ],
        },
      ],
      validation: Rule => Rule.required().length(5),
    },
  ],
})

export const photo = defineField({
  name: 'photo',
  title: 'Foto',
  type: 'image',
  icon: CameraIcon,
  options: {
    hotspot: true,
    metadata: ['blurhash', 'lqip', 'palette', 'image', 'exif', 'location'],
  },
  fields: [
    defineField({
      name: 'caption',
      type: 'string',
      title: 'Caption',
    }),
  ],
})

export const project = defineType({
  name: 'project',
  title: 'Projekt',
  type: 'document',
  icon: ClipboardIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Beschreibung',
    }),
    defineField({
      name: 'photos',
      title: 'Fotos',
      type: 'array',
      of: [defineArrayMember(photo)],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'photos.0.asset',
    },
    prepare(selection) {
      const { title, media } = selection
      return {
        title,
        media,
      }
    },
  },
})
