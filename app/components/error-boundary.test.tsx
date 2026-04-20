import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
  captureException,
  mockIsRouteErrorResponse,
  mockUseParams,
  mockUseRouteError,
} = vi.hoisted(() => ({
  captureException: vi.fn(),
  mockIsRouteErrorResponse: vi.fn(),
  mockUseParams: vi.fn(),
  mockUseRouteError: vi.fn(),
}))

vi.mock('@sentry/react-router', () => ({
  captureException,
}))

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>(
    'react-router',
  )

  return {
    ...actual,
    isRouteErrorResponse: mockIsRouteErrorResponse,
    useParams: mockUseParams,
    useRouteError: mockUseRouteError,
  }
})

import { GeneralErrorBoundary } from './error-boundary.tsx'

describe('GeneralErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseParams.mockReturnValue({})
  })

  it('does not capture route error responses', () => {
    mockUseRouteError.mockReturnValue({
      data: 'Not found',
      status: 404,
      statusText: 'Not Found',
    })
    mockIsRouteErrorResponse.mockReturnValue(true)

    const markup = renderToStaticMarkup(
      <GeneralErrorBoundary
        defaultStatusHandler={({ error }) => (
          <p>
            {error.status} {error.data}
          </p>
        )}
      />,
    )

    expect(markup).toContain('404 Not found')
    expect(captureException).not.toHaveBeenCalled()
  })

  it('captures unexpected errors', () => {
    const error = new Error('boom')
    mockUseRouteError.mockReturnValue(error)
    mockIsRouteErrorResponse.mockReturnValue(false)

    const markup = renderToStaticMarkup(<GeneralErrorBoundary />)

    expect(markup).toContain('boom')
    expect(captureException).toHaveBeenCalledWith(error)
  })
})
