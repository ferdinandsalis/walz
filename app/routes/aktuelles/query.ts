import { defineQuery } from 'groq'
import { z } from 'zod'
import { PhotoSchema } from '#app/sanity/schema/year.ts'
import { PersonSchema } from '../ueber-uns+/_index.query.ts'

type Post = {
  title: string
  cover: any
  slug: { current: string }
  previewText: string
  publishedAt: string
}

export const YearSchema = z.object({
  letter: z.string(),
  startedAt: z.coerce.date(),
  graduatedAt: z.coerce.date().nullable(),
  mentor: PersonSchema.pick({ givenNames: true, familyName: true }).extend({
    name: z.string(),
    slug: z.object({ current: z.string() }),
  }),
  photos: z.array(PhotoSchema).nullable(),
  plan: z.string().nullable(),
})

export type Year = z.infer<typeof YearSchema>

export const aktuellesQuery = defineQuery(`{
  "posts": *[_type == "post"] | order(publishedAt desc) {
    _id,
    _type,
    title,
    cover,
    previewText,
    slug,
    publishedAt
  },
  // filter years by those with empty graduatedAt
  "years": *[_type == "year" && !defined(graduatedAt)] | order(startedAt desc) {
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
    photos | order(takenAt desc)
  }
}`)

export type QueryResult = {
  posts: Post[]
  years: Year[]
}
