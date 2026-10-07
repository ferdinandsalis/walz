/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { renderStatic } from '#tests/setup/render-static.ts'
import { ChoiceCard, ChoiceList } from './choice.tsx'

function classesOf(element: Element | null | undefined) {
  return element?.getAttribute('class')?.split(/\s+/) ?? []
}

describe('ChoiceCard', () => {
  function renderCard() {
    return renderStatic(
      <ChoiceCard
        name="studentSameAddress"
        label="Wohnt an Ihrer Adresse"
        hint="Entfernen Sie den Haken, wenn Ihr Kind woanders wohnt."
        defaultChecked
      />,
    )
  }

  it('keeps a native checkbox named and identified by the field name', () => {
    const checkbox = renderCard().querySelector('input')

    expect(checkbox?.type).toBe('checkbox')
    expect(checkbox?.id).toBe('studentSameAddress')
    expect(checkbox?.name).toBe('studentSameAddress')
    expect(checkbox?.defaultChecked).toBe(true)
    expect(classesOf(checkbox)).not.toContain('appearance-none')
  })

  it('links the hint from outside the label', () => {
    const container = renderCard()
    const hint = container.querySelector('#studentSameAddress-hint')

    expect(hint?.textContent).toBe(
      'Entfernen Sie den Haken, wenn Ihr Kind woanders wohnt.',
    )
    expect(hint?.closest('label')).toBeNull()
    expect(
      container.querySelector('input')?.getAttribute('aria-describedby'),
    ).toBe('studentSameAddress-hint')
  })

  it('leaves aria-describedby out without a hint', () => {
    const container = renderStatic(
      <ChoiceCard name="parent2SameAddress" label="Wohnt an Ihrer Adresse" />,
    )

    expect(
      container.querySelector('input')?.hasAttribute('aria-describedby'),
    ).toBe(false)
    expect(container.querySelector('p')).toBeNull()
  })

  it('makes the whole row a 48px hit target', () => {
    const label = renderCard().querySelector('label')

    expect(label?.textContent).toBe('Wohnt an Ihrer Adresse')
    expect(classesOf(label)).toContain('min-h-12')
  })

  it('tints the card when checked and outlines it on keyboard focus', () => {
    const card = renderCard().firstElementChild

    expect(classesOf(card)).toEqual(
      expect.arrayContaining([
        'rounded-choice',
        'has-[:checked]:bg-primary-50',
        'has-[:checked]:border-primary',
        'has-[:focus-visible]:outline-primary-700',
      ]),
    )
  })
})

describe('ChoiceList', () => {
  const OPTIONS = [
    { value: 'freunde', label: 'Freund:innen oder Familie' },
    { value: 'social-media', label: 'Social Media' },
    {
      value: 'anderes',
      label: 'Anderes',
      after: <p id="woher">Woher genau?</p>,
    },
    { value: 'zuletzt', label: 'Zuletzt' },
  ]

  function renderList(defaultValue?: string) {
    return renderStatic(
      <ChoiceList
        name="source"
        options={OPTIONS}
        defaultValue={defaultValue}
      />,
    )
  }

  it('renders a native radio per option under the shared name', () => {
    const radios = Array.from(renderList().querySelectorAll('input'))

    expect(radios.map(radio => [radio.type, radio.name, radio.value])).toEqual(
      OPTIONS.map(option => ['radio', 'source', option.value]),
    )
    for (const radio of radios) {
      expect(classesOf(radio)).not.toContain('appearance-none')
    }
  })

  it('checks the radio matching the default value', () => {
    const radios = Array.from(
      renderList('social-media').querySelectorAll('input'),
    )

    expect(radios.map(radio => radio.defaultChecked)).toEqual([
      false,
      true,
      false,
      false,
    ])
  })

  it('checks nothing without a default value', () => {
    const radios = Array.from(renderList().querySelectorAll('input'))

    expect(radios.some(radio => radio.defaultChecked)).toBe(false)
  })

  it('makes every row a 48px hit target', () => {
    const labels = Array.from(renderList().querySelectorAll('label'))

    expect(labels.map(label => label.textContent)).toEqual(
      OPTIONS.map(option => option.label),
    )
    for (const label of labels) {
      expect(classesOf(label)).toContain('min-h-12')
    }
  })

  it('tints the checked option together with its extra content', () => {
    const container = renderList()
    const after = container.querySelector('#woher')
    const labels = Array.from(container.querySelectorAll('label'))

    expect(after?.parentElement).toBe(labels[2]?.parentElement)
    for (const label of labels) {
      expect(classesOf(label.parentElement)).toContain(
        'has-[:checked]:bg-primary-50',
      )
    }
  })

  // The outline matches the card's; it follows only the radio, not a field
  // in the option's extra content.
  it('outlines the option of the radio with keyboard focus', () => {
    const container = renderList()
    const radios = Array.from(container.querySelectorAll('input'))

    for (const radio of radios) {
      expect(classesOf(radio.closest('label')?.parentElement)).toEqual(
        expect.arrayContaining([
          'has-[[type=radio]:focus-visible]:outline-2',
          'has-[[type=radio]:focus-visible]:outline-offset-2',
          'has-[[type=radio]:focus-visible]:outline-primary-700',
        ]),
      )
      expect(classesOf(radio)).toContain('focus-visible:outline-hidden')
    }
  })

  it("puts an option's extra content between its row and the next", () => {
    const container = renderList()
    const after = container.querySelector('#woher')!
    const labels = Array.from(container.querySelectorAll('label'))
    const own = labels[2]!
    const next = labels[3]!

    expect(
      own.compareDocumentPosition(after) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(
      after.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(after.closest('label')).toBeNull()
  })
})
