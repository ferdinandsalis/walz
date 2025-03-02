// learn more: https://fly.io/docs/reference/configuration/#services-http_checks
import { type LoaderFunctionArgs } from 'react-router'

export async function loader({ request }: LoaderFunctionArgs) {
  const host =
    request.headers.get('X-Forwarded-Host') ?? request.headers.get('host')

  try {
    // if we can make a simple query
    // and make a HEAD request to ourselves, then we're good.
    await Promise.all([
      fetch(`${new URL(request.url).protocol}${host}`, {
        method: 'HEAD',
        headers: { 'X-Healthcheck': 'true' },
      }).then(r => {
        if (!r.ok) return Promise.reject(r)
      }),
    ])
    return new Response('OK')
  } catch (error: unknown) {
    console.log('healthcheck ❌', { error })
    return new Response('ERROR', { status: 500 })
  }
}
