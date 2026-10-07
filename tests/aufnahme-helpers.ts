import { type Page } from '@playwright/test'

// Fills section 1, "Ihre Angaben"; the country is already set.
export async function fillParent1(page: Page) {
  await page.locator('#parent1Name').fill('Anna Testfrau')
  await page.locator('#parent1Email').fill('delivered+anna@resend.dev')
  await page.locator('#parent1Phone').fill('+43 660 1234567')
  await page.locator('#parent1Street').fill('Teststraße 1/2/3')
  await page.locator('#parent1PostalCode').fill('1010')
  await page.locator('#parent1City').fill('Wien')
}

// The client-side checks and the submit guard need React on the page. React
// Router sets this global in createHydratedRouter (react-router/dom, verified
// against 7.18.4), so it marks that hydration has started, not that every
// event handler is committed yet.
export async function gotoHydratedForm(page: Page) {
  await page.goto('/aufnahme/formular')
  await page.waitForFunction(() => '__reactRouterDataRouter' in window)
}
