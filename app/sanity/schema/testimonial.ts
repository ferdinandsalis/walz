import { VoicemailIcon } from 'lucide-react'
import { defineField, defineType } from 'sanity'
import { z } from 'zod'

export const Testimonial = z.object({
  name: z.string(),
  quote: z.string(),
  year: z.string(),
  photo: z.object({
    attribution: z.string().optional(),
    alt: z.string().optional(),
    asset: z.any(),
  }),
})

export type Testimonial = z.infer<typeof Testimonial>

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: VoicemailIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: Rule => Rule.required(),
    }),
    // reference year type to get the year of the testimonial
    defineField({
      name: 'year',
      type: 'reference',
      title: 'Jahr',
      to: [{ type: 'year' }],
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'quote',
      type: 'text',
      title: 'Zitat',
      validation: Rule => Rule.required(),
    }),
    // Photo of the person giving the testimonial
    defineField({
      name: 'photo',
      type: 'image',
      title: 'Foto',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'attribution',
          type: 'string',
          title: 'Bildverweis',
        },
        {
          name: 'alt',
          type: 'string',
          title: 'Alternativ Text',
        },
      ],
    }),
  ],
})
