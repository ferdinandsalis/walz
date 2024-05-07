import groq from 'groq'
import { z } from 'zod'

// @ts-ignore
export const query = groq`{
  "persons": *[_type == "person"] | order(priority asc) | order(familyName asc) {
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

export const PersonSchema = z.object({
  priority: z.number().optional(),
  givenNames: z.string(),
  familyName: z.string(),
  name: z.string(),
  description: z.string(),
  roles: z
    .array(
      z.union([
        z.literal('leadership'),
        z.literal('mentor'),
        z.literal('project_lead'),
        z.literal('administrator'),
        z.literal('therapist'),
      ]),
    )
    .optional(),
  portrait: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  publishedAt: z.string(),
})

export type Person = z.infer<typeof PersonSchema>

export type QueryResult = {
  persons: Person[]
}
