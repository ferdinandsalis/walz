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

test('counts the exams on the way to the Matura', async ({ page }) => {
  await expect(
    page.getByRole('heading', { name: /17 externe Prüfungen/ }),
  ).toBeVisible()
  await expect(page.locator('#jahr-1')).toContainText(
    'Keine – ein Jahr Time-out vom Prüfungsstress',
  )
})

test('jumps from the strip to the year', async ({ page }) => {
  await page.locator('a[href="#jahr-3"]').click()
  await expect(page).toHaveURL(/#jahr-3$/)
  await expect(page.locator('#jahr-3')).toBeInViewport()
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
    const holes = await page
      .locator(`#jahr-${n} ul`)
      .first()
      .evaluate(grid => {
        const columns =
          getComputedStyle(grid).gridTemplateColumns.split(' ').length
        const taken = new Set<string>()
        let lastRow = 0
        for (const item of Array.from(grid.children)) {
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
    const corner = page.locator('#jahr-4 ul > li').first()
    // Agnes may lengthen the first sentence; the corner has to grow with it
    const spill = await corner.evaluate(li => {
      const lead = li.querySelector('p')!
      lead.textContent += ' ' + lead.textContent
      const top = li.firstElementChild!.getBoundingClientRect().top
      return li.getBoundingClientRect().top - top
    })
    expect(spill, `${width}px`).toBeLessThanOrEqual(0)
  }
})

test('fits a phone screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 })
  await expect(page.locator('#jahr-5')).toBeAttached()
  expect(await boxesPastTheRightEdge(page)).toEqual([])
})
