import { PassThrough } from 'stream'

import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type HandleDocumentRequestFunction,
} from 'react-router'

import { createReadableStreamFromReadable } from '@react-router/node'
import { ServerRouter } from 'react-router'
import * as Sentry from '@sentry/remix'
import chalk from 'chalk'
import { isbot } from 'isbot'
import { renderToPipeableStream } from 'react-dom/server'
import { getEnv, init } from './utils/env.server.ts'
import { makeTimings } from './utils/timing.server.ts'

const ABORT_DELAY = 5000

init()
global.ENV = getEnv()

if (ENV.MODE === 'production' && ENV.SENTRY_DSN) {
  import('./utils/monitoring.server.ts')
    .then(({ init }) => init())
    .catch(error => {
      console.error(error)
    })
}

type DocRequestArgs = Parameters<HandleDocumentRequestFunction>

export default async function handleRequest(...args: DocRequestArgs) {
  const [request, responseStatusCode, responseHeaders, reactRouterContext] =
    args
  const callbackName = isbot(request.headers.get('user-agent'))
    ? 'onAllReady'
    : 'onShellReady'

  return new Promise((resolve, reject) => {
    let didError = false
    const timings = makeTimings('render', 'renderToPipeableStream')

    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter
        abortDelay={ABORT_DELAY}
        context={reactRouterContext}
        url={request.url}
      />,
      {
        [callbackName]: () => {
          const body = new PassThrough()
          responseHeaders.set('Content-Type', 'text/html')
          responseHeaders.append('Server-Timing', timings.toString())
          resolve(
            new Response(createReadableStreamFromReadable(body), {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
          )
          pipe(body)
        },
        onShellError: (err: unknown) => {
          reject(err)
        },
        onError: () => {
          didError = true
        },
      },
    )

    setTimeout(abort, 10000)
  })
}

export function handleError(
  error: unknown,
  { request }: LoaderFunctionArgs | ActionFunctionArgs,
): void {
  // Skip capturing if the request is aborted as Remix docs suggest
  // Ref: https://remix.run/docs/en/main/file-conventions/entry.server#handleerror
  if (request.signal.aborted) {
    return
  }
  if (error instanceof Error) {
    console.error(chalk.red(error.stack))
    void Sentry.captureRemixServerException(error, 'remix.server', request)
  } else {
    console.error(chalk.red(error))
    Sentry.captureException(error)
  }
}
