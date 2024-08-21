import groq from 'groq'

export const query = groq`{
  "hero": *[_type == "home-hero"][0]{
    _id,
    _type,
    image,
    "caption": image->caption,
    "attribution": image->attribution
  },  
  "testimonials": *[_type == "testimonial"] | order(_createdAt desc) {
    _id,
    _type,
    name,
    quote,
    photo,
    year -> {
      graduatedAt,
      startedAt,
      letter
    }
  }[0...4],
  "posts": *[_type == "post"] | order(publishedAt desc) {
    _id,
    _type,
    title,
    previewText,
    slug,
    cover,
    publishedAt
  }[0...3]
}`

export type QueryResult = {
  hero: {
    _id: string
    _type: string
    image: any
    caption?: string
    attribution?: string
  }
  testimonials: {
    _id: string
    _type: string
    name: string
    quote: string
    photo: { attribution?: string; alt?: string; asset: {} }
    year: { graduatedAt: string; startedAt: string; letter: string }
  }[]
  posts: {
    title: string
    slug: { current: string }
    previewText: string
    publishedAt: string
    cover: { _type: string; asset: {}; attribution?: string; caption?: string }
  }[]
}
