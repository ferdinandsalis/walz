import { Link, useLocation } from 'react-router'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'

export async function loader() {
  throw new Response('Not found', { status: 404 })
}

export default function NotFound() {
  // due to the loader, this component will never be rendered, but we'll return
  // the error boundary just in case.
  return <ErrorBoundary />
}

export function ErrorBoundary() {
  const location = useLocation()
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        404: () => (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h1>Leider konnten wir diese Seite nicht finden:</h1>
              <pre className="whitespace-pre-wrap break-all bg-card p-2">
                {location.pathname}
              </pre>
            </div>
            <Link to="/" className="underline">
              Zurück zur Startseite
            </Link>
          </div>
        ),
      }}
    />
  )
}
