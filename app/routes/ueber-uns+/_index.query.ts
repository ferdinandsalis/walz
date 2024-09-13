import { defineQuery } from 'groq'
import { z } from 'zod'

const personFields = `
  _id,
  _type,
  priority,
  inactive,
  slug,
  portrait,
  givenNames,
  familyName,
  "name": givenNames + " " + familyName,
  description,
  email,
  phone,
  website,
  publishedAt
`

export const ueberUnsQuery = defineQuery(`{
  "leadership": *[_type == "person" && "leadership" in roles && (!inactive || inactive == null)] | order(priority desc, familyName asc) {
    ${personFields}
  },
  "mentor": *[_type == "person" && "mentor" in roles && (!inactive || inactive == null)] | order(priority desc, familyName asc) {
    ${personFields}
  },
  "project_lead": *[_type == "person" && "project_lead" in roles && (!inactive || inactive == null)] | order(priority desc, familyName asc) {
    ${personFields}
  },
  "administrator": *[_type == "person" && "administrator" in roles && (!inactive || inactive == null)] | order(priority desc, familyName asc) {
    ${personFields}
  },
  "therapist": *[_type == "person" && "therapist" in roles && (!inactive || inactive == null)] | order(priority desc, familyName asc) {
    ${personFields}
  }
}`)

export const PersonSchema = z.object({
  slug: z.object({ current: z.string() }),
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
