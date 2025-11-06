import { defineQuery } from 'groq'
import { z } from 'zod'
import { PhotoSchema } from '#app/sanity/schema/year.tsx'
import { PersonSchema } from '../ueber-uns+/_index.query.ts'

export const yearQuery = defineQuery(`
  *[_type == "year" && letter == $letter && startedAt match $startedAt + "*"][0] {
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
    },
    photos | order(takenAt desc),
    featuredPhoto
  }
`)

export const YearSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  startedAt: z.coerce.date(),
  graduatedAt: z.coerce.date().nullable(),
  plan: z.string().nullable(),
  letter: z.string(),
  mentor: PersonSchema.pick({ givenNames: true, familyName: true }).extend({
    name: z.string(),
  }),
  photos: z.array(PhotoSchema).nullable(),
  featuredPhoto: z.string().optional().nullable(),
})

export type Year = z.infer<typeof YearSchema>

export type QueryResult = Year
