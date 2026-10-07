import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { Input } from './input.tsx'
import { Textarea } from './textarea.tsx'

describe.each([
  ['Input', <Input key="i" />],
  ['Textarea', <Textarea key="t" />],
])('%s', (_name, element) => {
  it('uses 16px text so iOS does not zoom on focus', () => {
    const markup = renderToStaticMarkup(element)

    expect(markup).toContain('text-base')
    expect(markup).not.toMatch(/\stext-sm\b/)
  })

  it('draws a 2px invalid border when aria-invalid', () => {
    const markup = renderToStaticMarkup(element)

    expect(markup).toContain('aria-invalid:border-input-invalid')
    expect(markup).toContain('aria-invalid:border-2')
  })
})
