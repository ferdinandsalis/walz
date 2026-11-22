/**
 * @vitest-environment jsdom
 */
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FeeOverview } from './__fee-overview.tsx'

const admission = {
  title: 'Aufnahmebeitrag',
  cost: 2600,
  quantity: 1,
  interval: 'ONCE',
  description: 'Der einmalige Aufnahmebeitrag',
}

describe('fee overview', () => {
  it('shows a fee without a description as a plain row', () => {
    const { container } = render(
      <FeeOverview
        list={[
          { title: 'Schulgeld', cost: 765, quantity: 12, interval: 'MONTHLY' },
          {
            title: 'Essen',
            cost: 141,
            quantity: 10,
            interval: 'MONTHLY',
            description: 'Frühstück, Mittag, Jause',
          },
        ]}
      />,
    )
    const rows = container.querySelectorAll('[data-fee]')
    expect(rows).toHaveLength(2)
    expect(rows[0]!.tagName).toBe('DIV')
    expect(rows[0]!.querySelector('summary')).toBeNull()
    expect(rows[1]!.tagName).toBe('DETAILS')
  })

  it('leaves out the bar and the sum without recurring fees', () => {
    const { container } = render(<FeeOverview list={[admission]} />)
    expect(container.querySelector('[data-fee-bar]')).toBeNull()
    expect(container.querySelector('[data-fee-sum]')).toBeNull()
    expect(container.querySelectorAll('[data-fee-once]')).toHaveLength(1)
  })

  it('labels only the segments with room for their amount', () => {
    const { container } = render(
      <FeeOverview
        list={[
          { title: 'Schulgeld', cost: 765, quantity: 12, interval: 'MONTHLY' },
          { title: 'Sport', cost: 79, quantity: 10, interval: 'MONTHLY' },
        ]}
      />,
    )
    const segments = container.querySelectorAll('[data-fee-bar] > *')
    expect(segments).toHaveLength(2)
    expect(segments[0]!.textContent).toMatch(/^€\s9\.180$/)
    expect(segments[1]!.textContent).toBe('')
  })
})
