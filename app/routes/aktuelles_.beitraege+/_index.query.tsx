import groq from 'groq'

type Post = {
  title: string
  cover: any
  slug: { current: string }
  previewText: string
  publishedAt: string
}

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
}` as string

export type QueryResult = {
  posts: Post[]
}
