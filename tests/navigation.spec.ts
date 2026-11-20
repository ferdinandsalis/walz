import { expect, type Page, test } from '@playwright/test'

async function open(page: Page, path: string) {
  await page.goto(path)
  // The menu only works once React has hydrated the page
  await page.waitForFunction(() => '__reactRouterDataRouter' in window)
}

const menuButton = (page: Page) => page.getByRole('button', { name: 'Menü' })
const pageTitle = (page: Page) => page.getByRole('heading', { level: 1 })

test.describe('phone menu', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('opens over the page without moving it', async ({ page }) => {
    await open(page, '/kontakt')
    const before = await pageTitle(page).boundingBox()

    await menuButton(page).click()

    await expect(
      page.getByRole('link', { name: 'Aktuelles' }).first(),
    ).toBeVisible()
    const after = await pageTitle(page).boundingBox()
    expect(after!.y).toBe(before!.y)
  })

  test('closes when a page is chosen', async ({ page }) => {
    await open(page, '/kontakt')
    await menuButton(page).click()

    await page
      .getByRole('navigation', { name: 'Global' })
      .getByRole('link', { name: 'Curriculum' })
      .click()

    await expect(page).toHaveURL(/\/curriculum$/)
    await expect(menuButton(page)).toHaveAttribute('aria-expanded', 'false')
  })

  test('closes on a tap outside', async ({ page }) => {
    await open(page, '/ueber-uns')
    await menuButton(page).click()

    // Plain text, below the open menu
    await page.getByText('Der Unterricht orientiert sich').click()

    await expect(menuButton(page)).toHaveAttribute('aria-expanded', 'false')
  })

  test('closes on Escape and gives focus back to the button', async ({
    page,
  }) => {
    await open(page, '/kontakt')
    await menuButton(page).click()

    await page.keyboard.press('Escape')

    await expect(menuButton(page)).toHaveAttribute('aria-expanded', 'false')
    await expect(menuButton(page)).toBeFocused()
  })
})

test('the logo is the keyboard-reachable link home', async ({ page }) => {
  await open(page, '/kontakt')

  const home = page.getByRole('link', { name: 'Walz Startseite' })
  await page.keyboard.press('Tab')
  await expect(home).toBeFocused()

  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/$/)
})

test('the navigation lists the five sections without a home entry', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await open(page, '/kontakt')

  const links = page
    .getByRole('navigation', { name: 'Global' })
    .getByRole('link')
  await expect(links).toHaveText([
    'Aktuelles',
    'Über uns',
    'Curriculum',
    'Aufnahme',
    'Alumni',
  ])
})
