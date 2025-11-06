import { GraduationCapIcon } from 'lucide-react'
import React from 'react'
import { defineArrayMember, defineField, defineType, set, useFormValue } from 'sanity'
import type { StringInputProps } from 'sanity'
import { z } from 'zod'
import { PersonSchema } from '#app/routes/ueber-uns+/_index.query.ts'

// Custom dropdown component to select featured photo from the photos array
function FeaturedPhotoSelector(props: StringInputProps) {
	// Get all photos from the current document
	const photos = useFormValue(['photos']) as Array<{
		_key: string
		takenAt: string
		motto?: string
		asset?: { _ref: string }
	}> | undefined

	// Sort photos by date (newest first) for consistent ordering
	const sortedPhotos = photos
		? [...photos].sort((a, b) =>
				new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime()
			)
		: []

	return (
		<div>
			<select
				id={props.id}
				value={props.value || ''}
				onChange={(event) => {
					const newValue = event.target.value || undefined
					props.onChange(newValue ? set(newValue) : set(undefined))
				}}
				style={{
					width: '100%',
					padding: '8px 12px',
					fontSize: '14px',
					border: '1px solid #d1d5db',
					borderRadius: '4px',
					backgroundColor: 'white',
					cursor: 'pointer',
				}}
			>
				<option value="">Neuestes Foto (Standard)</option>
				{sortedPhotos.map((photo) => {
					const date = new Date(photo.takenAt)
					const year = date.getFullYear()
					const label = photo.motto
						? `${year} - ${photo.motto}`
						: `${year}`

					return (
						<option key={photo._key} value={photo._key}>
							{label}
						</option>
					)
				})}
			</select>
			<p
				style={{
					marginTop: '8px',
					fontSize: '12px',
					color: '#6b7280',
				}}
			>
				Wähle ein Foto aus, das anstelle des neuesten Fotos angezeigt werden soll.
			</p>
		</div>
	)
}

// Define the Photo schema
export const PhotoSchema = z.object({
  _key: z.string(),
  takenAt: z.coerce.date(),
  motto: z.string().optional().nullable(),
  caption: z.string().optional().nullable(),
  attribution: z.string().optional().nullable(),
  alt: z.string().optional().nullable(),
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
  featuredPhoto: z.string().optional().nullable(),
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
  { name: 'rho', symbol: 'ρ' },
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
      name: 'motto',
      type: 'string',
      title: 'Motto',
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
      const year = date ? new Date(date).getFullYear().toString() : ''
      const ref = asset?._ref || ''
      return {
        media: asset,
        title: year,
        subtitle: ref,
      }
    },
  },
})

export default defineType({
  // this should be named class
  name: 'year',
  title: 'Jahrgang',
  type: 'document',
  icon: GraduationCapIcon,
  fields: [
    defineField({
      name: 'photos',
      type: 'array',
      of: [defineArrayMember(yearPhoto)],
    }),
    defineField({
      name: 'featuredPhoto',
      title: 'Hauptfoto',
      type: 'string',
      description: 'Wähle ein Foto aus, das anstelle des neuesten Fotos angezeigt werden soll. Falls leer, wird das neueste Foto (nach Datum) verwendet.',
      components: {
        input: FeaturedPhotoSelector,
      },
    }),
    defineField({
      name: 'mentor',
      title: 'Mentor',
      type: 'reference',
      description:
        'Der Mentor des Jahrgangs; es können alle Personen ausgewählt werden, auch die, die nicht als Mentor markiert sind.',
      to: [
        {
          type: 'person',
        },
      ],
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
  orderings: [
    {
      name: 'startedAt',
      title: 'Start (absteigend)',
      by: [{ field: 'startedAt', direction: 'desc' }],
    },
    {
      name: 'startedAt',
      title: 'Start (aufsteigend)',
      by: [{ field: 'startedAt', direction: 'asc' }],
    },
    {
      name: 'graduatedAt',
      title: 'Ende (absteigend)',
      by: [{ field: 'graduatedAt', direction: 'desc' }],
    },
    {
      name: 'graduatedAt',
      title: 'Ende (aufsteigend)',
      by: [{ field: 'graduatedAt', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      letter: 'letter',
      photos: 'photos',
      graduatedAt: 'graduatedAt',
      startedAt: 'startedAt',
      mentorGivenNames: 'mentor.givenNames',
      mentorFamilyName: 'mentor.familyName',
    },
    prepare(selection) {
      const {
        letter,
        photos,
        mentorGivenNames,
        mentorFamilyName,
        graduatedAt,
        startedAt,
      } = selection as Pick<Year, 'letter' | 'photos'> & {
        mentorGivenNames: string
        mentorFamilyName: string
        graduatedAt: Date | null
        startedAt: Date
      }
      const latestPhoto = photos?.length
        ? photos?.sort(({ takenAt }) => new Date(takenAt).getTime())[0]
        : undefined
      return {
        media: latestPhoto?.asset,
        title: `${letter} ${alphabetMap[letter]} ${
          mentorGivenNames && mentorFamilyName
            ? `(${mentorGivenNames} ${mentorFamilyName})`
            : ''
        }`,
        subtitle: `${new Date(startedAt).getFullYear()} - ${
          graduatedAt ? new Date(graduatedAt).getFullYear() : ''
        }`,
      }
    },
  },
})
