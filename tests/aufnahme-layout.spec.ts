import { test, expect, type Locator } from '@playwright/test'

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
})
