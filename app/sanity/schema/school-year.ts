// Defines sanity types for a school year

import { CalendarIcon } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'schoolYear',
  title: 'Schuljahr',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'start',
      title: 'Start',
      type: 'date',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'end',
      title: 'Ende',
      type: 'date',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'costs',
      title: 'Kosten',
      type: 'reference',
      to: [{ type: 'costs' }],
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    // start year - end year eg. 2024/25
    select: {
      start: 'start',
      end: 'end',
    },
    prepare(selection) {
      const { start, end } = selection as any
      return {
        title: `${getSchoolYear(start, end)}`,
      }
    },
  },
})

export function getSchoolYear(startDate: string, endDate: string) {
  const startYear = new Date(startDate).getFullYear()
  const endYear = new Date(endDate).getFullYear()
  return `${startYear}/${endYear.toString().slice(-2)}`
}
