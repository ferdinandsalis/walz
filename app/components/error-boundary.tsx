import { captureRemixErrorBoundaryError } from '@sentry/remix'
import {
  type ErrorResponse,
  isRouteErrorResponse,
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
  captureRemixErrorBoundaryError(error)
  const params = useParams()

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
