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
    // Console output stays in the server logs: it can quote personal data,
    // such as a mail provider's error naming an address from a form.
    beforeBreadcrumb: breadcrumb =>
      breadcrumb.category === 'console' ? null : breadcrumb,
  } satisfies Parameters<typeof Sentry.init>[0]
}

export function init() {
  Sentry.init(sentryServerOptions(ENV.SENTRY_DSN))
}
