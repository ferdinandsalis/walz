/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react'
import { createRoutesStub } from 'react-router'
import { expect, test } from 'vitest'
import { NewsletterForm } from './newsletter.tsx'

function renderWithResult(result: { ok: boolean }) {
  const Stub = createRoutesStub([
    { path: '/', Component: NewsletterForm },
    { path: '/resources/newsletter', action: () => result },
  ])
  render(<Stub initialEntries={['/']} />)
  fireEvent.change(screen.getByPlaceholderText('Deine E-Mail'), {
    target: { value: 'leser@example.com' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Abonnieren' }))
}

test('confirms a successful subscription', async () => {
  renderWithResult({ ok: true })

  expect(await screen.findByText('Aktion Erfolgreich')).toBeTruthy()
})

test('tells the reader when the subscription failed', async () => {
  renderWithResult({ ok: false })

  expect(
    await screen.findByText(
      'Das hat leider nicht geklappt. Bitte versuch es später noch einmal.',
    ),
  ).toBeTruthy()
  expect(screen.queryByText('Aktion Erfolgreich')).toBeNull()
})
