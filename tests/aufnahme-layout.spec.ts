import { test, expect, type Locator } from '@playwright/test'

async function box(locator: Locator) {
  const result = await locator.boundingBox()
  if (!result) throw new Error('expected the element to be visible')
  return result
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

  test.describe('on a phone', () => {
    test.use({ viewport: { width: 375, height: 812 } })

    test('keeps PLZ and Ort aligned with their errors on a row of their own', async ({
      page,
    }) => {
      await page.goto('/aufnahme/formular')
      await page.getByRole('button', { name: 'Anmeldung absenden' }).click()

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
  })
})
