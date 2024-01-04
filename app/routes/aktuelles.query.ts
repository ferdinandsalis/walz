import groq from 'groq'

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
  }
}` as string

export type QueryResult = {
  posts: {
    title: string
    cover: any
    slug: { current: string }
    previewText: string
    publishedAt: string
  }[]
}
