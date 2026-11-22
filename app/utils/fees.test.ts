import { describe, it } from 'vitest'
import { annualFees } from './fees.ts'

const admission = {
  title: 'Aufnahmebeitrag',
  cost: 2600,
  quantity: 1,
  interval: 'ONCE',
}

describe.concurrent('annual fees', () => {
  it('adds up a year of fees and keeps one-off fees apart', ({ expect }) => {
    const fees = annualFees([
      admission,
      { title: 'Schulgeld', cost: 765, quantity: 12, interval: 'MONTHLY' },
      {
        title: 'Projektbeitrag',
        cost: 931,
        quantity: 4,
        interval: 'QUARTERLY',
      },
      {
        title: 'Sport, Bewegung, Werkstätte',
        cost: 79,
        quantity: 10,
        interval: 'MONTHLY',
      },
      { title: 'Essen', cost: 141, quantity: 10, interval: 'MONTHLY' },
    ])

    expect(fees.total).toBe(15104)
    expect(fees.recurring.map(fee => [fee.title, fee.perYear])).toEqual([
      ['Schulgeld', 9180],
      ['Projektbeitrag', 3724],
      ['Sport, Bewegung, Werkstätte', 790],
      ['Essen', 1410],
    ])
    expect(fees.once.map(fee => fee.title)).toEqual(['Aufnahmebeitrag'])
    expect(fees.recurring[0]!.share).toBeCloseTo(9180 / 15104)
  })

  it('has nothing to add up without recurring fees', ({ expect }) => {
    for (const list of [[], [admission]]) {
      const fees = annualFees(list)
      expect(fees.total).toBe(0)
      expect(fees.recurring).toEqual([])
    }
  })
})
