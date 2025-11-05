import { defineQuery } from 'groq'
import { z } from 'zod'
import { type EventSchema } from '#app/sanity/schema/event.tsx'
import { PhotoSchema } from '#app/sanity/schema/year.ts'
import { PersonSchema } from '../ueber-uns+/_index.query.ts'

export const aktuellesQuery = defineQuery(`{
  "posts": *[_type == "post"] | order(publishedAt desc)[0...3] {
    _id,
    _type,
    title,
    cover,
    previewText,
    slug,
    publishedAt
  },
  // sort by start date from and till a date; exclude holidays
  "events": *[_type == "event" && start.date >= $fromDate && start.date <= $toDate && type != "holiday"] | order(start.date asc) {
    _id,
    _type,
    title,
    location,
    description,
    start,
    end,
    type,
    attachments {
      _type,
      asset->{
        url
      }
    }
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
    photos | order(takenAt desc),
    featuredPhoto {
      asset {
        _ref,
        _type
      }
    }
  }
}`)

type Event = z.infer<typeof EventSchema>

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
  featuredPhoto: z.object({
    asset: z.object({
      _ref: z.string(),
      _type: z.string(),
    }).optional(),
  }).optional().nullable(),
})

export type Year = z.infer<typeof YearSchema>

export type QueryResult = {
  posts: Post[]
  years: Year[]
  events: Event[]
}
