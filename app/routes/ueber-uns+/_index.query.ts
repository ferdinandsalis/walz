import groq from 'groq'

// @ts-ignore
export const query = groq`{
  "persons": *[_type == "person"] | order(familyName asc) {
    _id,
    _type,
    portrait,
    givenNames,
    familyName,
    "name": givenNames + " " + familyName,
    description,
    roles,
    email,
    phone,
    website,
    publishedAt
  }
}` as string

export type Person = {
  givenNames: string
  familyName: string
  name: string
  description: string
  roles?: (
    | 'leadership'
    | 'mentor'
    | 'project_lead'
    | 'administrator'
    | 'therapist'
  )[]
  portrait?: string | null
  phone?: string | null
  email?: string | null
  website?: string | null
  publishedAt: string
}

export type QueryResult = {
  persons: Person[]
}
