import * as Sentry from '@sentry/remix'

export function init() {
  Sentry.init({
    dsn: ENV.SENTRY_DSN,
    tracesSampleRate: 1,
    autoInstrumentRemix: true,
    // TODO: Make this work with Prisma
    // integrations: [new Sentry.Integrations.Prisma({ client: prisma })],
  })
}
