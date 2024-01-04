import groq from 'groq'

// @ts-ignore
export const query = groq`
*[_type == "post" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    cover,
    body,
    slug,
    publishedAt
  }
` as string

export type QueryResult = {
  title: string
  cover: any
  body: any
  slug: { current: string }
  previewText: string
  publishedAt: string
}
