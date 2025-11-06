import { MicVocalIcon } from 'lucide-react'
import { defineField, defineType } from 'sanity'
import { z } from 'zod'
import { alphabetMap } from './year.tsx'

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
  title: 'Erfahrungsberichte',
  type: 'document',
  icon: MicVocalIcon,
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
    defineField({
      name: 'achievement',
      type: 'string',
      title: 'Erfolg',
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
  preview: {
    select: {
      name: 'name',
      yearLetter: 'year.letter',
      yearStartedAt: 'year.startedAt',
      yearGraduatedAt: 'year.graduatedAt',
      quote: 'quote',
      photo: 'photo.asset',
    },
    prepare({
      name,
      yearLetter,
      yearStartedAt,
      yearGraduatedAt,
      photo,
      quote,
    }) {
      return {
        title: `${name} ${alphabetMap[yearLetter]}`,
        subtitle: `${new Date(yearStartedAt).getFullYear()} - ${yearGraduatedAt ? new Date(yearGraduatedAt).getFullYear() : ''}`,
        media: photo,
        description: quote,
      }
    },
  },
})
