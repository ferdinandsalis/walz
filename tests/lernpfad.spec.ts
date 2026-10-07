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
