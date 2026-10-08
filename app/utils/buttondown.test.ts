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

test('adds an address that is already subscribed instead of rejecting it', async () => {
  const fetch = buttondownResponds(201, {})

  await addSubscriber('leser@example.com', 'walz.at')

  const [, init] = fetch.mock.calls[0]!
  expect(
    new Headers(init?.headers).get('X-Buttondown-Collision-Behavior'),
  ).toBe('add')
})

test('reports a subscription that Buttondown accepts as successful', async () => {
  buttondownResponds(201, {})

  expect(await addSubscriber('leser@example.com', 'walz.at')).toEqual({
    success: true,
  })
})

test("reports a rejected subscription with Buttondown's status and code", async () => {
  buttondownResponds(401, {
    code: 'authentication_invalid',
    detail: 'The provided token was invalid.',
  })

  expect(await addSubscriber('leser@example.com', 'walz.at')).toEqual({
    success: false,
    reason: '401 authentication_invalid',
  })
})

test("reads the code from Buttondown's list of validation errors", async () => {
  buttondownResponds(422, {
    detail: [{ code: 'field_renamed', detail: 'Use `email_address`' }],
  })

  expect(await addSubscriber('leser@example.com', 'walz.at')).toEqual({
    success: false,
    reason: '422 field_renamed',
  })
})

test('reports a rejection without a readable code by its status', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response('Bad Gateway', { status: 502 })),
  )

  expect(await addSubscriber('leser@example.com', 'walz.at')).toEqual({
    success: false,
    reason: '502',
  })
})
