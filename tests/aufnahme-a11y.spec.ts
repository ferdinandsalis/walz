import { AxeBuilder } from '@axe-core/playwright'
import { test, expect, type Page } from '@playwright/test'

const WCAG_AA_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

async function scan(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(WCAG_AA_TAGS)
    .analyze()
  return violations
}

test.describe('Aufnahme accessibility', () => {
  test('the empty form has no WCAG AA violations', async ({ page }) => {
    await page.goto('/aufnahme/formular')
    await expect(
      page.getByRole('heading', { name: 'Anmeldung für die Walz' }),
    ).toBeVisible()

    expect(await scan(page)).toEqual([])
  })

  test('the error state has no WCAG AA violations', async ({ page }) => {
    await page.goto('/aufnahme/formular')
    // The submit guard and the focused summary need React on the page
    await page.waitForFunction(() => '__reactRouterDataRouter' in window)

    // The empty form fails validation server-side, so no mail is sent
    await page.getByRole('button', { name: 'Anmeldung absenden' }).click()
    await expect(page.locator('#aufnahme-errors')).toBeFocused()

    expect(await scan(page)).toEqual([])
  })

  test('the confirmation page has no WCAG AA violations', async ({ page }) => {
    await page.goto('/aufnahme/formular/danke')
    await expect(
      page.getByRole('heading', {
        name: 'Danke, wir haben Ihre Anmeldung erhalten',
      }),
    ).toBeVisible()

    expect(await scan(page)).toEqual([])
  })
})
