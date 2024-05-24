import groq from 'groq'

// @ts-ignore
export const query = groq`{
  "hero": *[_type == "home-hero"][0]{
    _id,
    _type,
    image,
    "caption": image->caption,
    "attribution": image->attribution
  },  
  "posts": *[_type == "post"] | order(publishedAt desc) {
    _id,
    _type,
    title,
    previewText,
    slug,
    publishedAt
  }
}`

export type QueryResult = {
  hero: {
    _id: string
    _type: string
    image: any
    caption?: string
    attribution?: string
  }
  posts: {
    title: string
    slug: { current: string }
    previewText: string
    publishedAt: string
  }[]
}
