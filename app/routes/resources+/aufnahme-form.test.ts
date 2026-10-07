import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  sendAufnahmeConfirmationEmail,
  sendAufnahmeNotificationEmail,
} from '#app/utils/email.server.ts'
import { action, loader } from '../aufnahme+/formular.tsx'

const { captureException } = vi.hoisted(() => ({
  captureException: vi.fn(),
}))

vi.mock('@sentry/react-router', () => ({
  captureException,
}))

// Mock the email functions
vi.mock('#app/utils/email.server.ts', () => ({
  sendAufnahmeConfirmationEmail: vi.fn(),
  sendAufnahmeNotificationEmail: vi.fn(),
}))

// Mock the honeypot
vi.mock('#app/utils/honeypot.server.ts', () => ({
  checkHoneypot: vi.fn(),
}))

describe('aufnahme-form action', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const validFormData: Record<string, string> = {
    parent1Name: 'Anna Mustermann',
    parent1Email: 'anna@example.com',
    parent1Phone: '+43 660 1234567',
    parent1Street: 'Musterstraße 1',
    parent1PostalCode: '1010',
    parent1City: 'Wien',
    parent1Country: 'Österreich',
    studentName: 'Max Mustermann',
    studentEmail: 'max@example.com',
    studentBirthDay: '15',
    studentBirthMonth: '1',
    studentBirthYear: '2010',
    studentSameAddress: 'on',
    currentGrade: '8',
    schoolHistory: 'Volksschule Musterstraße, Gymnasium Wien',
    source: 'internet',
  }

  function buildRequest(fields: Record<string, string>) {
    const formData = new FormData()
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value)
    })
    return new Request('http://localhost/aufnahme/formular', {
      method: 'POST',
      body: formData,
    })
  }

  async function runAction(fields: Record<string, string>) {
    return action({ request: buildRequest(fields) } as any)
  }

  function mockMail({
    notification = true,
    confirmation = true,
  }: { notification?: boolean; confirmation?: boolean } = {}) {
    vi.mocked(sendAufnahmeNotificationEmail).mockResolvedValue(
      notification
        ? { success: true }
        : { success: false, error: 'Office mail down' },
    )
    vi.mocked(sendAufnahmeConfirmationEmail).mockResolvedValue(
      confirmation
        ? { success: true }
        : { success: false, error: 'Confirmation mail down' },
    )
  }

  it('redirects after sending both emails, office first', async () => {
    mockMail()

    const result = await runAction(validFormData)

    expect(result).toBeInstanceOf(Response)
    expect((result as Response).status).toBe(302)
    expect((result as Response).headers.get('Location')).toBe(
      '/aufnahme/formular/danke',
    )
    expect(sendAufnahmeNotificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        parent1: expect.objectContaining({ name: 'Anna Mustermann' }),
        student: expect.objectContaining({
          name: 'Max Mustermann',
          birthdate: '2010-01-15',
          address: expect.objectContaining({ street: 'Musterstraße 1' }),
          sameAddressAsParent1: true,
        }),
      }),
    )
    expect(sendAufnahmeConfirmationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        student: expect.objectContaining({ email: 'max@example.com' }),
      }),
    )
    expect(
      vi.mocked(sendAufnahmeNotificationEmail).mock.invocationCallOrder[0],
    ).toBeLessThan(
      vi.mocked(sendAufnahmeConfirmationEmail).mock.invocationCallOrder[0]!,
    )
    expect(captureException).not.toHaveBeenCalled()
  })

  it('returns 400 with field errors and the submitted values', async () => {
    const { studentName: _studentName, ...withoutStudentName } = validFormData

    const result = (await runAction(withoutStudentName)) as any

    expect(result.init.status).toBe(400)
    expect(result.data.fieldErrors.studentName).toBe(
      'Geben Sie den Vor- und Nachnamen Ihres Kindes ein',
    )
    expect(result.data.values.parent1Name).toBe('Anna Mustermann')
    expect(sendAufnahmeNotificationEmail).not.toHaveBeenCalled()
    expect(sendAufnahmeConfirmationEmail).not.toHaveBeenCalled()
  })

  it('rejects invalid email addresses with a field error', async () => {
    const result = (await runAction({
      ...validFormData,
      studentEmail: 'invalid-email',
    })) as any

    expect(result.init.status).toBe(400)
    expect(result.data.fieldErrors.studentEmail).toBe(
      'Geben Sie die E-Mail-Adresse Ihres Kindes im Format name@beispiel.at ein',
    )
  })

  it('echoes only known form fields, never the honeypot', async () => {
    const result = (await runAction({
      ...validFormData,
      studentName: '',
      nameFieldName: 'trap',
      validFrom: 'trap',
    })) as any

    expect(Object.keys(result.data.values)).toEqual(
      expect.arrayContaining(['parent1Name', 'studentName']),
    )
    expect(result.data.values).not.toHaveProperty('nameFieldName')
    expect(result.data.values).not.toHaveProperty('validFrom')
  })

  it('returns a mail error and keeps the values when the office email fails', async () => {
    mockMail({ notification: false })

    const result = (await runAction(validFormData)) as any

    expect(result.init.status).toBe(502)
    expect(result.data.formError).toBe('mail')
    expect(result.data.values.parent1Name).toBe('Anna Mustermann')
    expect(sendAufnahmeConfirmationEmail).not.toHaveBeenCalled()
    expect(captureException).toHaveBeenCalledTimes(1)
    expect(captureException).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('Office mail down'),
      }),
    )
  })

  it('still redirects when only the confirmation fails', async () => {
    mockMail({ confirmation: false })

    const result = await runAction(validFormData)

    expect(result).toBeInstanceOf(Response)
    expect((result as Response).headers.get('Location')).toBe(
      '/aufnahme/formular/danke',
    )
    expect(captureException).toHaveBeenCalledTimes(1)
    expect(captureException).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('Confirmation mail down'),
      }),
    )
  })

  it('accepts a valid form with a second guardian', async () => {
    mockMail()

    const result = await runAction({
      ...validFormData,
      parent2Name: 'Peter Mustermann',
      parent2Phone: '+43 660 7654321',
      parent2Email: 'peter@example.com',
      parent2SameAddress: 'on',
    })

    expect((result as Response).headers.get('Location')).toBe(
      '/aufnahme/formular/danke',
    )
    expect(sendAufnahmeConfirmationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        parent2: expect.objectContaining({
          name: 'Peter Mustermann',
          email: 'peter@example.com',
        }),
      }),
    )
  })

  it('rejects bots before parsing', async () => {
    const request = new Request('http://localhost/aufnahme/formular', {
      method: 'POST',
      headers: { 'user-agent': 'Googlebot/2.1' },
      body: new FormData(),
    })

    await expect(action({ request } as any)).rejects.toMatchObject({
      status: 403,
    })
    expect(sendAufnahmeNotificationEmail).not.toHaveBeenCalled()
  })
})

describe('aufnahme-form loader', () => {
  it('redirects the legacy success URL to the confirmation page', async () => {
    const request = new Request(
      'http://localhost/aufnahme/formular?success=true',
    )

    const result = await loader({ request } as any)

    expect(result).toBeInstanceOf(Response)
    expect((result as Response).status).toBe(302)
    expect((result as Response).headers.get('Location')).toBe(
      '/aufnahme/formular/danke',
    )
  })

  it('renders the form normally without the success flag', async () => {
    const request = new Request('http://localhost/aufnahme/formular')

    expect(await loader({ request } as any)).toBeNull()
  })
})
