import { test, expect } from '@playwright/test'

test.describe('Featured Photo Selection', () => {
	test.skip('displays featured photo first when set in Sanity', async ({ page }) => {
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
		await expect(page.locator('figure img').first()).toBeVisible()
	})
})
