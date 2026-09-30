import { test, expect } from '@playwright/test'

const missingPages = [
  '/gibt-es-nicht',
  '/aktuelles/beitraege/gibt-es-nicht',
  '/termine/gibt-es-nicht',
  '/jahrgaenge/gibt-es-nicht',
  '/jahrgaenge/gibtesnicht',
]

for (const path of missingPages) {
  test(`shows the not-found page inside the site for ${path}`, async ({
    page,
  }) => {
    const response = await page.goto(path)

    expect(response?.status()).toBe(404)
    await expect(page).not.toHaveTitle(/undefined/)
    await expect(
      page.getByRole('heading', {
        name: 'Leider konnten wir diese Seite nicht finden:',
      }),
    ).toBeVisible()
    await expect(
      page
        .getByRole('navigation', { name: 'Global' })
        .getByRole('link', { name: 'Aktuelles' }),
    ).toBeVisible()
  })
}
