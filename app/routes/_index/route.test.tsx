import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { faqs } from '../__faqs.tsx'
import { FaqSection } from './route.tsx'

const markup = () =>
  renderToStaticMarkup(
    <MemoryRouter>
      <FaqSection />
    </MemoryRouter>,
  )

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
})
