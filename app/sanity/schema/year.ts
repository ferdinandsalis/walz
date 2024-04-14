import { defineArrayMember, defineField, defineType } from 'sanity'
import { GraduationCapIcon } from 'lucide-react'
import { z } from 'zod'
import { PersonSchema } from '#app/routes/ueber-uns+/_index.query.ts'

// Define the Photo schema
export const PhotoSchema = z.object({
  takenAt: z.coerce.date(),
  caption: z.string().optional(),
  attribution: z.string().optional(),
  alt: z.string().optional(),
  asset: z.any(),
})

export type Photo = z.infer<typeof PhotoSchema>

// Define the Year schema
export const YearSchema = z.object({
  letter: z.string(),
  startedAt: z.coerce.date(),
  graduatedAt: z.coerce.date().nullable(),
  mentor: PersonSchema,
  photos: z.array(PhotoSchema),
  plan: z.any(),
})

export type Year = z.infer<typeof YearSchema>

type GreekLetter = {
  title: string
  value: string
}

export const ALPHABET: GreekLetter[] = [
  { title: 'Alpha', value: 'α' },
  { title: 'Beta', value: 'β' },
  { title: 'Gamma', value: 'γ' },
  { title: 'Delta', value: 'δ' },
  { title: 'Epsilon', value: 'ε' },
  { title: 'Zeta', value: 'ζ' },
  { title: 'Eta', value: 'η' },
  { title: 'Theta', value: 'θ' },
  { title: 'Iota', value: 'ι' },
  { title: 'Kappa', value: 'κ' },
  { title: 'Lambda', value: 'λ' },
  { title: 'My', value: 'μ' },
  { title: 'Ny', value: 'ν' },
  { title: 'Xi', value: 'ξ' },
  { title: 'Omikron', value: 'ο' },
  { title: 'Pi', value: 'π' },
  { title: 'Rho', value: 'ρ' },
  { title: 'Sigma', value: 'σ' },
  { title: 'Tau', value: 'τ' },
  { title: 'Ypsilon', value: 'υ' },
  { title: 'Phi', value: 'φ' },
  { title: 'Chi', value: 'χ' },
  { title: 'Psi', value: 'ψ' },
  { title: 'Omega', value: 'ω' },
]

export const alphabetMap = ALPHABET.reduce(
  (agg: { [key: string]: string }, { value, title }) => {
    agg[value] = title
    return agg
  },
  {},
)

const yearPhoto = defineField({
  name: 'photo',
  type: 'image',
  title: 'Photo',
  options: {
    hotspot: true,
  },
  fields: [
    {
      name: 'takenAt',
      type: 'date',
      title: 'Fotografiert am',
      validation: rule => rule.required(),
    },
    {
      name: 'caption',
      type: 'string',
      title: 'Bildbeschreibung',
    },
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
  preview: {
    select: {
      date: 'takenAt',
      asset: 'asset',
    },
    prepare(selection) {
      const { date, asset } = selection as any
      return {
        media: asset,
        title: `${date ? new Date(date).getFullYear() : ''}`,
      }
    },
  },
})

export default defineType({
  name: 'year',
  title: 'Jahrgang',
  type: 'document',
  icon: GraduationCapIcon,
  fields: [
    defineField({
      name: 'photos',
      type: 'array',
      of: [defineArrayMember(yearPhoto)],
      validation: Rule => Rule.required().min(1),
    }),
    defineField({
      name: 'mentor',
      title: 'Mentor',
      type: 'reference',
      options: {
        filter: '$role in roles',
        filterParams: { role: 'mentor' },
      },
      to: [
        {
          type: 'person',
        },
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'letter',
      type: 'string',
      title: 'Buchstabe',
      options: {
        list: ALPHABET.map(({ title, value }) => ({ title, value })),
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'startedAt',
      title: 'Start',
      type: 'date',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'graduatedAt',
      title: 'Ende',
      type: 'date',
    }),
    defineField({
      name: 'plan',
      type: 'file',
      title: 'Jahresplan',
    }),
  ],
  preview: {
    select: {
      letter: 'letter',
      photos: 'photos',
      mentorGivenNames: 'mentor.givenNames',
      mentorFamilyName: 'mentor.familyName',
    },
    prepare(selection) {
      const { letter, photos, mentorGivenNames, mentorFamilyName } =
        selection as Pick<Year, 'letter' | 'photos'> & {
          mentorGivenNames: string
          mentorFamilyName: string
        }
      const latestPhoto = photos?.length
        ? photos?.sort(({ takenAt }) => takenAt.getTime())[0]
        : undefined
      return {
        media: latestPhoto?.asset,
        title: `${letter} ${alphabetMap[letter]} (${mentorGivenNames} ${mentorFamilyName})`,
      }
    },
  },
})
