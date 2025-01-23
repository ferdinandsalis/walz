import { describe, it } from 'vitest'
import { calculateCurrentYear, determineCurrentSchoolYear } from './years.ts'

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

describe.concurrent('determine current school year eg. 2023/24', () => {
  it('determines it correctly early in the year', async ({ expect }) => {
    const earlyInYear = determineCurrentSchoolYear(new Date('2023-01-01'))
    expect(earlyInYear.from.getFullYear()).toBe(2022)
    expect(earlyInYear.to.getFullYear()).toBe(2023)
  })
  it('determines it correctly late in the year', async ({ expect }) => {
    const lateInYear = determineCurrentSchoolYear(new Date('2023-09-04'))
    expect(lateInYear.from.getFullYear()).toBe(2023)
    expect(lateInYear.to.getFullYear()).toBe(2024)
  })
})
