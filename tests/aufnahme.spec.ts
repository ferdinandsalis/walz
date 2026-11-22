import { AxeBuilder } from '@axe-core/playwright'
import { test, expect } from '@playwright/test'
import { boxesPastTheRightEdge, resolvedColor } from './aufnahme-helpers.ts'

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
    ['10.', 'Restplätze in Delta'],
    ['11.', 'Restplätze in Gamma'],
    ['12.'],
    ['13.', 'Matura'],
  ].entries()) {
    for (const text of texts) await expect(years.nth(index)).toContainText(text)
  }
  // Each year that takes side entrants says so itself, and from sm one
  // caption says it for all of them
  for (const index of [1, 2])
    await expect(years.nth(index)).toContainText('Quereinstieg')
  for (const index of [0, 3, 4])
    await expect(years.nth(index)).not.toContainText('Quereinstieg')
  await expect(page.locator('#voraussetzungen [data-year-caption]')).toHaveText(
    'Quereinstieg möglich',
  )
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

const amount = (text: string | null) => Number(text?.replace(/\D/g, ''))

// The fees come from Sanity, so these tests take whatever fees the page
// shows: Agnes may drop a fee, its description or the one-off fee.
test('adds up the fees of a year', async ({ page }) => {
  const perYear = await page
    .locator('#kosten [data-fee] [data-per-year]')
    .evaluateAll(cells => cells.map(cell => cell.textContent))
  const sum = page.locator('#kosten [data-fee-sum] [data-per-year]')
  if (perYear.length === 0) {
    await expect(sum).toHaveCount(0)
    return
  }
  expect(amount(await sum.textContent())).toBe(
    perYear.reduce((total, text) => total + amount(text), 0),
  )
})

test('opens a fee for its full description', async ({ page }) => {
  const fees = page.locator('#kosten details')
  for (const details of await fees.all()) {
    await expect(details).not.toHaveAttribute('open')
  }
  test.skip((await fees.count()) === 0, 'No fee has a description')

  await fees.first().locator('summary').click()
  await expect(fees.first()).toHaveAttribute('open')
  await expect(fees.first().locator('[data-fee-description]')).toBeVisible()

  // The keyboard opens a fee as well
  await fees.first().locator('summary').focus()
  await page.keyboard.press('Enter')
  await expect(fees.first()).not.toHaveAttribute('open')
  await page.keyboard.press('Space')
  await expect(fees.first()).toHaveAttribute('open')
})

test.describe('on a narrow phone', () => {
  test.use({ viewport: { width: 320, height: 640 } })

  test('keeps every fee whole with every fee open', async ({ page }) => {
    await page.evaluate(() => document.fonts.ready)
    await page
      .locator('#kosten details')
      .evaluateAll((all: HTMLDetailsElement[]) =>
        all.forEach(details => (details.open = true)),
      )
    expect(await boxesPastTheRightEdge(page)).toEqual([])
  })

  // A fee's title is one long word in German easily; it must wrap, not push
  // the yearly amount off the screen.
  test('wraps a fee title of one long word', async ({ page }) => {
    await page.evaluate(() => document.fonts.ready)
    const title = page.locator('#kosten [data-fee-title]').first()
    const overlap = await title.evaluate(element => {
      element.textContent = 'Ganztagesbetreuungskostenbeitrag'
      const row = element.closest('summary, [data-fee]')!
      const perYear = row.querySelector('[data-per-year]')!
      return (
        element.getBoundingClientRect().right -
        perYear.getBoundingClientRect().left
      )
    })
    expect(overlap).toBeLessThanOrEqual(0)
    expect(await boxesPastTheRightEdge(page)).toEqual([])
  })
})

// The new small text keeps to the colour rules in app.css: small orange text
// in primary-700 or darker, dark text on the brand colours.
test('keeps the new small text readable', async ({ page }) => {
  await page.evaluate(() => document.fonts.ready)
  const { violations } = await new AxeBuilder({ page })
    .include('[data-step-when]')
    .include('[data-year]')
    .include('[data-per-year]')
    .withRules(['color-contrast'])
    .analyze()
  expect(violations.flatMap(v => v.nodes.map(n => n.target))).toEqual([])

  // The bar is hidden from screen readers, so axe skips it; its labels are
  // checked against the colour tokens directly: dark text on the plain brand
  // colour, clear of any pattern.
  const labels = await page
    .locator('[data-fee-bar] > * > span')
    .evaluateAll(labels =>
      labels.map(label => {
        const style = getComputedStyle(label)
        return {
          text: style.color,
          fill: style.backgroundColor,
          pattern: style.backgroundImage,
        }
      }),
    )
  expect(labels.length).toBeGreaterThan(0)
  const foreground = await resolvedColor(page, '--color-foreground')
  const brandColours = [
    await resolvedColor(page, '--color-primary'),
    await resolvedColor(page, '--color-secondary'),
  ]
  for (const label of labels) {
    expect(label.text).toBe(foreground)
    expect(brandColours).toContain(label.fill)
    expect(label.pattern).toBe('none')
  }
})
