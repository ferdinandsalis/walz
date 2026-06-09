import { defineQuery } from 'groq'

export const eventBySlugQuery =
  defineQuery(`*[_type == "event" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  "slug": slug.current,
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
}`)
