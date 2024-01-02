import groq from 'groq'

export const QUERY = groq`*[_type == "home-hero"][0]{
  _id,
  _type,
  title,
  image
}`
