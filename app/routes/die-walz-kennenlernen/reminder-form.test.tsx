import { renderToStaticMarkup } from 'react-dom/server'
import { HoneypotProvider } from 'remix-utils/honeypot/react'
import { describe, expect, it, vi } from 'vitest'

const { mockUseFetcher } = vi.hoisted(() => ({ mockUseFetcher: vi.fn() }))

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')

  return { ...actual, useFetcher: mockUseFetcher }
})

import { ReminderForm } from './route.tsx'

function markup() {
  mockUseFetcher.mockReturnValue({
    data: undefined,
    state: 'idle',
    Form: (props: React.ComponentProps<'form'>) => <form {...props} />,
  })

  return renderToStaticMarkup(
    <HoneypotProvider>
      <ReminderForm />
    </HoneypotProvider>,
  )
}

describe('ReminderForm', () => {
  // The field shipped without a name, so the newsletter action never saw an
  // email and every submission failed its schema.
  it('names the email field so the newsletter action receives it', () => {
    expect(markup()).toContain('name="email"')
  })

  it('posts to the newsletter resource route', () => {
    expect(markup()).toContain('action="/resources/newsletter"')
  })
})
