import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Walz/)
})

test('has alumni page', async ({ page }) => {
  await page.goto('/alumni')

  await expect(
    page.getByRole('heading', { name: 'Ehrensache Walz' }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Ehemalige Jahrgänge' }),
  ).toBeVisible()
  await expect(page.getByText('AT47 1200 0094 3508 9999')).toBeVisible()
})

test('has about page', async ({ page }) => {
  await page.goto('/ueber-uns')

  await expect(page.getByRole('heading', { name: 'Menschen' })).toBeVisible()
  expect(
    page.getByRole('heading', { name: 'Philosophie', exact: true }),
  ).toBeDefined()
  expect(
    page.getByRole('heading', { name: 'Leitbild', exact: true }),
  ).toBeDefined()
  expect(
    page.getByRole('heading', { name: 'Geschichte', exact: true }),
  ).toBeDefined()
})

test('names the phone menu button and gives it a thumb-sized target', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  // The toggle only works once React has hydrated the page
  await page.waitForFunction(() => '__reactRouterDataRouter' in window)

  const menu = page.getByRole('button', { name: 'Menü' })
  await expect(menu).toBeVisible()
  // A thumb-sized target
  const target = await menu.boundingBox()
  expect(target!.width).toBeGreaterThanOrEqual(44)
  expect(target!.height).toBeGreaterThanOrEqual(44)
  await expect(menu).toHaveAttribute('aria-expanded', 'false')
  await menu.click()
  await expect(menu).toHaveAttribute('aria-expanded', 'true')
})
