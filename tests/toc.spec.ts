import { expect, type Page, test } from '@playwright/test'

async function open(page: Page, path: string) {
  await page.goto(path)
  // Scroll tracking only starts once React has hydrated the page
  await page.waitForFunction(() => '__reactRouterDataRouter' in window)
}

const tocNav = (page: Page) =>
  page.getByRole('navigation', { name: 'Auf dieser Seite' })
const pill = (page: Page) => page.getByRole('button', { name: /Inhalt/ })

test.describe('at phone width', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('the list sits under the title', async ({ page }) => {
    await open(page, '/ueber-uns')

    const title = await page
      .getByRole('heading', { level: 1, name: 'Über uns' })
      .boundingBox()
    const list = await tocNav(page).boundingBox()
    const intro = await page
      .getByText('Die Walz bietet fünf Jahrgängen')
      .boundingBox()
    expect(list!.y).toBeGreaterThan(title!.y + title!.height - 1)
    expect(list!.y + list!.height).toBeLessThan(intro!.y)
  })

  test('the button follows the reader and jumps to a section', async ({
    page,
  }) => {
    await open(page, '/ueber-uns')
    await expect(pill(page)).not.toBeInViewport()

    await page
      .getByRole('heading', { name: 'Philosophie', exact: true })
      .scrollIntoViewIfNeeded()
    await page.mouse.wheel(0, 200)
    await expect(pill(page)).toBeInViewport()
    await expect(pill(page)).toContainText('Philosophie')

    await pill(page).click()
    await page
      .locator(`#${await pill(page).getAttribute('aria-controls')}`)
      .getByRole('link', { name: 'Geschichte' })
      .click()

    await expect(
      page.getByRole('heading', { name: 'Geschichte', exact: true }),
    ).toBeInViewport()
    await expect(pill(page)).toContainText('Geschichte')
  })
})

test('the button fits a narrow phone with the longest section name', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 })
  await open(page, '/alumni')
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect(pill(page)).toContainText('Ehemalige Jahrgänge')

  // The button is fixed, so it never widens the page; it has to stay on screen
  const box = await pill(page).boundingBox()
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(320)
  const name = pill(page).getByText('Ehemalige Jahrgänge')
  await expect(name).toHaveCSS('text-overflow', 'ellipsis')
  await expect(name).toHaveCSS('overflow', 'hidden')
  const pageWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  )
  expect(pageWidth).toBeLessThanOrEqual(320)
})

test.describe('at desktop width', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('the right column marks the section in view', async ({ page }) => {
    await open(page, '/ueber-uns')
    await expect(tocNav(page)).toHaveCount(1)
    await expect(pill(page)).not.toBeVisible()
    const rail = tocNav(page)
    await expect(rail.getByRole('link', { name: 'Menschen' })).toHaveAttribute(
      'aria-current',
      'location',
    )

    await page.evaluate(() =>
      document.getElementById('leitbild')!.scrollIntoView(),
    )

    await expect(rail.getByRole('link', { name: 'Leitbild' })).toHaveAttribute(
      'aria-current',
      'location',
    )
  })

  test('opening a section link marks that section', async ({ page }) => {
    await open(page, '/ueber-uns#leitbild')

    await expect(
      tocNav(page).getByRole('link', { name: 'Leitbild' }),
    ).toHaveAttribute('aria-current', 'location')
  })

  for (const path of ['/aktuelles', '/aufnahme', '/alumni', '/ueber-uns']) {
    test(`${path} links only to sections on the page`, async ({ page }) => {
      await open(page, path)

      const targets = await tocNav(page)
        .getByRole('link')
        .evaluateAll(links => links.map(link => link.getAttribute('href')))
      const sectionLinks = targets.filter(href => href !== '#')
      expect(sectionLinks.length).toBeGreaterThan(1)
      for (const href of sectionLinks) {
        await expect(page.locator(href!)).toHaveCount(1)
      }
    })
  }
})
