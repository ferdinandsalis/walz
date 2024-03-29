import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Walz/)
})

test('has about page', async ({ page }) => {
  await page.goto('/ueber-uns')

  await expect(
    page.getByRole('heading', { name: 'Menschen', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Philosophie', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Leitbild', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Geschichte', exact: true }),
  ).toBeVisible()
})
