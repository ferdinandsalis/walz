import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/aufnahme')
})

test('opens each section with a photo under its title', async ({ page }) => {
  for (const [id, title] of [
    ['voraussetzungen', 'Voraussetzungen'],
    ['kosten', 'Kosten und Finanzierung'],
    ['stipendien', 'Stipendien'],
  ]) {
    const opener = page.locator(`#${id} figure`).first()
    await expect(opener.getByRole('heading', { level: 1 })).toHaveText(title)
    await expect(opener.getByRole('img')).toHaveAttribute('alt', /\S/)
  }
})

test('shows where to join among the five years', async ({ page }) => {
  const years = page.locator('#voraussetzungen [data-year]')
  await expect(years).toHaveCount(5)
  for (const [index, texts] of [
    ['9.', 'Einstieg in die Walz'],
    ['10.', 'Restplätze Delta 2'],
    ['11.', 'Restplätze Gamma 3'],
    ['12.'],
    ['13.', 'Matura'],
  ].entries()) {
    for (const text of texts) await expect(years.nth(index)).toContainText(text)
  }
  // The legend tells what the colours mean, so they never stand alone
  const legend = page.locator('#voraussetzungen [data-year-legend]')
  await expect(legend).toContainText('Einstieg')
  await expect(legend).toContainText('Quereinstieg möglich')
  await expect(legend).toContainText('gerade Plätze frei')
  // The contact follows the grid as a line of its own
  const contact = page
    .locator('#voraussetzungen')
    .getByRole('link', { name: 'agnes.chorherr@walz.at' })
  await expect(contact).toBeVisible()
  await expect(years.locator('a')).toHaveCount(0)
  // The grid takes over the notice, so the free places are told once
  await expect(page.getByText('Plätze frei', { exact: true })).toHaveCount(0)
})

test('shows the key figures on costs', async ({ page }) => {
  const figures = page.locator('#kosten [data-figure]')
  await expect(figures).toHaveCount(3)
  await expect(figures.nth(0)).toContainText('über 90 %')
  await expect(figures.nth(1)).toContainText('€ 700')
  await expect(figures.nth(2)).toContainText('€ 15.729')

  // The figures lead the section, straight under its photo
  const opener = page.locator('#kosten figure').first()
  const openerBottom = (await opener.boundingBox())!
  const firstFigure = (await figures.first().boundingBox())!
  const firstParagraph = (await page
    .locator('#kosten p')
    .filter({ hasText: 'gemeinnütziger Verein und' })
    .boundingBox())!
  expect(firstFigure.y).toBeGreaterThan(openerBottom.y + openerBottom.height)
  expect(firstFigure.y).toBeLessThan(firstParagraph.y)
})

test('lets a graduate speak right after the steps', async ({ page }) => {
  const quote = page.locator('figure:has(> blockquote)')
  await expect(quote).toHaveCount(1)
  await expect(quote.locator('figcaption')).toContainText('Maturajahr')

  const isBetween = await quote.evaluate(element => {
    const steps = document.querySelector('ol[aria-label=Aufnahmeprozess]')!
    const requirements = document.getElementById('voraussetzungen')!
    return (
      Boolean(
        steps.compareDocumentPosition(element) &
        Node.DOCUMENT_POSITION_FOLLOWING,
      ) &&
      Boolean(
        element.compareDocumentPosition(requirements) &
        Node.DOCUMENT_POSITION_FOLLOWING,
      )
    )
  })
  expect(isBetween).toBe(true)
})

// The text column is narrowest just after the lg and xl breakpoints, where a
// further column joins the page; the figures must fit there too.
for (const width of [375, 900, 1160, 1440]) {
  test(`fits the figures into the column at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.evaluate(() => document.fonts.ready)

    const boxes = page.locator('[data-figure]')
    await expect(boxes).toHaveCount(3)
    for (const box of await boxes.all()) {
      const fit = await box.evaluate(element => {
        const figure = element.firstElementChild!
        const lineHeight = parseFloat(getComputedStyle(figure).lineHeight)
        return {
          overflows: element.scrollWidth > element.clientWidth,
          // The large figure stays on one line
          figureLines: Math.round(
            figure.getBoundingClientRect().height / lineHeight,
          ),
        }
      })
      expect(fit).toEqual({ overflows: false, figureLines: 1 })
    }
  })

  test(`fits the five years into the column at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.evaluate(() => document.fonts.ready)

    const years = page.locator('[data-year]')
    await expect(years).toHaveCount(5)
    for (const year of await years.all()) {
      expect(
        await year.evaluate(
          element => element.scrollWidth > element.clientWidth,
        ),
        (await year.textContent()) ?? undefined,
      ).toBe(false)
    }
  })
}
