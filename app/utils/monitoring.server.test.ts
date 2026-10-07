import http from 'node:http'
import { type AddressInfo } from 'node:net'
import * as Sentry from '@sentry/react-router'
import { afterEach, expect, test } from 'vitest'
import { consoleError } from '#tests/setup/setup-test-env.ts'
import { sentryServerOptions } from './monitoring.server.ts'

let server: http.Server | undefined

afterEach(async () => {
  await Sentry.close()
  await new Promise<void>(resolve =>
    server ? server.close(() => resolve()) : resolve(),
  )
  server = undefined
})

// Stands in for Sentry's ingest, so the test sends nothing over the network.
function silentTransport() {
  return {
    send: () => Promise.resolve({}),
    flush: () => Promise.resolve(true),
  }
}

test('keeps form submissions and logged mail errors out of the events sent to Sentry', async () => {
  // Logged errors may quote personal data, so console breadcrumbs stay out of
  // Sentry. The log stays quiet here; Sentry wraps the console from init on.
  consoleError.mockImplementation(() => {})
  const events: Sentry.ErrorEvent[] = []
  Sentry.init({
    ...sentryServerOptions('https://public@sentry.invalid/1'),
    transport: silentTransport,
    beforeSend(event) {
      events.push(event)
      return null
    },
  })

  // The real server SDK reads incoming requests from node:http, so the test
  // posts a registration to a real server that reports an error.
  server = http.createServer((request, response) => {
    // Read like the React Router adapter does, through "data" listeners
    request.on('data', () => {})
    request.on('end', () => {
      console.error(
        'Error sending notification email:',
        new Error('Invalid `to` field: anna@beispiel.at'),
      )
      Sentry.captureException(new Error('Aufnahme notification email failed'))
      response.end()
    })
  })
  await new Promise<void>(resolve => server!.listen(0, resolve))
  const { port } = server.address() as AddressInfo

  await fetch(`http://localhost:${port}/aufnahme/formular`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: 'parent1Name=Anna+Testfrau&studentBirthYear=2012',
  })
  await Sentry.flush()

  expect(events).toHaveLength(1)
  // The request itself is attached, so its body would be too if it were kept
  expect(events[0]?.request?.url).toContain('/aufnahme/formular')
  expect(events[0]?.request?.data).toBeUndefined()
  expect(consoleError).toHaveBeenCalledOnce()
  expect(JSON.stringify(events[0]?.breadcrumbs ?? [])).not.toContain('anna@')
})
