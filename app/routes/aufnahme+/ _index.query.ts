import { defineQuery } from 'groq'
import { z } from 'zod'

export const AufnahmeQuerySchema = z.object({
  currentSchoolYear: z
    .object({
      _id: z.string(),
      _type: z.string(),
      start: z.coerce.date(),
      end: z.coerce.date(),
      costs: z.object({
        definedAt: z.string(),
        list: z.array(
          z.object({
            title: z.string(),
            quantity: z.number(),
            cost: z.number(),
            interval: z.string(),
            description: z.string().optional(),
          }),
        ),
      }),
    })
    .optional()
    .nullable(),
})

export type AufnahmeQuery = z.infer<typeof AufnahmeQuerySchema>

// current school year
export const aufnahmeQuery = defineQuery(`{
    "currentSchoolYear": *[_type == "schoolYear" && end > now()] | order(start asc) {
        _id,
        _type,
        start,
        end,
        costs->{
            definedAt,
            list
        }
    }[0]
}`)
