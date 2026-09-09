import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { faqs, featuredFaqs } from '../__faqs.tsx'
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
  it('lists every featured question', () => {
    const html = markup()

    for (const faq of featuredFaqs) {
      expect(html).toContain(faq.question)
    }
  })

  it('leaves the rest of the questions to /haeufige-fragen', () => {
    const html = markup()
    const rest = faqs.filter(faq => !faq.featured)

    expect(rest.length).toBeGreaterThan(0)
    for (const faq of rest) {
      expect(html).not.toContain(faq.question)
    }
  })

  it('opens the first answer, teaser and deep link included', () => {
    const html = markup()

    expect(html).toContain(featuredFaqs[0].teaser)
    expect(html).toContain(`/haeufige-fragen#${featuredFaqs[0].slug}`)
  })

  it('links on to the full list of questions, counting them', () => {
    const html = markup()

    expect(html).toContain('href="/haeufige-fragen"')
    expect(html).toContain(`Alle ${faqs.length} Fragen ansehen`)
  })

  it('always offers a way to ask a question that is not listed', () => {
    const html = markup()

    expect(html).toContain('Noch offene Fragen?')
    expect(html).toContain('href="/kontakt"')
  })

  it('spends no orange on the closing row', () => {
    // Orange marks the open question and nothing else in this section, so the
    // eye has one place to land. See the section comment in route.tsx.
    const closing = markup().split('Noch offene Fragen?')[1]

    expect(closing).not.toContain('text-primary')
  })

  it('names the next orientation event when there is one', () => {
    const html = markup({ nextOrientation: orientation })

    expect(html).toContain('Lieber persönlich?')
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

  it('drops the second door when nothing is scheduled', () => {
    const html = markup({ nextOrientation: null })

    expect(html).not.toContain('href="/die-walz-kennenlernen"')
    expect(html).not.toContain('Lieber persönlich?')
    expect(html).toContain('href="/kontakt"')
  })
})
