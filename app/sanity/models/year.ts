import { z } from 'zod'
import { PersonSchema } from '#app/routes/ueber-uns+/_index.query.ts'

// Define the Photo schema
export const PhotoSchema = z.object({
  _key: z.string(),
  takenAt: z.coerce.date(),
  motto: z.string().optional().nullable(),
  caption: z.string().optional().nullable(),
  attribution: z.string().optional().nullable(),
  alt: z.string().optional().nullable(),
  asset: z.any(),
})

export type Photo = z.infer<typeof PhotoSchema>

// Define the Year schema
export const YearSchema = z.object({
  letter: z.string(),
  startedAt: z.coerce.date(),
  graduatedAt: z.coerce.date().nullable(),
  mentor: PersonSchema,
  photos: z.array(PhotoSchema),
  plan: z.any(),
  featuredPhoto: z.string().optional().nullable(),
})

export type Year = z.infer<typeof YearSchema>

type GreekLetter = {
  name: string
  symbol: string
}

export const ALPHABET: GreekLetter[] = [
  { name: 'alpha', symbol: 'α' },
  { name: 'beta', symbol: 'β' },
  { name: 'gamma', symbol: 'γ' },
  { name: 'delta', symbol: 'δ' },
  { name: 'epsilon', symbol: 'ε' },
  { name: 'zeta', symbol: 'ζ' },
  { name: 'eta', symbol: 'η' },
  { name: 'theta', symbol: 'θ' },
  { name: 'iota', symbol: 'ι' },
  { name: 'kappa', symbol: 'κ' },
  { name: 'lambda', symbol: 'λ' },
  { name: 'my', symbol: 'μ' },
  { name: 'ny', symbol: 'ν' },
  { name: 'xi', symbol: 'ξ' },
  { name: 'omikron', symbol: 'ο' },
  { name: 'pi', symbol: 'π' },
  { name: 'rho', symbol: 'ρ' },
  { name: 'sigma', symbol: 'σ' },
  { name: 'tau', symbol: 'τ' },
  { name: 'ypsilon', symbol: 'υ' },
  { name: 'phi', symbol: 'φ' },
  { name: 'chi', symbol: 'χ' },
  { name: 'psi', symbol: 'ψ' },
  { name: 'omega', symbol: 'ω' },
]

export const alphabetMap = ALPHABET.reduce(
  (agg: { [key: string]: string }, { name, symbol }) => {
    agg[name] = symbol
    return agg
  },
  {},
)
