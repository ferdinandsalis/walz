import { defineQuery } from 'groq'

export const homeQuery = defineQuery(`{
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
    achievement,
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
}`)
