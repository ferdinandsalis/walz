import { ImageIcon } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'home-hero',
  title: 'Home Hero',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Hauptbild',
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
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'image.caption',
      image: 'image',
    },
    prepare(selection) {
      const { title, image } = selection
      return { media: image, title: `${title}` }
    },
  },
})
