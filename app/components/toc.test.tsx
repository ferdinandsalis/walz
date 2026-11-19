/**
 * @vitest-environment jsdom
 */
import { act, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { renderStatic } from '#tests/setup/render-static.ts'
import {
  currentSectionId,
  TocRail,
  type TocSection,
  useCurrentSection,
} from './toc.tsx'

/**
 * Puts a <section id> per entry on the page whose top edge sits where the
 * entry says. Returns a setter to move a section, as scrolling would.
 */
function layOutSections(tops: Record<string, number>) {
  const elements = new Map<string, HTMLElement>()
  for (const [id, top] of Object.entries(tops)) {
    const section = document.createElement('section')
    section.id = id
    document.body.append(section)
    elements.set(id, section)
    placeAt(section, top)
  }
  return (id: string, top: number) => placeAt(elements.get(id)!, top)
}

function placeAt(element: HTMLElement, top: number) {
  element.getBoundingClientRect = () =>
    ({
      top,
      bottom: top + 100,
      left: 0,
      right: 0,
      width: 0,
      height: 100,
    }) as DOMRect
}

function scroll() {
  act(() => {
    window.dispatchEvent(new Event('scroll'))
  })
}

beforeEach(() => {
  // The current-section line sits at 40% of this: 400px from the top
  window.innerHeight = 1000
})

afterEach(() => {
  document.body.innerHTML = ''
})

describe('currentSectionId', () => {
  const s = (id: string, top: number) => ({ id, top })

  it('is the first section before any section reaches the line', () => {
    expect(currentSectionId([s('a', 500), s('b', 900)], 400)).toBe('a')
  })

  it('is the last section whose top has reached the line', () => {
    expect(
      currentSectionId([s('a', -800), s('b', 120), s('c', 700)], 400),
    ).toBe('b')
  })

  it('counts a section exactly on the line', () => {
    expect(currentSectionId([s('a', -10), s('b', 400)], 400)).toBe('b')
  })

  it('stays on the last section at the end of the page', () => {
    expect(currentSectionId([s('a', -900), s('b', -300)], 400)).toBe('b')
  })
})

function CurrentSection({ ids }: { ids: string[] }) {
  return <output>{useCurrentSection(ids)}</output>
}

describe('useCurrentSection', () => {
  it('follows the scroll position', () => {
    const move = layOutSections({ a: -500, b: 100 })
    render(<CurrentSection ids={['a', 'b']} />)
    expect(screen.getByRole('status').textContent).toBe('b')

    move('a', 50)
    move('b', 600)
    scroll()

    expect(screen.getByRole('status').textContent).toBe('a')
  })

  it('skips ids that are not on the page', () => {
    layOutSections({ a: -500, b: 100 })
    render(<CurrentSection ids={['a', 'missing', 'b']} />)

    expect(screen.getByRole('status').textContent).toBe('b')
  })
})

const ueberUns: TocSection[] = [
  { name: 'Menschen', id: 'menschen' },
  { name: 'Philosophie', id: 'philosophie' },
]

describe('TocRail', () => {
  it('lists every section as an anchor link under "Auf dieser Seite"', () => {
    layOutSections({ menschen: 500, philosophie: 1500 })
    render(<TocRail sections={ueberUns} />)

    const nav = screen.getByRole('navigation', { name: 'Auf dieser Seite' })
    const links = within(nav).getAllByRole('link', {
      name: /Menschen|Philosophie/,
    })
    expect(links.map(link => link.getAttribute('href'))).toEqual([
      '#menschen',
      '#philosophie',
    ])
  })

  it('marks the section in view as the current location', () => {
    layOutSections({ menschen: -900, philosophie: 100 })
    render(<TocRail sections={ueberUns} />)

    expect(
      screen
        .getByRole('link', { name: 'Philosophie' })
        .getAttribute('aria-current'),
    ).toBe('location')
    expect(
      screen
        .getByRole('link', { name: 'Menschen' })
        .hasAttribute('aria-current'),
    ).toBe(false)
  })

  it('offers "Nach oben" only after the first screen', () => {
    layOutSections({ menschen: 500, philosophie: 1500 })
    window.scrollY = 0
    render(<TocRail sections={ueberUns} />)
    // Hidden elements have no accessible name, so find it by its text
    const toTop = () => screen.getByText(/Nach oben/).closest('a')!
    expect(toTop().getAttribute('aria-hidden')).toBe('true')

    window.scrollY = 1200
    scroll()

    expect(toTop().hasAttribute('aria-hidden')).toBe(false)
  })

  it('renders the links in the server HTML', () => {
    const html = renderStatic(<TocRail sections={ueberUns} />)

    expect(html.querySelector('a[href="#menschen"]')?.textContent).toBe(
      'Menschen',
    )
  })
})
