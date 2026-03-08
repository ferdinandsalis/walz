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
