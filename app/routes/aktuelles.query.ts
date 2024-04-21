import groq from 'groq'
import { z } from 'zod'
import { PersonSchema } from './ueber-uns+/_index.query.ts'
import { PhotoSchema } from '#app/sanity/schema/year.ts'

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
  }),
  photos: z.array(PhotoSchema),
  plan: z.string(),
})

export type Year = z.infer<typeof YearSchema>

// @ts-ignore
export const query = groq`{
  "posts": *[_type == "post"] | order(publishedAt desc) {
    _id,
    _type,
    title,
    cover,
    previewText,
    slug,
    publishedAt
  },
  "years": *[_type == "year"] | order(startedAt desc) {
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
}` as string

export type QueryResult = {
  posts: Post[]
  years: Year[]
}
