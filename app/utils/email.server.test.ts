import { afterEach, expect, test, vi } from 'vitest'
import { type AufnahmeSubmission } from './aufnahme-form.ts'
import {
  sendAufnahmeConfirmationEmail,
  sendAufnahmeNotificationEmail,
} from './email.server.ts'

afterEach(() => {
  // `restoreMocks` restores spies but does not unstub globals or env vars.
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

const address = {
  street: 'Lindengasse 12/2/14',
  postalCode: '1070',
  city: 'Wien',
  country: 'Österreich',
}

const aufnahme: AufnahmeSubmission = {
  parent1: {
    name: 'Anna Testfrau',
    phone: '+43 660 1234567',
    email: 'delivered+parent1@resend.dev',
    address,
    sameAddressAsParent1: false,
  },
  student: {
    name: 'Max Testfrau',
    email: 'delivered+student@resend.dev',
    birthdate: '2012-03-14',
    address,
    sameAddressAsParent1: false,
    currentGrade: '8a',
    schoolHistory: 'Volksschule Test, 2018-2022\nNMS Test, 2022-2026',
  },
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

function textOf(fetch: ReturnType<typeof resendResponds>) {
  const [, init] = fetch.mock.calls[0]!
  return (JSON.parse(String(init?.body)) as { text: string }).text
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

async function notificationTextFor(submission: AufnahmeSubmission) {
  const fetch = resendResponds(200, { id: 'test-email-id' })
  await sendAufnahmeNotificationEmail(submission)
  return textOf(fetch)
}

test('writes each address on one line', async () => {
  const text = await notificationTextFor(aufnahme)

  expect(text).toContain('Adresse: Lindengasse 12/2/14, 1070 Wien, Österreich')
})

test('marks a copied address', async () => {
  const text = await notificationTextFor({
    ...aufnahme,
    student: { ...aufnahme.student, sameAddressAsParent1: true },
  })

  expect(text.split('(wie erziehungsberechtigte Person 1)')).toHaveLength(2)
  expect(text).toContain(
    'Adresse: Lindengasse 12/2/14, 1070 Wien, Österreich (wie erziehungsberechtigte Person 1)',
  )
})

test('lists the school history under its own heading', async () => {
  const text = await notificationTextFor(aufnahme)

  expect(text).toContain(
    'SCHULEN NACH DER VOLKSSCHULE\nVolksschule Test, 2018-2022\nNMS Test, 2022-2026\n\nERZIEHUNGSBERECHTIGTE PERSON 1',
  )
})

test('formats the birthdate as dd.mm.yyyy', async () => {
  const text = await notificationTextFor(aufnahme)

  expect(text).toContain('Geburtsdatum: 14.03.2012')
})

test("prints only the second guardian's given lines", async () => {
  const text = await notificationTextFor({
    ...aufnahme,
    parent2: {
      name: 'Bernd Testmann',
      phone: '+43 660 7654321',
      sameAddressAsParent1: false,
    },
  })

  const parent2 = text.split('ERZIEHUNGSBERECHTIGTE PERSON 2\n')[1]!
  const block = parent2.split('\n\n')[0]
  expect(block).toBe('Name: Bernd Testmann\nTelefon: +43 660 7654321')
})

test('says "Nicht angegeben" without a second guardian', async () => {
  const text = await notificationTextFor(aufnahme)

  expect(text).toContain('ERZIEHUNGSBERECHTIGTE PERSON 2\nNicht angegeben\n')
})

test('names the source option and the free text', async () => {
  const withOther = await notificationTextFor({
    ...aufnahme,
    source: { label: 'Anderes', other: 'Plakat' },
  })
  expect(withOther).toContain(
    'WIE AUF UNS AUFMERKSAM GEWORDEN\nAnderes: Plakat',
  )

  const withOption = await notificationTextFor({
    ...aufnahme,
    source: { label: 'Social Media' },
  })
  expect(withOption).toContain('WIE AUF UNS AUFMERKSAM GEWORDEN\nSocial Media')

  const without = await notificationTextFor(aufnahme)
  expect(without).toContain('WIE AUF UNS AUFMERKSAM GEWORDEN\nNicht angegeben')
})

test('sends the confirmation to the child, parent 1 and parent 2', async () => {
  const fetch = resendResponds(200, { id: 'test-email-id' })

  await sendAufnahmeConfirmationEmail({
    ...aufnahme,
    parent2: {
      name: 'Bernd Testmann',
      email: 'delivered+parent2@resend.dev',
      sameAddressAsParent1: false,
    },
  })

  expect(recipientsOf(fetch)).toEqual([
    'delivered+student@resend.dev',
    'delivered+parent1@resend.dev',
    'delivered+parent2@resend.dev',
  ])
})

test('leaves out a second guardian without an email', async () => {
  const fetch = resendResponds(200, { id: 'test-email-id' })

  await sendAufnahmeConfirmationEmail({
    ...aufnahme,
    parent2: { name: 'Bernd Testmann', sameAddressAsParent1: false },
  })

  expect(recipientsOf(fetch)).toEqual([
    'delivered+student@resend.dev',
    'delivered+parent1@resend.dev',
  ])
})

test('sends the confirmation once to an address given twice', async () => {
  const fetch = resendResponds(200, { id: 'test-email-id' })

  // The child-email hint asks parents to give their own address if the child
  // has none, so the same address can come in twice, in any case.
  await sendAufnahmeConfirmationEmail({
    ...aufnahme,
    student: { ...aufnahme.student, email: 'Delivered+Parent1@resend.dev' },
    parent2: {
      name: 'Bernd Testmann',
      email: 'delivered+parent1@resend.dev',
      sameAddressAsParent1: false,
    },
  })

  expect(recipientsOf(fetch)).toEqual(['Delivered+Parent1@resend.dev'])
})
