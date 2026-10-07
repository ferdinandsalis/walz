import * as Sentry from '@sentry/react-router'

export function sentryServerOptions(dsn: string) {
  return {
    dsn,
    tracesSampleRate: 1,
    integrations: [
      // Request bodies are forms full of personal data, such as a child's
      // registration, so they never go to Sentry.
      Sentry.httpIntegration({ maxIncomingRequestBodySize: 'none' }),
      // TODO: Make this work with Prisma
      // new Sentry.Integrations.Prisma({ client: prisma }),
    ],
  } satisfies Parameters<typeof Sentry.init>[0]
}

export function init() {
  Sentry.init(sentryServerOptions(ENV.SENTRY_DSN))
}
