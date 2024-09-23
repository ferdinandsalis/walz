import { defineField, defineArrayMember, defineType } from 'sanity'

export const Curriculum = defineType({
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
      title: 'Description',
      validation: Rule => Rule.required(),
    }),
    // field for the curriculum's year
    // there are a total of 5 years in the curriculum
  ],
})

export const CurriculumYear = defineType({
  name: 'curriculum-year',
  title: 'Curriculum Year',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'projects',
      type: 'array',
      title: 'Projekte',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'project' }] })],
      validation: Rule => Rule.required(),
    }),
  ],
})
