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

describe('Input', () => {
  it('renders h-12, the primary-700 focus outline, the invalid fill and the inset shadow', () => {
    const markup = renderToStaticMarkup(<Input />)

    for (const className of [
      'h-12',
      'focus-visible:outline-2',
      'focus-visible:outline-offset-2',
      'focus-visible:outline-primary-700',
      'aria-invalid:bg-danger-50',
      'aria-invalid:border-input-invalid',
      'inset-shadow-field',
    ]) {
      expect(markup).toContain(className)
    }
    expect(markup).not.toContain('focus-visible:ring-2')
  })
})

describe('Textarea', () => {
  it('gets the same focus, invalid and shadow classes but no h-12', () => {
    const markup = renderToStaticMarkup(<Textarea />)

    for (const className of [
      'focus-visible:outline-2',
      'focus-visible:outline-offset-2',
      'focus-visible:outline-primary-700',
      'aria-invalid:bg-danger-50',
      'aria-invalid:border-input-invalid',
      'inset-shadow-field',
    ]) {
      expect(markup).toContain(className)
    }
    expect(markup).not.toContain('focus-visible:ring-2')
    expect(markup).not.toMatch(/\sh-12\b/)
  })
})
