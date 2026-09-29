import { captureException } from '@sentry/react-router'
import { type JSX } from 'react'
import {
  type ErrorResponse,
  isRouteErrorResponse,
  Link,
  useLocation,
  useParams,
  useRouteError,
} from 'react-router'
import { getErrorMessage } from '#app/utils/misc.tsx'

type StatusHandler = (info: {
  error: ErrorResponse
  params: Record<string, string | undefined>
}) => JSX.Element | null

export function GeneralErrorBoundary({
  defaultStatusHandler = ({ error }) => (
    <p>
      {error.status} {error.data}
    </p>
  ),
  statusHandlers,
  unexpectedErrorHandler = error => <p>{getErrorMessage(error)}</p>,
}: {
  defaultStatusHandler?: StatusHandler
  statusHandlers?: Record<number, StatusHandler>
  unexpectedErrorHandler?: (error: unknown) => JSX.Element | null
}) {
  const error = useRouteError()
  const params = useParams()

  if (!isRouteErrorResponse(error)) {
    captureException(error)
  }

  if (typeof document !== 'undefined') {
    console.error(error)
  }

  return (
    <>
      {isRouteErrorResponse(error)
        ? (statusHandlers?.[error.status] ?? defaultStatusHandler)({
            error,
            params,
          })
        : unexpectedErrorHandler(error)}
    </>
  )
}

/**
 * Error boundary for routes whose loader throws a 404 when the requested
 * content does not exist. Exported as a route's `ErrorBoundary`, it renders
 * inside the site layout instead of falling through to the bare root boundary.
 */
export function NotFoundErrorBoundary() {
  const location = useLocation()
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        404: () => (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h1>Leider konnten wir diese Seite nicht finden:</h1>
              <pre className="bg-card p-2 break-all whitespace-pre-wrap">
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
