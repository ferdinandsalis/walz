import groq from 'groq'

// fetch singleton curriculum
export const curriculumQuery = groq`*[_type == "curriculum"][0]{
  name,
  description,
  years[] {
    _id,
    _type,
    _ref,
    yearNumber,
    description,
    projects[]-> {
      _id,
      _type,
      _ref,
      name,
      description,
      photos
    }
  }
}`

export type CurriculumQueryResult = {
  name: string
  description: string
  years: {
    _id: string
    _type: string
    _ref: string
    yearNumber: number
    description: string
    projects: {
      _id: string
      _type: string
      _ref: string
      name: string
      description: string
      photos: any[]
    }[]
  }[]
}
