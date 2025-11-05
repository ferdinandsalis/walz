import { defineQuery } from 'groq'
import { z } from 'zod'
import { PhotoSchema } from '#app/sanity/schema/year.ts'
import { PersonSchema } from '../ueber-uns+/_index.query.ts'

export const jahrgaengeQuery = defineQuery(`{
  "currentYears": *[_type == "year" && !defined(graduatedAt)] | order(startedAt desc) {
    _id,
    _type,
    startedAt,
    graduatedAt,
    "plan": plan.asset->url,
    letter,
    mentor->{
      familyName,
      givenNames,
      "name": givenNames + " " + familyName,
      slug
    },
    photos | order(takenAt desc),
    featuredPhoto {
      asset {
        _ref,
        _type
      }
    }
  },
  "alumniYears": *[_type == "year" && defined(graduatedAt)] | order(graduatedAt desc) {
    _id,
    _type,
    startedAt,
    graduatedAt,
    "plan": plan.asset->url,
    letter,
    mentor->{
      familyName,
      givenNames,
      "name": givenNames + " " + familyName,
      slug
    },
    photos | order(takenAt desc),
    featuredPhoto {
      asset {
        _ref,
        _type
      }
    }
  }
}`)

export const YearSchema = z.object({
  _id: z.string(),
  _type: z.literal('year'),
  letter: z.string(),
  startedAt: z.coerce.date(),
  graduatedAt: z.coerce.date().nullable(),
  mentor: PersonSchema.pick({ givenNames: true, familyName: true }).extend({
    name: z.string(),
    slug: z.object({ current: z.string() }),
  }).nullable(),
  photos: z.array(PhotoSchema).nullable(),
  plan: z.string().nullable(),
  featuredPhoto: z.object({
    asset: z.object({
      _ref: z.string(),
      _type: z.string(),
    }).optional(),
  }).optional().nullable(),
})

export type Year = z.infer<typeof YearSchema>

export type QueryResult = {
  currentYears: Year[]
  alumniYears: Year[]
}