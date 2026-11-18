import { beforeEach, expect, test, vi } from 'vitest'
import { addSubscriber } from '#app/utils/buttondown.ts'
import { action, loader } from './newsletter.ts'

const { captureException, captureMessage } = vi.hoisted(() => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
}))

vi.mock('@sentry/react-router', () => ({
  captureException,
  captureMessage,
}))

vi.mock('#app/utils/buttondown.ts', () => ({
  addSubscriber: vi.fn(),
}))

vi.mock('#app/utils/honeypot.server.ts', () => ({
  checkHoneypot: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

const READER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36'
const HEADLESS_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/143.0.0.0 Safari/537.36'

function subscribe(
  email: string,
  headers: Record<string, string> = { 'User-Agent': READER_UA },
) {
  const formData = new FormData()
  formData.append('email', email)
  const request = new Request('http://localhost/resources/newsletter', {
    method: 'POST',
    body: formData,
    headers,
  })
  return action({ request, params: {}, context: {} } as never)
}

test("subscribes from the reader's IP that Fly's proxy reports", async () => {
  vi.mocked(addSubscriber).mockResolvedValue({ success: true })

  await subscribe('leser@example.com', { 'Fly-Client-Ip': '203.0.113.7' })

  expect(addSubscriber).toHaveBeenCalledWith(
    'leser@example.com',
    'walz.at',
    '203.0.113.7',
  )
})

test('subscribes without an IP when no proxy reports one', async () => {
  vi.mocked(addSubscriber).mockResolvedValue({ success: true })

  await subscribe('leser@example.com')

  expect(addSubscriber).toHaveBeenCalledWith(
    'leser@example.com',
    'walz.at',
    undefined,
  )
})

test('confirms a subscription that Buttondown accepts', async () => {
  vi.mocked(addSubscriber).mockResolvedValue({ success: true })

  const result = await subscribe('leser@example.com')

  expect(result).toMatchObject({ data: { ok: true } })
  expect(captureException).not.toHaveBeenCalled()
})

test('reports a subscription that Buttondown rejects without the address', async () => {
  vi.mocked(addSubscriber).mockResolvedValue({
    success: false,
    reason: '401 authentication_invalid',
  })

  const result = await subscribe('leser@example.com')

  expect(result).toMatchObject({
    data: { ok: false, reason: 'unavailable' },
    init: { status: 502 },
  })
  expect(captureException).toHaveBeenCalledOnce()
  const [error] = captureException.mock.calls[0]!
  expect(String(error)).toContain('401 authentication_invalid')
  expect(String(error)).not.toContain('leser@example.com')
})

test('rejects an address the browser let through without subscribing it', async () => {
  const result = await subscribe('leser@example')

  expect(result).toMatchObject({
    data: { ok: false, reason: 'invalid' },
    init: { status: 400 },
  })
  expect(addSubscriber).not.toHaveBeenCalled()
  expect(captureException).not.toHaveBeenCalled()
})

test('pretends to subscribe a headless browser without passing it to Buttondown', async () => {
  const result = await subscribe('opfer@example.com', {
    'User-Agent': HEADLESS_UA,
    'Sec-CH-UA': '"HeadlessChrome";v="143"',
    'Sec-Fetch-Site': 'same-origin',
    'Accept-Language': 'en-US',
  })

  expect(result).toMatchObject({ data: { ok: true } })
  expect(addSubscriber).not.toHaveBeenCalled()
  expect(captureException).not.toHaveBeenCalled()
  expect(captureMessage).toHaveBeenCalledOnce()
  const [message, context] = captureMessage.mock.calls[0]!
  expect(message).toBe('Newsletter sign-up from a headless browser dropped')
  expect(context).toEqual({
    level: 'info',
    tags: {
      sec_ch_ua: '"HeadlessChrome";v="143"',
      sec_fetch_site: 'same-origin',
      accept_language: 'present',
    },
  })
  expect(JSON.stringify(captureMessage.mock.calls)).not.toContain(
    'opfer@example.com',
  )
})

test('rejects a malformed address from a headless browser like any other', async () => {
  const result = await subscribe('opfer@example', { 'User-Agent': HEADLESS_UA })

  expect(result).toMatchObject({
    data: { ok: false, reason: 'invalid' },
    init: { status: 400 },
  })
  expect(captureMessage).not.toHaveBeenCalled()
})

test('subscribes a reader whose browser sends no user agent', async () => {
  vi.mocked(addSubscriber).mockResolvedValue({ success: true })

  const result = await subscribe('leser@example.com', {})

  expect(result).toMatchObject({ data: { ok: true } })
  expect(addSubscriber).toHaveBeenCalledOnce()
})

test('sends a direct visit to the form endpoint to the home page', async () => {
  const response = await loader()

  expect(response.status).toBe(302)
  expect(response.headers.get('Location')).toBe('/')
})
