import { GraduationCap } from '@phosphor-icons/react'
import React from 'react'
import {
  defineArrayMember,
  defineField,
  defineType,
  set,
  useFormValue,
  type StringInputProps,
} from 'sanity'
import { ALPHABET, alphabetMap, type Year } from '#app/sanity/models/year.ts'

// Custom dropdown component to select featured photo from the photos array
function FeaturedPhotoSelector(props: StringInputProps) {
  // Get all photos from the current document
  const photos = useFormValue(['photos']) as
    | Array<{
        _key: string
        takenAt: string
        motto?: string
        asset?: { _ref: string }
      }>
    | undefined

  // Sort photos by date (newest first) for consistent ordering
  const sortedPhotos = photos
    ? [...photos].sort(
        (a, b) => new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime(),
      )
    : []

  return (
    <div>
      <select
        id={props.id}
        value={props.value || ''}
        onChange={event => {
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
        {sortedPhotos.map(photo => {
          const date = new Date(photo.takenAt)
          const year = date.getFullYear()
          const label = photo.motto ? `${year} - ${photo.motto}` : `${year}`

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
        Wähle ein Foto aus, das anstelle des neuesten Fotos angezeigt werden
        soll.
      </p>
    </div>
  )
}

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
  icon: GraduationCap,
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
      description:
        'Wähle ein Foto aus, das anstelle des neuesten Fotos angezeigt werden soll. Falls leer, wird das neueste Foto (nach Datum) verwendet.',
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
