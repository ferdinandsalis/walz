/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { renderStatic } from '#tests/setup/render-static.ts'
import { PathNode, PathRail, Waypoint, type PathNodeState } from './path.tsx'

function classesOf(element: Element | null) {
  return element?.getAttribute('class')?.split(/\s+/) ?? []
}

describe('PathNode', () => {
  it.each<PathNodeState>(['open', 'done', 'attention', 'optional'])(
    'hides the %s node from screen readers and names its state',
    state => {
      const node = renderStatic(
        <PathNode state={state} number={1} />,
      ).firstElementChild

      expect(node?.getAttribute('aria-hidden')).toBe('true')
      expect(node?.getAttribute('data-node-state')).toBe(state)
    },
  )

  it('knocks the rail out with a ring in the colour of the surface', () => {
    const node = renderStatic(
      <PathNode state="open" number={1} />,
    ).firstElementChild

    expect(classesOf(node)).toEqual(
      expect.arrayContaining(['ring-4', 'ring-(color:--path-gap)']),
    )
  })

  it('shows a tick and no number when done', () => {
    const node = renderStatic(
      <PathNode state="done" number={1} />,
    ).firstElementChild

    expect(node?.querySelector('svg')).not.toBeNull()
    expect(node?.textContent).toBe('')
  })

  it('shows a "!" instead of the number when it needs attention', () => {
    const node = renderStatic(
      <PathNode state="attention" number={1} />,
    ).firstElementChild

    expect(node?.textContent).toBe('!')
    expect(node?.querySelector('svg')).toBeNull()
  })

  it.each<PathNodeState>(['open', 'optional'])(
    'shows the number when %s',
    state => {
      const node = renderStatic(
        <PathNode state={state} number={3} />,
      ).firstElementChild

      expect(node?.textContent).toBe('3')
      expect(node?.querySelector('svg')).toBeNull()
    },
  )

  it('draws a dashed ring only when optional', () => {
    const optional = renderStatic(
      <PathNode state="optional" number={3} />,
    ).firstElementChild
    const open = renderStatic(
      <PathNode state="open" number={3} />,
    ).firstElementChild

    expect(classesOf(optional)).toContain('border-dashed')
    expect(classesOf(open)).not.toContain('border-dashed')
  })

  it('fills a done node with the done colour', () => {
    const node = renderStatic(<PathNode state="done" />).firstElementChild

    expect(classesOf(node)).toContain('bg-path-done')
  })
})

describe('PathRail', () => {
  it('draws a solid line hidden from screen readers', () => {
    const rail = renderStatic(
      <PathRail>
        <p>Inhalt</p>
      </PathRail>,
    )
    const line = rail.querySelector('[aria-hidden="true"]')

    expect(line).not.toBeNull()
    expect(classesOf(line)).toContain('bg-path')
    expect(classesOf(line)).not.toContain('border-dashed')
  })

  it('draws the line dashed when asked', () => {
    const rail = renderStatic(
      <PathRail dashed>
        <p>Inhalt</p>
      </PathRail>,
    )
    const line = rail.querySelector('[aria-hidden="true"]')

    expect(classesOf(line)).toEqual(
      expect.arrayContaining(['border-dashed', 'border-path']),
    )
    expect(classesOf(line)).not.toContain('bg-path')
  })

  it('indents its children from the rail', () => {
    const rail = renderStatic(
      <PathRail>
        <p>Inhalt</p>
      </PathRail>,
    )
    const indent = rail.querySelector('p')?.parentElement ?? null

    expect(classesOf(indent)).toEqual(
      expect.arrayContaining(['pl-path', 'sm:pl-path-wide']),
    )
  })
})

describe('Waypoint', () => {
  it('is a filled dot hidden from screen readers', () => {
    const waypoint = renderStatic(<Waypoint />).firstElementChild

    expect(waypoint?.getAttribute('aria-hidden')).toBe('true')
    expect(waypoint?.querySelector('.bg-path')).not.toBeNull()
  })
})
