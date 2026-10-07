/**
 * @vitest-environment jsdom
 */
import { Lock } from '@phosphor-icons/react'
import { describe, expect, it } from 'vitest'
import { renderStatic } from '#tests/setup/render-static.ts'
import { Notice } from './notice.tsx'

function classesOf(element: Element | null | undefined) {
  return element?.getAttribute('class')?.split(/\s+/) ?? []
}

describe('Notice', () => {
  it('sets its content on a blue wash', () => {
    const notice = renderStatic(
      <Notice icon={Lock}>
        <p>Wir verwenden Ihre Angaben nur für die Aufnahme.</p>
      </Notice>,
    ).firstElementChild

    expect(classesOf(notice)).toContain('bg-secondary-50')
    expect(notice?.textContent).toBe(
      'Wir verwenden Ihre Angaben nur für die Aufnahme.',
    )
  })

  it('shows a blue icon hidden from screen readers', () => {
    const icon = renderStatic(
      <Notice icon={Lock}>
        <p>Text</p>
      </Notice>,
    ).querySelector('svg')

    expect(icon?.getAttribute('aria-hidden')).toBe('true')
    expect(classesOf(icon)).toContain('text-secondary-700')
  })

  it('renders the title as a heading at the level asked for', () => {
    const container = renderStatic(
      <Notice icon={Lock} title="Für Ihr Kind bis zum Gespräch" titleAs="h2">
        <p>Text</p>
      </Notice>,
    )
    const heading = container.querySelector('h2')

    expect(heading?.textContent).toBe('Für Ihr Kind bis zum Gespräch')
    expect(classesOf(heading)).toContain('text-secondary-800')
    expect(container.querySelector('h3')).toBeNull()
  })

  it('renders an h3 title when asked', () => {
    const container = renderStatic(
      <Notice icon={Lock} title="Aufnahmetag" titleAs="h3">
        <p>Text</p>
      </Notice>,
    )

    expect(container.querySelector('h3')?.textContent).toBe('Aufnahmetag')
    expect(container.querySelector('h2')).toBeNull()
  })

  it('has no heading without a title', () => {
    const container = renderStatic(
      <Notice icon={Lock}>
        <p>Text</p>
      </Notice>,
    )

    expect(container.querySelector('h1, h2, h3, h4, h5, h6')).toBeNull()
  })
})
