import { afterEach, expect, test, vi } from 'vitest'
import { addSubscriber } from './buttondown.ts'

afterEach(() => {
  vi.unstubAllGlobals()
})

// Stands in for the Buttondown API at the HTTP boundary.
function buttondownResponds(status: number, body: object) {
  const fetch = vi.fn<typeof globalThis.fetch>(async () =>
    Response.json(body, { status }),
  )
  vi.stubGlobal('fetch', fetch)
  return fetch
}

test('subscribes the address under the field name Buttondown expects', async () => {
  const fetch = buttondownResponds(201, {})

  await addSubscriber('leser@example.com', 'walz.at')

  const [url, init] = fetch.mock.calls[0]!
  expect(String(url)).toBe('https://api.buttondown.com/v1/subscribers')
  expect(JSON.parse(String(init?.body))).toEqual({
    email_address: 'leser@example.com',
    utm_source: 'walz.at',
  })
})
