import { test, expect, type Page } from '@playwright/test'
import { fillParent1, gotoHydratedForm } from './aufnahme-helpers.ts'

test('the newsletter field keeps 16px and shows a visible focus outline', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  const field = page.locator('input[name="email"]')
  await field.scrollIntoViewIfNeeded()

  await expect(field).toHaveCSS('font-size', '16px')
  const before = await field.boundingBox()

  // Reach the field by keyboard so :focus-visible applies.
  const isFocused = () =>
    field.evaluate(element => element === document.activeElement)
  for (let presses = 0; presses < 100 && !(await isFocused()); presses++) {
    await page.keyboard.press('Tab')
  }

  await expect(field).toBeFocused()
  await expect(field).toHaveCSS('outline-style', 'solid')
  await expect(field).toHaveCSS('outline-width', '2px')
  const after = await field.boundingBox()
  expect(after?.height).toBe(before?.height)
})

function sectionMap(page: Page) {
  return page.getByRole('navigation', { name: 'Abschnitte' })
}

// The map sits in the site's right column, clear of the form.
async function expectMapBesideForm(page: Page) {
  const map = sectionMap(page)
  await expect(map).toBeVisible()
  const mapBox = await map.boundingBox()
  const formBox = await page.locator('#abschnitt-1').boundingBox()
  expect(mapBox!.x).toBeGreaterThanOrEqual(formBox!.x + formBox!.width)
}

test('shows the section map beside the form on wide screens', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/aufnahme/formular')
  await expectMapBesideForm(page)

  await sectionMap(page).getByRole('link', { name: 'Ihr Kind' }).click()

  await expect(page.locator('#abschnitt-2')).toBeInViewport()
  const top = await page
    .locator('#abschnitt-2')
    .evaluate(element => element.getBoundingClientRect().top)
  expect(top).toBeGreaterThanOrEqual(0)
  expect(top).toBeLessThan(900)
})

test('shows the section map beside the form on a small laptop', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 768 })
  await page.goto('/aufnahme/formular')
  await expectMapBesideForm(page)
})

test('hides the section map on phones', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/aufnahme/formular')

  await expect(
    page.getByRole('heading', { name: 'Anmeldung für die Walz' }),
  ).toBeVisible()
  await expect(sectionMap(page)).toBeHidden()
})

test("mirrors the form's section state", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await gotoHydratedForm(page)
  const firstNode = sectionMap(page).locator('[data-node-state]').first()
  await expect(firstNode).toHaveAttribute('data-node-state', 'open')

  await fillParent1(page)

  await expect(firstNode).toHaveAttribute('data-node-state', 'done')
})

test('draws the first segment fully under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/aufnahme/formular/danke')

  const segment = page
    .getByRole('list', { name: 'So geht es weiter' })
    .locator('.origin-top')
  await expect(segment).toHaveCount(1)
  await expect(segment).toHaveCSS('transform', 'none')
})

test('shows the steps path and both notices on /aufnahme', async ({ page }) => {
  await page.goto('/aufnahme')

  const steps = page
    .locator('#vorgehensweise')
    .getByRole('list', { name: 'So geht es weiter' })
  await expect(steps.getByRole('listitem')).toHaveText([
    'Anmeldung absenden',
    'Anruf von Frauke Rätz',
    'Aufnahmegespräch',
    'Zu- oder Absage',
  ])

  // "Aufnahmetermin" also appears in the prose, so match the exact text.
  for (const title of ['Aufnahmetermin', 'Plätze frei']) {
    await expect(
      page
        .locator('.bg-secondary-50')
        .filter({ has: page.getByText(title, { exact: true }) }),
    ).toHaveCount(1)
  }

  // The form CTA stays inside the "Aufnahmetermin" notice.
  await page
    .locator('.bg-secondary-50')
    .filter({
      has: page.getByRole('heading', { name: 'Aufnahmetermin', exact: true }),
    })
    .getByRole('link', { name: 'Zum Anmeldeformular' })
    .click()
  await expect(page).toHaveURL('/aufnahme/formular')
})

// The root clips sideways overflow (`overflow-x-hidden` on <html>), so the
// scroll width alone could miss a box running off the screen; every box's
// right edge is checked as well.
async function boxesPastTheRightEdge(page: Page) {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth
    return Array.from(document.body.querySelectorAll('*'))
      .filter(element => element.getBoundingClientRect().right > width + 0.5)
      .map(
        element =>
          `${element.tagName.toLowerCase()} ${element.getAttribute('class') ?? ''}`,
      )
  })
}

test.describe('on a narrow phone', () => {
  test.use({ viewport: { width: 320, height: 640 } })

  for (const path of ['/aufnahme/formular/danke', '/aufnahme']) {
    test(`does not scroll sideways at 320px on ${path}`, async ({ page }) => {
      await page.goto(path)
      await page.evaluate(() => document.fonts.ready)

      await expect(
        page.getByRole('list', { name: 'So geht es weiter' }),
      ).toBeVisible()
      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
      )
      expect(scrollWidth).toBeLessThanOrEqual(320)
      expect(await boxesPastTheRightEdge(page)).toEqual([])
    })
  }
})
