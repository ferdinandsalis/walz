import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { faqs } from '../__faqs.tsx'
import { FaqSection } from './route.tsx'

const markup = (props: Parameters<typeof FaqSection>[0] = {}) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <FaqSection {...props} />
    </MemoryRouter>,
  )

const orientation = {
  title: 'Informationsabend',
  // Midday UTC on purpose: midnight formats as the previous day west of
  // Greenwich, which would make this assertion depend on the test machine.
  start: { date: new Date('2026-11-12T12:00:00Z'), time: '18:30' },
}

describe('FaqSection', () => {
  it('lists every question', () => {
    const html = markup()

    for (const faq of faqs) {
      expect(html).toContain(faq.question)
    }
  })

  it('opens the first answer, teaser and deep link included', () => {
    const html = markup()

    expect(html).toContain(faqs[0].teaser)
    expect(html).toContain(`/haeufige-fragen#${faqs[0].slug}`)
  })

  it('links on to the full list of questions', () => {
    expect(markup()).toContain('href="/haeufige-fragen"')
  })

  it('always offers a way to ask a question that is not listed', () => {
    const html = markup()

    expect(html).toContain('Frage nicht dabei?')
    expect(html).toContain('href="/kontakt"')
  })

  it('names the next orientation event when there is one', () => {
    const html = markup({ nextOrientation: orientation })

    expect(html).toContain('Informationsabend')
    expect(html).toContain('12. November')
    expect(html).toContain('18:30 Uhr')
    expect(html).toContain('href="/die-walz-kennenlernen"')
  })

  it('omits the time when the event has none', () => {
    const html = markup({
      nextOrientation: {
        ...orientation,
        start: { date: orientation.start.date },
      },
    })

    expect(html).toContain('12. November')
    expect(html).not.toContain('Uhr')
  })

  it('drops the orientation line when nothing is scheduled', () => {
    const html = markup({ nextOrientation: null })

    expect(html).not.toContain('href="/die-walz-kennenlernen"')
    expect(html).toContain('href="/kontakt"')
  })
})
