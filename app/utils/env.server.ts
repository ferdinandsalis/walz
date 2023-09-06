import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test'] as const),
  SENTRY_DSN: z.string(),
  GOOGLE_MAPS_API_KEY: z.string(),
  // DATABASE_PATH: z.string(),
  // DATABASE_URL: z.string(),
  // SESSION_SECRET: z.string(),
  // INTERNAL_COMMAND_TOKEN: z.string(),
  // CACHE_DATABASE_PATH: z.string(),
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
  }
}

type ENV = ReturnType<typeof getEnv>

declare global {
  var ENV: ENV
  interface Window {
    ENV: ENV
  }
}
