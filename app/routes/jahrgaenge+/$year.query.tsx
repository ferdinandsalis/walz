import groq from 'groq'
import { z } from 'zod'
import { PersonSchema } from '../ueber-uns+/_index.query.ts'
import { PhotoSchema } from '#app/sanity/schema/year.ts'

// @ts-ignore
export const query = groq`
  *[_type == "year" && letter == $year][0] {
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
    photos
  }
` as string

export const YearSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  startedAt: z.coerce.date(),
  graduatedAt: z.coerce.date().nullable(),
  plan: z.string(),
  letter: z.string(),
  mentor: PersonSchema.pick({ givenNames: true, familyName: true }).extend({
    name: z.string(),
  }),
  photos: z.array(PhotoSchema),
})

export type Year = z.infer<typeof YearSchema>

export type QueryResult = Year
