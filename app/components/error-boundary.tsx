import {
  isRouteErrorResponse,
  useParams,
  useRouteError,
} from '@remix-run/react'
import { type ErrorResponse } from '@remix-run/router'
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

  if (typeof document !== 'undefined') {
    console.error(error)
  }

  return (
    <div className="container bg-card p-6 text-xl">
      <p className="mb-2 font-bold">
        Entschuldige, leider ist ein Fehler passiert.
      </p>
      <details className="bg-secondary/5 p-2">
        <summary>Detail</summary>
        <pre>
          {isRouteErrorResponse(error)
            ? (statusHandlers?.[error.status] ?? defaultStatusHandler)({
                error,
                params,
              })
            : unexpectedErrorHandler(error)}
        </pre>
      </details>
    </div>
  )
}
