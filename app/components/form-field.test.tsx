import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { Field, FieldGroup, fieldIds } from './form-field.tsx'

describe('fieldIds', () => {
  it('derives hint and error ids from the field name', () => {
    expect(fieldIds('x')).toEqual({ hintId: 'x-hint', errorId: 'x-error' })
  })
})

describe('Field', () => {
  it('wires hint and error into aria-describedby', () => {
    const markup = renderToStaticMarkup(
      <Field name="x" label="Name" hint="Ihr Vorname" error="Pflichtfeld">
        {control => <input {...control} />}
      </Field>,
    )

    expect(markup).toContain('aria-describedby="x-hint x-error"')
    expect(markup).toContain('aria-invalid="true"')
    expect(markup).toContain('<label')
    expect(markup).toContain('for="x"')
    expect(markup).toContain('id="x-hint"')
    expect(markup).toContain('id="x-error"')
  })

  it('omits aria-invalid and the error id without an error', () => {
    const markup = renderToStaticMarkup(
      <Field name="x" label="Name" hint="Ihr Vorname">
        {control => <input {...control} />}
      </Field>,
    )

    expect(markup).toContain('aria-describedby="x-hint"')
    expect(markup).not.toContain('aria-invalid')
    expect(markup).not.toContain('x-error')
  })

  it('omits aria-describedby without hint and error', () => {
    const markup = renderToStaticMarkup(
      <Field name="x" label="Name">
        {control => <input {...control} />}
      </Field>,
    )

    expect(markup).not.toContain('aria-describedby')
  })

  it('renders label, hint, error, control in that order', () => {
    const markup = renderToStaticMarkup(
      <Field name="x" label="Name" hint="Ihr Vorname" error="Pflichtfeld">
        {control => <input {...control} />}
      </Field>,
    )

    const label = markup.indexOf('<label')
    const hint = markup.indexOf('id="x-hint"')
    const error = markup.indexOf('id="x-error"')
    const control = markup.indexOf('<input')

    expect(label).toBeGreaterThanOrEqual(0)
    expect(label).toBeLessThan(hint)
    expect(hint).toBeLessThan(error)
    expect(error).toBeLessThan(control)
  })
})

describe('FieldGroup', () => {
  it('renders a fieldset with legend, hint and error ids', () => {
    const markup = renderToStaticMarkup(
      <FieldGroup
        name="g"
        legend="Geschlecht"
        hint="Bitte wählen"
        error="Pflichtfeld"
      >
        <input type="radio" name="g" />
      </FieldGroup>,
    )

    expect(markup).toContain('<fieldset')
    expect(markup).toContain('aria-describedby="g-hint g-error"')
    expect(markup).toContain('<legend')
    expect(markup).toContain('id="g-hint"')
    expect(markup).toContain('id="g-error"')
    expect(markup.indexOf('<legend')).toBeLessThan(
      markup.indexOf('id="g-hint"'),
    )
    expect(markup.indexOf('id="g-error"')).toBeLessThan(
      markup.indexOf('<input'),
    )
  })
})
