import { afterEach, expect, test, vi } from 'vitest'
import { trackEvent } from './analytics.ts'

afterEach(() => {
  // `restoreMocks` restores spies but does not unstub globals.
  vi.unstubAllGlobals()
})

test('sends the event and its props to Plausible', () => {
  const plausible = vi.fn()
  vi.stubGlobal('window', { plausible })

  trackEvent('FAQ Open', { faq: 'was-kostet-die-walz' })

  expect(plausible).toHaveBeenCalledWith('FAQ Open', {
    props: { faq: 'was-kostet-die-walz' },
  })
})

test('omits the options argument when there are no props', () => {
  const plausible = vi.fn()
  vi.stubGlobal('window', { plausible })

  trackEvent('FAQ Open')

  expect(plausible).toHaveBeenCalledWith('FAQ Open', undefined)
})

test('does nothing when Plausible is blocked or has not loaded', () => {
  vi.stubGlobal('window', {})

  expect(() => trackEvent('FAQ Open')).not.toThrow()
})

test('does nothing during server rendering', () => {
  expect(() => trackEvent('FAQ Open')).not.toThrow()
})
