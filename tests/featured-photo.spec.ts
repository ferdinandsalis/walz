import { test, expect } from '@playwright/test'

test.describe('Featured Photo Selection', () => {
  test.skip('displays featured photo first when set in Sanity', async ({
    page,
  }) => {
    // This test requires Sanity data setup
    // Skip for now - manual testing required
    await page.goto('/jahrgaenge')
    // Would verify featured photo displays on card
  })

  test('year cards display without errors', async ({ page }) => {
    await page.goto('/jahrgaenge')
    await expect(page.locator('article').first()).toBeVisible()
  })

  test('individual year page displays without errors', async ({ page }) => {
    await page.goto('/jahrgaenge')
    const firstYearLink = page.locator('article a').first()
    await firstYearLink.click()
    // Wait for navigation to complete
    await page.waitForLoadState('networkidle')

    // Scoped to the year article: the site footer also carries an h1.
    // The heading only renders if the loader parsed the year document, so this
    // catches a crashed page (error boundary) instead of a merely empty one.
    const article = page.locator('article.post')
    await expect(article.getByRole('heading', { level: 1 })).toBeVisible()

    // Cards are ordered newest first, so the first link is the current
    // Jahrgang, which has no photos until someone uploads them. Accept either
    // valid state of the photo section: the gallery or the empty placeholder.
    const gallery = article.locator('figure img').first()
    const placeholder = page.getByTestId('year-photos-empty')
    await expect(gallery.or(placeholder)).toBeVisible()
  })
})
