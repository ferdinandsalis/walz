import groq from 'groq'

// fetch singleton curriculum
export const curriculumQuery = groq`*[_type == "curriculum"][0]{
  name,
  description,
  years[] {
    _key,
    _type,
    _ref,
    yearNumber,
    description,
    title,
    externalExams,
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
    // Years are objects inside the curriculum, so Sanity gives them a _key
    _key: string
    _type: string
    _ref: string
    yearNumber: number
    description: string
    title: string
    externalExams: string[] | null
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
