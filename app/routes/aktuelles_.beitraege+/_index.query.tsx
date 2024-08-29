import { defineQuery } from 'groq'

type Post = {
  title: string
  cover: any
  slug: { current: string }
  previewText: string
  publishedAt: string
}

export const beitraegeIndexQuery = defineQuery(`{
  "posts": *[_type == "post"] | order(publishedAt desc) {
    _id,
    _type,
    title,
    cover,
    previewText,
    slug,
    publishedAt
  },
}`)

export type QueryResult = {
  posts: Post[]
}
