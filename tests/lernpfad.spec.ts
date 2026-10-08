import { test, expect, type Locator, type Page } from '@playwright/test'
import { fillParent1, gotoHydratedForm, textLeft } from './aufnahme-helpers.ts'

test('the newsletter field keeps 16px and shows a visible focus outline', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  const field = page.locator('input[name="email"]')
  await field.scrollIntoViewIfNeeded()

  await expect(field).toHaveCSS('font-size', '16px')
  const before = await field.boundingBox()

  // Reach the field by keyboard so :focus-visible applies.
  const isFocused = () =>
    field.evaluate(element => element === document.activeElement)
  for (let presses = 0; presses < 100 && !(await isFocused()); presses++) {
    await page.keyboard.press('Tab')
  }

  await expect(field).toBeFocused()
  await expect(field).toHaveCSS('outline-style', 'solid')
  await expect(field).toHaveCSS('outline-width', '2px')
  const after = await field.boundingBox()
  expect(after?.height).toBe(before?.height)
})

function sectionMap(page: Page) {
  return page.getByRole('navigation', { name: 'Abschnitte' })
}

// The map sits in the site's right column, clear of the form.
async function expectMapBesideForm(page: Page) {
  const map = sectionMap(page)
  await expect(map).toBeVisible()
  const mapBox = await map.boundingBox()
  const formBox = await page.locator('#abschnitt-1').boundingBox()
  expect(mapBox!.x).toBeGreaterThanOrEqual(formBox!.x + formBox!.width)
}

test('shows the section map beside the form on wide screens', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/aufnahme/formular')
  await expectMapBesideForm(page)

  await sectionMap(page).getByRole('link', { name: 'Jugendliche:r' }).click()

  await expect(page.locator('#abschnitt-2')).toBeInViewport()
  // The section lands 24px below the top edge, so its node is not clipped
  await expect
    .poll(() =>
      page
        .locator('#abschnitt-2')
        .evaluate(element => Math.round(element.getBoundingClientRect().top)),
    )
    .toBe(24)
})

test('shows the section map beside the form on a small laptop', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 768 })
  await page.goto('/aufnahme/formular')
  await expectMapBesideForm(page)
})

test('hides the section map on phones', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/aufnahme/formular')

  await expect(
    page.getByRole('heading', { name: 'Anmeldung für die Walz' }),
  ).toBeVisible()
  await expect(
    page.getByRole('list', { name: 'Aufnahmeprozess' }),
  ).toBeVisible()
  await expect(sectionMap(page)).toBeHidden()
})

test("mirrors the form's section state", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await gotoHydratedForm(page)
  const firstNode = sectionMap(page).locator('[data-node-state]').first()
  await expect(firstNode).toHaveAttribute('data-node-state', 'open')

  await fillParent1(page)

  await expect(firstNode).toHaveAttribute('data-node-state', 'done')
})

test('draws the first segment fully under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/aufnahme/formular/danke')

  const segment = page
    .getByRole('list', { name: 'So geht es weiter' })
    .locator('.origin-top')
  await expect(segment).toHaveCount(1)
  await expect(segment).toHaveCSS('transform', 'none')
})

test('shows the steps path above the prose and both notices on /aufnahme', async ({
  page,
}) => {
  await page.goto('/aufnahme')

  const steps = page
    .locator('#vorgehensweise')
    .getByRole('list', { name: 'Aufnahmeprozess' })
  await expect(steps.getByRole('listitem')).toHaveText([
    'Anmeldung absenden',
    'Anruf von der Walz',
    'Aufnahmegespräch',
    'Zu- oder Absage',
  ])
  // An overview at a glance, above the prose that tells the steps in full
  const prose = page.getByText(
    'Wenn du dich an der Walz bewerben willst, fülle bitte das Anmeldeformular aus.',
  )
  const stepsFirst = await steps.evaluate(
    (list, paragraph) =>
      Boolean(
        list.compareDocumentPosition(paragraph!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
      ),
    await prose.elementHandle(),
  )
  expect(stepsFirst).toBe(true)

  // "Aufnahmetermin" also appears in the prose, so match the exact text.
  for (const title of ['Aufnahmetermin', 'Plätze frei']) {
    await expect(
      page
        .locator('.bg-secondary-50')
        .filter({ has: page.getByText(title, { exact: true }) }),
    ).toHaveCount(1)
  }

  // The form CTA stays inside the "Aufnahmetermin" notice.
  await page
    .locator('.bg-secondary-50')
    .filter({
      has: page.getByRole('heading', { name: 'Aufnahmetermin', exact: true }),
    })
    .getByRole('link', { name: 'Zum Anmeldeformular' })
    .click()
  await expect(page).toHaveURL('/aufnahme/formular')
})

// The root clips sideways overflow (`overflow-x-hidden` on <html>), so the
// scroll width alone could miss a box running off the screen; every box's
// right edge is checked as well.
async function boxesPastTheRightEdge(page: Page) {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth
    return Array.from(document.body.querySelectorAll('*'))
      .filter(element => element.getBoundingClientRect().right > width + 0.5)
      .map(
        element =>
          `${element.tagName.toLowerCase()} ${element.getAttribute('class') ?? ''}`,
      )
  })
}

test.describe('on a narrow phone', () => {
  test.use({ viewport: { width: 320, height: 640 } })

  // The form is checked with every reveal open: the further guardian's
  // section and the applicant's own address.
  async function openEveryReveal(page: Page) {
    await page.getByText('Weitere erziehungsberechtigte Person angeben').click()
    await page.locator('#studentSameAddress').uncheck()
    await expect(page.locator('#parent2Street')).toBeVisible()
    await expect(page.locator('#studentStreet')).toBeVisible()
  }

  for (const [path, stepsName, prepare] of [
    ['/aufnahme/formular', 'Aufnahmeprozess', openEveryReveal],
    ['/aufnahme/formular/danke', 'So geht es weiter', undefined],
    ['/aufnahme', 'Aufnahmeprozess', undefined],
  ] as const) {
    test(`does not scroll sideways at 320px on ${path}`, async ({ page }) => {
      await page.goto(path)
      await page.evaluate(() => document.fonts.ready)

      await expect(page.getByRole('list', { name: stepsName })).toBeVisible()
      await prepare?.(page)
      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
      )
      expect(scrollWidth).toBeLessThanOrEqual(320)
      expect(await boxesPastTheRightEdge(page)).toEqual([])
    })
  }
})

// From xl (1160px) the path hangs in the left margin, so its text shares one
// left edge with the page heading. Narrower screens have no margin to hang
// in, so the path keeps its indent there.
test.describe('the hanging path', () => {
  async function expectOnTheHeadingEdge(text: Locator, heading: Locator) {
    expect(
      Math.abs((await textLeft(text)) - (await textLeft(heading))),
    ).toBeLessThanOrEqual(1)
  }

  async function expectEveryStepOnTheHeadingEdge(
    page: Page,
    stepsName: string,
    heading: Locator,
  ) {
    const steps = page
      .getByRole('list', { name: stepsName })
      .getByRole('listitem')
    await expect(steps).toHaveCount(4)
    for (const step of await steps.all()) {
      await expectOnTheHeadingEdge(step, heading)
    }
  }

  test.describe('on a wide screen', () => {
    test.use({ viewport: { width: 1280, height: 900 } })

    test('lines the form up with its heading, the nodes in the margin', async ({
      page,
    }) => {
      await page.goto('/aufnahme/formular')
      const heading = page.getByRole('heading', {
        level: 1,
        name: 'Anmeldung für die Walz',
      })

      await expectOnTheHeadingEdge(
        page.locator('#abschnitt-1 legend h2'),
        heading,
      )
      await expectOnTheHeadingEdge(
        page.locator('label[for=parent1Name]'),
        heading,
      )
      await expectEveryStepOnTheHeadingEdge(page, 'Aufnahmeprozess', heading)

      const node = page.locator('#abschnitt-1 [data-node-state]')
      const nodeBox = (await node.boundingBox())!
      expect(nodeBox.x + nodeBox.width).toBeLessThanOrEqual(
        await textLeft(heading),
      )
      // ... and clear of the site navigation in the column beside it
      const navigationRight = await page.locator('header').evaluate(header =>
        Math.max(
          ...Array.from(header.querySelectorAll('a, button'))
            .map(element => element.getBoundingClientRect())
            .filter(box => box.width > 0)
            .map(box => box.right),
        ),
      )
      expect(nodeBox.x).toBeGreaterThan(navigationRight)
    })

    test('lines the steps up with the heading on the confirmation page', async ({
      page,
    }) => {
      await page.goto('/aufnahme/formular/danke')

      await expectEveryStepOnTheHeadingEdge(
        page,
        'So geht es weiter',
        page.getByRole('heading', {
          level: 1,
          name: 'Danke, wir haben Ihre Anmeldung erhalten',
        }),
      )
    })

    test('lines the steps up with the heading on /aufnahme', async ({
      page,
    }) => {
      await page.goto('/aufnahme')

      await expectEveryStepOnTheHeadingEdge(
        page,
        'Aufnahmeprozess',
        page.getByRole('heading', { level: 1, name: 'Vorgehensweise' }),
      )
    })
  })

  for (const viewport of [
    { width: 1024, height: 768 },
    { width: 375, height: 812 },
  ]) {
    test(`keeps the form indented from its heading at ${viewport.width}px`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport)
      await page.goto('/aufnahme/formular')
      const headingLeft = await textLeft(
        page.getByRole('heading', { level: 1, name: 'Anmeldung für die Walz' }),
      )

      expect(
        await textLeft(page.locator('#abschnitt-1 legend h2')),
      ).toBeGreaterThan(headingLeft)
    })
  }
})
