import { startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'

if (ENV.MODE === 'production' && ENV.SENTRY_DSN) {
  import('./utils/monitoring.client.tsx')
    .then(({ init }) => init())
    .catch(error => {
      console.error(error)
    })
}

startTransition(() => {
  hydrateRoot(document, <HydratedRouter />)
})
