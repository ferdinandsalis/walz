/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { renderStatic } from '#tests/setup/render-static.ts'
import { StepsPath } from './steps-path.tsx'

const STEPS = [
  { title: 'Anmeldung absenden', description: 'Bestätigung per E-Mail.' },
  { title: 'Anruf', description: 'Ab Mitte November.' },
  { title: 'Aufnahmegespräch', description: 'Etwa 30 Minuten.' },
  { title: 'Zu- oder Absage', description: 'Ab Jänner.' },
]

function hasClass(element: Element, className: string) {
  return element.getAttribute('class')?.split(/\s+/).includes(className)
}

function byClass(container: Element, className: string) {
  return Array.from(container.querySelectorAll('*')).filter(element =>
    hasClass(element, className),
  )
}

function renderSteps(variant: 'compact' | 'full', headingAs?: 'h2' | 'h3') {
  return renderStatic(
    <StepsPath
      steps={STEPS}
      variant={variant}
      heading="So geht es weiter"
      headingAs={headingAs}
    />,
  )
}

describe('StepsPath', () => {
  it.each(['compact', 'full'] as const)(
    'labels the %s list with its heading',
    variant => {
      const container = renderSteps(variant)
      const heading = container.querySelector('h2')
      const list = container.querySelector('ol')

      expect(heading?.textContent).toBe('So geht es weiter')
      expect(heading?.id).toBeTruthy()
      expect(list?.getAttribute('aria-labelledby')).toBe(heading?.id)
    },
  )

  it('renders the heading at the level asked for', () => {
    const container = renderSteps('compact', 'h3')

    expect(container.querySelector('h2')).toBeNull()
    expect(container.querySelector('h3')?.textContent).toBe('So geht es weiter')
  })

  describe('compact', () => {
    it('lists the titles only, with nothing marked done', () => {
      const container = renderSteps('compact')
      const items = Array.from(container.querySelectorAll('ol > li'))

      expect(items.map(item => item.textContent)).toEqual(
        STEPS.map(step => step.title),
      )
      expect(container.textContent).not.toContain('Erledigt')
      expect(container.querySelector('[data-node-state]')).toBeNull()
    })

    it('marks every step with a filled dot', () => {
      const items = Array.from(
        renderSteps('compact').querySelectorAll('ol > li'),
      )

      for (const item of items) {
        const dots = byClass(item, 'bg-path')
        expect(dots).toHaveLength(1)
        expect(dots[0]?.closest('[aria-hidden="true"]')).not.toBeNull()
      }
    })

    it('draws the whole rail dashed', () => {
      const container = renderSteps('compact')

      expect(byClass(container, 'border-dashed')).toHaveLength(1)
      expect(byClass(container, 'bg-path-done')).toHaveLength(0)
    })
  })

  describe('full', () => {
    it('lists titles with their descriptions', () => {
      const container = renderSteps('full')
      const items = Array.from(container.querySelectorAll('ol > li'))

      expect(items).toHaveLength(4)
      items.forEach((item, index) => {
        expect(item.textContent).toContain(STEPS[index]?.title)
        expect(item.textContent).toContain(STEPS[index]?.description)
      })
    })

    it('tells screen readers that step 1 is done', () => {
      const first = renderSteps('full').querySelector('ol > li')
      const prefix = Array.from(first?.querySelectorAll('*') ?? []).find(
        element => element.textContent === 'Erledigt: ',
      )

      expect(first?.textContent?.startsWith('Erledigt: ')).toBe(true)
      expect(prefix).toBeDefined()
      expect(prefix?.closest('[aria-hidden="true"]')).toBeNull()
    })

    it('marks step 1 done, step 2 open and the rest with dots', () => {
      const items = Array.from(renderSteps('full').querySelectorAll('ol > li'))
      const nodes = items.map(item =>
        item
          .querySelector('[data-node-state]')
          ?.getAttribute('data-node-state'),
      )

      expect(nodes).toEqual(['done', 'open', undefined, undefined])
      expect(items[1]?.querySelector('[data-node-state]')?.textContent).toBe(
        '2',
      )
      expect(byClass(items[2]!, 'bg-path')).toHaveLength(1)
      expect(byClass(items[3]!, 'bg-path')).toHaveLength(1)
    })

    it('draws in the solid stretch from step 1 once', () => {
      const container = renderSteps('full')
      const drawn = byClass(container, 'motion-safe:animate-path-draw')

      expect(drawn).toHaveLength(1)
      expect(hasClass(drawn[0]!, 'origin-top')).toBe(true)
      expect(hasClass(drawn[0]!, 'bg-path-done')).toBe(true)
      expect(drawn[0]?.closest('[aria-hidden="true"]')).not.toBeNull()
      expect(drawn[0]?.closest('li')).toBe(container.querySelector('ol > li'))
    })

    it('draws the rail ahead of step 2 dashed', () => {
      const container = renderSteps('full')

      expect(byClass(container, 'border-dashed')).toHaveLength(1)
    })
  })
})
