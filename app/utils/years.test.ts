import { describe, it } from 'vitest'
import { calculateCurrentYear } from './years.ts'

describe.concurrent('calculate current school years', () => {
  it('counts the years', async ({ expect }) => {
    const years = calculateCurrentYear(
      new Date('2021-09-01'),
      new Date('2024-09-02'),
    )
    expect(years).toBe(4)
  })
  it('counts one if first year', async ({ expect }) => {
    const years = calculateCurrentYear(
      new Date('2021-09-01'),
      new Date('2021-10-04'),
    )
    expect(years).toBe(1)
  })
  it('counts uncompleted years', async ({ expect }) => {
    const years = calculateCurrentYear(
      new Date('2021-09-01'),
      new Date('2024-05-04'),
    )
    expect(years).toBe(3)
  })
})
