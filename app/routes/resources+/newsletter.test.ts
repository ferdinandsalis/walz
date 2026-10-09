import { beforeEach, expect, test, vi } from 'vitest'
import { addSubscriber } from '#app/utils/buttondown.ts'
import { action } from './newsletter.ts'

const { captureException } = vi.hoisted(() => ({
  captureException: vi.fn(),
}))

vi.mock('@sentry/react-router', () => ({
  captureException,
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

function subscribe(email: string) {
  const formData = new FormData()
  formData.append('email', email)
  const request = new Request('http://localhost/resources/newsletter', {
    method: 'POST',
    body: formData,
  })
  return action({ request, params: {}, context: {} } as never)
}

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

  expect(result).toMatchObject({ data: { ok: false }, init: { status: 502 } })
  expect(captureException).toHaveBeenCalledOnce()
  const [error] = captureException.mock.calls[0]!
  expect(String(error)).toContain('401 authentication_invalid')
  expect(String(error)).not.toContain('leser@example.com')
})
