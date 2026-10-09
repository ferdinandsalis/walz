/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react'
import { createRoutesStub } from 'react-router'
import { expect, test, vi } from 'vitest'
import { NewsletterForm } from './newsletter.tsx'

type ActionResult =
  | { ok: true }
  | { ok: false; reason: 'invalid' | 'unavailable' }

function renderForm(result: ActionResult = { ok: true }) {
  const action = vi.fn(() => result)
  const Stub = createRoutesStub([
    { path: '/', Component: NewsletterForm },
    { path: '/resources/newsletter', action },
  ])
  render(<Stub initialEntries={['/']} />)
  return action
}

function emailField() {
  return screen.getByLabelText('E-Mail-Adresse') as HTMLInputElement
}

function subscribe(email: string) {
  fireEvent.change(emailField(), { target: { value: email } })
  fireEvent.click(screen.getByRole('button', { name: 'Abonnieren' }))
}

test('labels the email field', () => {
  renderForm()

  expect(emailField().type).toBe('email')
  expect(emailField().autocomplete).toBe('email')
})

test('asks for an address on an empty submit without sending the form', () => {
  const action = renderForm()

  subscribe('')

  expect(screen.getByText('Gib deine E-Mail-Adresse ein.')).toBeTruthy()
  expect(emailField().getAttribute('aria-invalid')).toBe('true')
  expect(document.activeElement).toBe(emailField())
  expect(action).not.toHaveBeenCalled()
})

test('asks for a well-formed address without sending the form', () => {
  const action = renderForm()

  subscribe('leser.example.com')

  expect(
    screen.getByText(
      'Gib deine E-Mail-Adresse im Format name@beispiel.at ein.',
    ),
  ).toBeTruthy()
  expect(action).not.toHaveBeenCalled()
})

test('clears the address error once the reader types again', () => {
  renderForm()
  subscribe('')

  fireEvent.change(emailField(), { target: { value: 'l' } })

  expect(screen.queryByText('Gib deine E-Mail-Adresse ein.')).toBeNull()
  expect(emailField().getAttribute('aria-invalid')).toBeNull()
})

test('thanks the reader, names the address and moves focus there', async () => {
  renderForm({ ok: true })

  subscribe('leser@example.com')

  const thanks = await screen.findByText('Danke für deine Anmeldung!')
  expect(screen.getByText('leser@example.com')).toBeTruthy()
  expect(document.activeElement?.contains(thanks)).toBe(true)
})

test('leaves nothing to submit again after a successful subscription', async () => {
  renderForm({ ok: true })

  subscribe('leser@example.com')

  await screen.findByText('Danke für deine Anmeldung!')
  expect(screen.queryByLabelText('E-Mail-Adresse')).toBeNull()
  expect(screen.queryByRole('button', { name: 'Abonnieren' })).toBeNull()
})

test('shows the format error when the server rejects the address', async () => {
  renderForm({ ok: false, reason: 'invalid' })

  subscribe('leser@example')

  expect(
    await screen.findByText(
      'Gib deine E-Mail-Adresse im Format name@beispiel.at ein.',
    ),
  ).toBeTruthy()
  expect(emailField().value).toBe('leser@example')
})

test('keeps the address and offers a way out when the subscription failed', async () => {
  renderForm({ ok: false, reason: 'unavailable' })

  subscribe('leser@example.com')

  const alert = await screen.findByRole('alert')
  expect(alert.textContent).toBe(
    'Das hat leider nicht geklappt. Bitte versuch es später noch einmal oder schreib uns an office@walz.at.',
  )
  expect(emailField().value).toBe('leser@example.com')
  expect(screen.queryByText('Danke für deine Anmeldung!')).toBeNull()
})

test('links the privacy policy and says how to unsubscribe', () => {
  renderForm()

  expect(
    screen.getByText(/Abmelden geht jederzeit über den Link in jeder Ausgabe/),
  ).toBeTruthy()
  expect(
    screen
      .getByRole('link', { name: 'Datenschutzerklärung' })
      .getAttribute('href'),
  ).toBe('/datenschutz')
})

test('outlines focused controls in the site-wide orange, not its darker shade', async () => {
  renderForm({ ok: false, reason: 'unavailable' })
  subscribe('leser@example.com')
  await screen.findByRole('alert')

  const controls = [
    emailField(),
    screen.getByRole('button', { name: 'Abonnieren' }),
    screen.getByRole('link', { name: 'Datenschutzerklärung' }),
    screen.getByRole('link', { name: 'office@walz.at' }),
  ]
  for (const control of controls) {
    expect(control.className).toContain('focus-visible:outline-primary')
    expect(control.className).not.toContain('outline-primary-700')
  }
})
