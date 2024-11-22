import { defineQuery } from 'groq'

export const beitraegeSlugQuery = defineQuery(`
*[_type == "post" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    cover,
    body,
    slug,
    publishedAt
  }
`)

export type QueryResult = {
  title: string
  cover: any
  body: any
  slug: { current: string }
  previewText: string
  publishedAt: string
}
