import { afterEach, expect, test, vi } from 'vitest'
import {
  sendAufnahmeConfirmationEmail,
  sendAufnahmeNotificationEmail,
} from './email.server.ts'

afterEach(() => {
  // `restoreMocks` restores spies but does not unstub globals or env vars.
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

const aufnahme = {
  studentName: 'Max Testfrau',
  studentEmail: 'delivered+student@resend.dev',
  studentAddress: 'Teststraße 1, 1010 Wien',
  studentBirthdate: '2010-05-15',
  currentSchool: 'Test Gymnasium',
  currentGrade: '8a',
  parent1Name: 'Anna Testfrau',
  parent1Phone: '+43 660 1234567',
  parent1Email: 'delivered+parent1@resend.dev',
  parent1Address: 'Teststraße 1, 1010 Wien',
  source: 'Durch Google Suche',
}

// Stands in for the Resend API at the HTTP boundary, so the real SDK still
// decides how a response turns into a result.
function resendResponds(status: number, body: object) {
  const fetch = vi.fn<typeof globalThis.fetch>(async () =>
    Response.json(body, { status }),
  )
  vi.stubGlobal('fetch', fetch)
  return fetch
}

function recipientsOf(fetch: ReturnType<typeof resendResponds>) {
  const [, init] = fetch.mock.calls[0]!
  const email = JSON.parse(String(init?.body)) as { to: string | string[] }
  return email.to
}

const invalidApiKey = {
  statusCode: 401,
  name: 'validation_error',
  message: 'API key is invalid',
}

test('reports a notification that Resend rejects as failed', async () => {
  resendResponds(401, invalidApiKey)
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

  const result = await sendAufnahmeNotificationEmail(aufnahme)

  expect(result).toEqual({ success: false, error: 'API key is invalid' })
  expect(consoleError).toHaveBeenCalledWith(
    'Error sending notification email:',
    expect.objectContaining({ message: 'API key is invalid' }),
  )
})

test('reports a confirmation that Resend rejects as failed', async () => {
  resendResponds(401, invalidApiKey)
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

  const result = await sendAufnahmeConfirmationEmail(aufnahme)

  expect(result).toEqual({ success: false, error: 'API key is invalid' })
  expect(consoleError).toHaveBeenCalledWith(
    'Error sending confirmation email:',
    expect.objectContaining({ message: 'API key is invalid' }),
  )
})

test('sends the school notification to the Resend test inbox outside production', async () => {
  const fetch = resendResponds(200, { id: 'test-email-id' })

  const result = await sendAufnahmeNotificationEmail(aufnahme)

  expect(result).toEqual({ success: true })
  expect(recipientsOf(fetch)).toBe('delivered@resend.dev')
})

test('sends the school notification to the office in production', async () => {
  vi.stubEnv('NODE_ENV', 'production')
  const fetch = resendResponds(200, { id: 'test-email-id' })

  const result = await sendAufnahmeNotificationEmail(aufnahme)

  expect(result).toEqual({ success: true })
  expect(recipientsOf(fetch)).toBe('office@walz.at')
})
