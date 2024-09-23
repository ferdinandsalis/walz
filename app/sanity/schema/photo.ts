import { CameraIcon } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'photo',
  title: 'Foto',
  type: 'document',
  icon: CameraIcon,
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'caputuredAt',
          type: 'datetime',
          title: 'Captured at',
          description: 'Date and time the image was captured.',
          validation: Rule => Rule.required(),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Image caption',
          description: 'Caption displayed below the image.',
          validation: Rule => Rule.required(),
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
  ],
  preview: {
    select: {
      title: 'image.caption',
      media: 'image',
    },
  },
})
