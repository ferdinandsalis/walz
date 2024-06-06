import { GraduationCapIcon } from 'lucide-react'
import { defineArrayMember, defineField, defineType } from 'sanity'
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
  name: string
  symbol: string
}

export const ALPHABET: GreekLetter[] = [
  { name: 'alpha', symbol: 'α' },
  { name: 'beta', symbol: 'β' },
  { name: 'gamma', symbol: 'γ' },
  { name: 'delta', symbol: 'δ' },
  { name: 'epsilon', symbol: 'ε' },
  { name: 'zeta', symbol: 'ζ' },
  { name: 'eta', symbol: 'η' },
  { name: 'theta', symbol: 'θ' },
  { name: 'iota', symbol: 'ι' },
  { name: 'kappa', symbol: 'κ' },
  { name: 'lambda', symbol: 'λ' },
  { name: 'my', symbol: 'μ' },
  { name: 'ny', symbol: 'ν' },
  { name: 'xi', symbol: 'ξ' },
  { name: 'omikron', symbol: 'ο' },
  { name: 'pi', symbol: 'π' },
  { name: 'hho', symbol: 'ρ' },
  { name: 'sigma', symbol: 'σ' },
  { name: 'tau', symbol: 'τ' },
  { name: 'ypsilon', symbol: 'υ' },
  { name: 'phi', symbol: 'φ' },
  { name: 'chi', symbol: 'χ' },
  { name: 'psi', symbol: 'ψ' },
  { name: 'omega', symbol: 'ω' },
]

export const alphabetMap = ALPHABET.reduce(
  (agg: { [key: string]: string }, { name, symbol }) => {
    agg[name] = symbol
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
        list: ALPHABET.map(({ name }) => ({
          title: name,
          value: name,
        })),
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
