import { defineQuery } from 'groq'

export const homeQuery = defineQuery(`{
  "hero": *[_type == "home-hero"][0]{
    _id,
    _type,
    image,
    "caption": image->caption,
    "attribution": image->attribution
  },  
  "closestEvent": *[_type == "event" && type != "holiday" && dateTime(start.date  + 'T00:00:00Z') >= dateTime(now()) - 60*60*24] | order(start.date asc)[0] {
    _id,
    _type,
    title,
    location,
    description,
    start,
    end,
    type
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
  },
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
