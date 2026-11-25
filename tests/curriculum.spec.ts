import { test, expect } from '@playwright/test'
import { boxesPastTheRightEdge } from './aufnahme-helpers.ts'

test.beforeEach(async ({ page }) => {
  await page.goto('/curriculum')
})

test('shows five years with their numerals', async ({ page }) => {
  for (const n of [1, 2, 3, 4, 5]) {
    await expect(page.locator(`#jahr-${n}`)).toBeVisible()
  }
  await expect(page.locator('#jahr-1 h2')).toContainText(
    'Timeout und Ausprobieren',
  )
  await expect(
    page
      .locator('#jahr-5')
      .getByRole('listitem')
      .filter({ hasText: /^Matura$/ }),
  ).toBeVisible()
})

test('renders the years without React key errors', async ({ page }) => {
  const keyErrors: string[] = []
  page.on('console', message => {
    if (message.type() === 'error' && message.text().includes('same key')) {
      keyErrors.push(message.text())
    }
  })
  await page.goto('/curriculum')
  await page.waitForFunction(() => '__reactRouterDataRouter' in window)
  await expect(page.locator('#jahr-5')).toBeVisible()
  expect(keyErrors).toEqual([])
})

test('says the first year has no exams', async ({ page }) => {
  await expect(page.locator('#jahr-1')).toContainText(
    'Keine – ein Jahr Time-out vom Prüfungsstress',
  )
})

test('opens the photos of a project', async ({ page }) => {
  await page.waitForFunction(() => '__reactRouterDataRouter' in window)
  // Handwerk comes after Forst's three photos, so the viewer opens at the 4th
  await page
    .locator('#jahr-1')
    .getByRole('button', { name: /Handwerk/ })
    .click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText(/^4 \/ \d+$/)).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})

test('leaves no gaps in a mosaic', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  for (const n of [1, 2, 3, 4, 5]) {
    // The photo list dissolves into the mosaic, so the opening and its
    // photos are placed in the list's parent grid
    const holes = await page
      .getByRole('list', { name: `Projekte im ${n}. Jahr` })
      .evaluate(list => {
        const grid = list.parentElement!
        const columns =
          getComputedStyle(grid).gridTemplateColumns.split(' ').length
        const taken = new Set<string>()
        let lastRow = 0
        const items = [grid.firstElementChild!, ...Array.from(list.children)]
        for (const item of items) {
          const style = getComputedStyle(item)
          const row = Number(style.gridRowStart)
          const col = Number(style.gridColumnStart)
          const rowSpan = Number(/span (\d+)/.exec(style.gridRowEnd)?.[1] ?? 1)
          const colSpan = Number(
            /span (\d+)/.exec(style.gridColumnEnd)?.[1] ?? 1,
          )
          for (let r = row; r < row + rowSpan; r++) {
            for (let c = col; c < col + colSpan; c++) taken.add(`${r}/${c}`)
          }
          lastRow = Math.max(lastRow, row + rowSpan - 1)
        }
        const empty: string[] = []
        for (let r = 1; r < lastRow; r++) {
          for (let c = 1; c <= columns; c++) {
            if (!taken.has(`${r}/${c}`)) empty.push(`${r}/${c}`)
          }
        }
        return { columns, empty }
      })
    expect(holes, `year ${n}`).toEqual({ columns: 4, empty: [] })
  }
})

test('keeps a longer opening inside its corner', async ({ page }) => {
  for (const width of [390, 896, 1160]) {
    await page.setViewportSize({ width, height: 900 })
    const corner = page.locator('#jahr-4 > div:first-child > div:first-child')
    // Agnes may lengthen the first sentence; the corner has to grow with it
    const spill = await corner.evaluate(opening => {
      const lead = opening.querySelector('p')!
      lead.textContent += ' ' + lead.textContent
      const top = opening.firstElementChild!.getBoundingClientRect().top
      return opening.getBoundingClientRect().top - top
    })
    expect(spill, `${width}px`).toBeLessThanOrEqual(0)
  }
})

test('puts the photos of a year in one swipeable row on phones', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const n of [1, 2, 3, 4, 5]) {
    const row = page.getByRole('list', { name: `Projekte im ${n}. Jahr` })
    const { tops, height } = await row.evaluate(list => ({
      tops: new Set(
        Array.from(list.children).map(item => item.getBoundingClientRect().top),
      ).size,
      height: list.getBoundingClientRect().height,
    }))
    expect({ tops, short: height <= 260 }, `year ${n}`).toEqual({
      tops: 1,
      short: true,
    })
  }
  // Year 1 has more projects than fit, so the row scrolls sideways
  const firstYear = page.getByRole('list', { name: 'Projekte im 1. Jahr' })
  expect(
    await firstYear.evaluate(list => list.scrollWidth > list.clientWidth),
  ).toBe(true)
})

test('fits a phone screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 })
  await expect(page.locator('#jahr-5')).toBeAttached()
  expect(await boxesPastTheRightEdge(page)).toEqual([])
})
