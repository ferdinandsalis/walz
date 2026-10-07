/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { renderStatic } from '#tests/setup/render-static.ts'
import { SectionMap } from './section-map.tsx'

const sections = [
  { id: 'abschnitt-1', number: 1, title: 'Ihre Angaben', state: 'done' },
  { id: 'abschnitt-2', number: 2, title: 'Ihr Kind', state: 'attention' },
  {
    id: 'abschnitt-3',
    number: 3,
    title: 'Weitere erziehungsberechtigte Person',
    state: 'optional',
  },
  { id: 'abschnitt-4', number: 4, title: 'Zum Schluss', state: 'open' },
] as const

// A link's text without its hidden node, as a screen reader names it.
function visibleText(element: Element) {
  const copy = element.cloneNode(true) as Element
  copy.querySelectorAll('[aria-hidden="true"]').forEach(node => node.remove())
  return copy.textContent
}

function renderMap() {
  return renderStatic(<SectionMap sections={sections} />)
}

describe('SectionMap', () => {
  it('renders a nav labelled "Abschnitte" with a link to each section in order', () => {
    const nav = renderMap().querySelector('nav')

    expect(nav?.getAttribute('aria-label')).toBe('Abschnitte')
    const links = [...(nav?.querySelectorAll('ol > li > a') ?? [])]
    expect(
      links.map(link => [link.getAttribute('href'), visibleText(link)]),
    ).toEqual([
      ['#abschnitt-1', 'Ihre Angaben'],
      ['#abschnitt-2', 'Ihr Kind'],
      ['#abschnitt-3', 'Weitere erziehungsberechtigte Person'],
      ['#abschnitt-4', 'Zum Schluss'],
    ])
  })

  it("puts a hidden node with the section's state in each link", () => {
    const links = [...renderMap().querySelectorAll('a')]

    expect(
      links.map(link => {
        const node = link.querySelector('[data-node-state]')
        return [
          node?.getAttribute('aria-hidden'),
          node?.getAttribute('data-node-state'),
        ]
      }),
    ).toEqual([
      ['true', 'done'],
      ['true', 'attention'],
      ['true', 'optional'],
      ['true', 'open'],
    ])
  })

  it('has no steps tail and marks no section as current', () => {
    const container = renderMap()

    expect(container.querySelectorAll('li')).toHaveLength(4)
    expect(container.textContent).not.toContain('So geht es weiter')
    expect(container.textContent).not.toContain('Anmeldung absenden')
    expect(container.querySelector('[aria-current]')).toBeNull()
  })

  it('sets the node ring to the colour of its tinted panel', () => {
    const classes =
      renderMap().querySelector('nav')?.getAttribute('class')?.split(/\s+/) ??
      []

    expect(classes).toEqual(
      expect.arrayContaining([
        'bg-muted/30',
        '[--path-gap:color-mix(in_srgb,var(--color-muted)_30%,var(--color-background))]',
      ]),
    )
  })
})
