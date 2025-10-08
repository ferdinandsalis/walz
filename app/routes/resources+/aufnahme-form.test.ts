import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  sendAufnahmeConfirmationEmail,
  sendAufnahmeNotificationEmail,
} from '#app/utils/email.server.ts'
import { action } from '../aufnahme+/formular.tsx'

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

  const validFormData = {
    studentName: 'Max Mustermann',
    studentEmail: 'max@example.com',
    studentAddress: 'Musterstraße 1, 1010 Wien',
    studentBirthdate: '2010-01-15',
    currentSchool: 'Gymnasium Wien',
    currentGrade: '8',
    parent1Name: 'Anna Mustermann',
    parent1Phone: '+43 660 1234567',
    parent1Email: 'anna@example.com',
    parent1Address: 'Musterstraße 1, 1010 Wien',
    parent2Name: '',
    parent2Phone: '',
    parent2Email: '',
    parent2Address: '',
    source: 'Google Suche',
  }

  it('should successfully process valid form data', async () => {
    vi.mocked(sendAufnahmeConfirmationEmail).mockResolvedValue({
      success: true,
    })
    vi.mocked(sendAufnahmeNotificationEmail).mockResolvedValue({
      success: true,
    })

    const formData = new FormData()
    Object.entries(validFormData).forEach(([key, value]) => {
      formData.append(key, value)
    })

    const request = new Request('http://localhost/resources/aufnahme-form', {
      method: 'POST',
      body: formData,
    })

    const result = await action({ request } as any)

    expect(result).toBeInstanceOf(Response)
    expect((result as Response).status).toBe(302)
    expect((result as Response).headers.get('Location')).toBe(
      '/aufnahme/formular?success=true',
    )
    expect(sendAufnahmeConfirmationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        studentName: 'Max Mustermann',
        studentEmail: 'max@example.com',
      }),
    )
    expect(sendAufnahmeNotificationEmail).toHaveBeenCalled()
  })

  it('should reject form with missing required fields', async () => {
    const formData = new FormData()
    formData.append('studentName', 'Max Mustermann')
    // Missing other required fields

    const request = new Request('http://localhost/resources/aufnahme-form', {
      method: 'POST',
      body: formData,
    })

    const result = await action({ request } as any)

    expect(result).toMatchObject({
      success: false,
      error: 'Bitte füllen Sie alle erforderlichen Felder korrekt aus.',
    })
    expect(sendAufnahmeConfirmationEmail).not.toHaveBeenCalled()
  })

  it('should reject invalid email addresses', async () => {
    const formData = new FormData()
    Object.entries({ ...validFormData, studentEmail: 'invalid-email' }).forEach(
      ([key, value]) => {
        formData.append(key, value)
      },
    )

    const request = new Request('http://localhost/resources/aufnahme-form', {
      method: 'POST',
      body: formData,
    })

    const result = await action({ request } as any)

    expect(result).toMatchObject({
      success: false,
      error: 'Bitte füllen Sie alle erforderlichen Felder korrekt aus.',
    })
  })

  it('should handle email sending failure gracefully', async () => {
    // Mock console.error since we expect it to be called
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    vi.mocked(sendAufnahmeConfirmationEmail).mockResolvedValue({
      success: false,
      error: 'Email service unavailable',
    })

    const formData = new FormData()
    Object.entries(validFormData).forEach(([key, value]) => {
      formData.append(key, value)
    })

    const request = new Request('http://localhost/resources/aufnahme-form', {
      method: 'POST',
      body: formData,
    })

    const result = await action({ request } as any)

    expect(result).toMatchObject({
      success: false,
      error: expect.stringContaining('Bestätigungs-E-Mail'),
    })

    expect(consoleError).toHaveBeenCalled()
    consoleError.mockRestore()
  })

  it('should accept valid form with parent 2 information', async () => {
    vi.mocked(sendAufnahmeConfirmationEmail).mockResolvedValue({
      success: true,
    })
    vi.mocked(sendAufnahmeNotificationEmail).mockResolvedValue({
      success: true,
    })

    const formData = new FormData()
    Object.entries({
      ...validFormData,
      parent2Name: 'Peter Mustermann',
      parent2Phone: '+43 660 7654321',
      parent2Email: 'peter@example.com',
      parent2Address: 'Musterstraße 1, 1010 Wien',
    }).forEach(([key, value]) => {
      formData.append(key, value)
    })

    const request = new Request('http://localhost/resources/aufnahme-form', {
      method: 'POST',
      body: formData,
    })

    const result = await action({ request } as any)

    expect(result).toBeInstanceOf(Response)
    expect((result as Response).status).toBe(302)
    expect((result as Response).headers.get('Location')).toBe(
      '/aufnahme/formular?success=true',
    )
    expect(sendAufnahmeConfirmationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        parent2Name: 'Peter Mustermann',
        parent2Email: 'peter@example.com',
      }),
    )
  })
})
