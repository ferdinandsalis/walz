import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test'] as const),
  AIRTABLE_API_KEY: z.string(),
  BUTTONDOWN_API_KEY: z.string(),
  GOOGLE_MAPS_API_KEY: z.string(),
  SENTRY_DSN: z.string(),
  HONEYPOT_SECRET: z.string(),
  SANITY_PUBLIC_PROJECT_ID: z.string(),
  SANITY_PUBLIC_DATASET: z.string(),
  SANITY_PUBLIC_API_VERSION: z.string(),
})

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof schema> {}
  }
}

export function init() {
  const parsed = schema.safeParse(process.env)

  if (parsed.success === false) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors,
    )

    throw new Error('Invalid envirmonment variables')
  }
}

/**
 * This is used in both `entry.server.ts` and `root.tsx` to ensure that
 * the environment variables are set and globally available before the app is
 * started.
 *
 * NOTE: Do *not* add any environment variables in here that you do not wish to
 * be included in the client.
 * @returns all *PUBLIC* ENV variables
 */
export function getEnv() {
  return {
    MODE: process.env.NODE_ENV,
    SENTRY_DSN: process.env.SENTRY_DSN,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    SANITY_PUBLIC_PROJECT_ID: process.env.SANITY_PUBLIC_PROJECT_ID,
    SANITY_PUBLIC_DATASET: process.env.SANITY_PUBLIC_DATASET,
    SANITY_PUBLIC_API_VERSION: process.env.SANITY_PUBLIC_API_VERSION,
  }
}

type ENV = ReturnType<typeof getEnv>

declare global {
  var ENV: ENV
  interface Window {
    ENV: ENV
  }
}
