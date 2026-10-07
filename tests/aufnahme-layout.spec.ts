import { test, expect, type Locator } from '@playwright/test'
import { expectFocusOutline, gotoHydratedForm } from './aufnahme-helpers.ts'

async function box(locator: Locator) {
  const result = await locator.boundingBox()
  if (!result) throw new Error('expected the element to be visible')
  return result
}

// A thumb-sized target: at least 44px high, and the label itself takes a tap
// anywhere in that height, not a neighbour that overlaps it.
async function expectTouchTarget(label: Locator) {
  // elementFromPoint only sees the viewport
  await label.scrollIntoViewIfNeeded()
  const { x, y, width, height } = await box(label)
  expect(height).toBeGreaterThanOrEqual(44)
  for (const pointY of [y + 1, y + height - 1]) {
    const hit = await label
      .page()
      .evaluate(
        ([pointX, pointY]) =>
          document.elementFromPoint(pointX!, pointY!)?.closest('label')
            ?.textContent ?? null,
        [x + width / 2, pointY],
      )
    expect(hit).toBe(await label.textContent())
  }
}

// The box shadows that draw something: a shadow with no offset, blur or
// spread is invisible whatever its colour.
async function visibleShadows(locator: Locator) {
  const boxShadow = await locator.evaluate(
    element => getComputedStyle(element).boxShadow,
  )
  return boxShadow
    .split(/,(?![^(]*\))/)
    .map(shadow => shadow.trim())
    .filter(shadow => /[1-9]/.test(shadow.replace(/\([^)]*\)/g, '')))
}

function fontSize(locator: Locator) {
  return locator.evaluate(element => getComputedStyle(element).fontSize)
}

test.describe('Aufnahme layout', () => {
  test('sets the date part labels like every other label', async ({ page }) => {
    await page.goto('/aufnahme/formular')

    const fieldLabel = await fontSize(page.locator('label[for=parent1Name]'))
    for (const id of [
      'studentBirthDay',
      'studentBirthMonth',
      'studentBirthYear',
    ]) {
      expect(await fontSize(page.locator(`label[for=${id}]`))).toBe(fieldLabel)
    }
  })

  test('outlines the privacy link and the submit button on keyboard focus', async ({
    page,
  }) => {
    await page.goto('/aufnahme/formular')

    await page.locator('#source').focus()
    await page.keyboard.press('Tab')
    await expectFocusOutline(
      page.getByRole('link', { name: 'Datenschutzerklärung' }),
    )

    await page.keyboard.press('Tab')
    const submit = page.getByRole('button', { name: 'Anmeldung absenden' })
    await expectFocusOutline(submit)
    // The outline is the only focus mark: the button keeps its resting look
    // instead of adding its own focus ring
    const focusedShadows = await visibleShadows(submit)
    await submit.blur()
    expect(focusedShadows).toEqual(await visibleShadows(submit))
  })

  test('outlines the error summary and its links on keyboard focus', async ({
    page,
  }) => {
    await gotoHydratedForm(page)

    await page.getByRole('button', { name: 'Anmeldung absenden' }).focus()
    await page.keyboard.press('Enter')
    const summary = page.locator('#aufnahme-errors')
    await expectFocusOutline(summary)

    await page.keyboard.press('Tab')
    await expectFocusOutline(
      summary.getByRole('link', {
        name: 'Geben Sie Ihren Vor- und Nachnamen ein',
      }),
    )
  })

  test('outlines the further guardian toggle on keyboard focus', async ({
    page,
  }) => {
    await page.goto('/aufnahme/formular')

    await page.locator('#schoolHistory').focus()
    await page.keyboard.press('Tab')
    await expectFocusOutline(
      page.locator('summary', {
        hasText: 'Weitere erziehungsberechtigte Person angeben',
      }),
    )
  })

  test('outlines the section map links on keyboard focus', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/aufnahme/formular')

    await page.getByRole('button', { name: 'Anmeldung absenden' }).focus()
    await page.keyboard.press('Tab')
    await expectFocusOutline(
      page
        .getByRole('navigation', { name: 'Abschnitte' })
        .getByRole('link', { name: 'Ihre Angaben' }),
    )
  })

  // At 20px bold the white label counts as large text, which passes 3:1 on
  // the orange.
  test('renders the submit label at 20px bold', async ({ page }) => {
    await page.goto('/aufnahme/formular')

    const label = await page
      .getByRole('button', { name: 'Anmeldung absenden' })
      .evaluate(element => {
        const style = getComputedStyle(element)
        return { size: style.fontSize, weight: Number(style.fontWeight) }
      })
    expect(label.size).toBe('20px')
    expect(label.weight).toBeGreaterThanOrEqual(700)
  })

  test('outlines the links on the confirmation page on keyboard focus', async ({
    page,
  }) => {
    await page.goto('/aufnahme/formular/danke')
    // The heading takes focus once the page is hydrated
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Danke, wir haben Ihre Anmeldung erhalten',
      }),
    ).toBeFocused()

    await page.keyboard.press('Tab')
    await expectFocusOutline(page.getByRole('link', { name: 'office@walz.at' }))
    await page.keyboard.press('Tab')
    await expectFocusOutline(
      page.getByRole('link', { name: 'agnes.chorherr@walz.at' }),
    )
    await page.keyboard.press('Tab')
    await expectFocusOutline(
      page.getByRole('link', { name: 'Zurück zur Aufnahme' }),
    )
  })

  test.describe('on a phone', () => {
    test.use({ viewport: { width: 375, height: 812 } })

    test('keeps PLZ and Ort aligned with their errors on a row of their own', async ({
      page,
    }) => {
      await page.goto('/aufnahme/formular')
      await page.getByRole('button', { name: 'Anmeldung absenden' }).click()
      // Focusing the summary scrolls the page; the boxes below are measured
      // one by one, so they must all be taken after that scroll
      await expect(page.locator('#aufnahme-errors')).toBeFocused()

      const postalCodeError = page.locator('#parent1PostalCode-error')
      await expect(postalCodeError).toBeVisible()
      await expect(page.locator('#parent1City-error')).toBeVisible()
      await expect(page.locator('#parent1PostalCode')).toHaveAttribute(
        'aria-describedby',
        'parent1PostalCode-error',
      )
      await expect(page.locator('#parent1City')).toHaveAttribute(
        'aria-describedby',
        'parent1City-error',
      )

      const postalCodeLabel = await box(
        page.locator('label[for=parent1PostalCode]'),
      )
      const cityLabel = await box(page.locator('label[for=parent1City]'))
      const postalCode = await box(page.locator('#parent1PostalCode'))
      const city = await box(page.locator('#parent1City'))
      expect(postalCodeLabel.y).toBe(cityLabel.y)
      expect(postalCode.y).toBe(city.y)
      // The error spans both columns, so it does not wrap in the narrow one
      const error = await box(postalCodeError)
      expect(error.width).toBeGreaterThanOrEqual(
        city.x + city.width - postalCode.x,
      )
      expect(error.y).toBeGreaterThan(postalCodeLabel.y)
      expect(error.y).toBeLessThan(postalCode.y)
    })

    test('lines the section titles up with the field labels', async ({
      page,
    }) => {
      await page.goto('/aufnahme/formular')

      // The text itself, not its box: the box may start under the node
      const titleLeft = await page
        .locator('#abschnitt-1 legend h2')
        .evaluate(heading => {
          const walker = document.createTreeWalker(
            heading,
            NodeFilter.SHOW_TEXT,
          )
          while (walker.nextNode()) {
            const text = walker.currentNode
            if (text.parentElement?.closest('[aria-hidden="true"]')) continue
            const range = document.createRange()
            range.selectNodeContents(text)
            return range.getBoundingClientRect().left
          }
          throw new Error('expected the title text')
        })
      const label = await box(page.locator('label[for=parent1Name]'))
      expect(Math.abs(titleLeft - label.x)).toBeLessThanOrEqual(1)
    })

    test('gives the checkbox a thumb-sized target', async ({ page }) => {
      await page.goto('/aufnahme/formular')

      await expectTouchTarget(
        page
          .locator('label')
          .filter({ has: page.locator('#studentSameAddress') }),
      )
    })
  })

  test.describe('on a phone below the browser bars', () => {
    // iOS Safari leaves about 635px of a 375 × 812 screen below its bars
    test.use({ viewport: { width: 375, height: 635 } })

    test('shows the first input whole on the first screen', async ({
      page,
    }) => {
      await page.goto('/aufnahme/formular')
      await page.evaluate(() => document.fonts.ready)

      const firstInput = await box(page.locator('#parent1Name'))
      expect(firstInput.y + firstInput.height).toBeLessThanOrEqual(635)
    })
  })
})
