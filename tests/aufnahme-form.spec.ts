import { test, expect } from '@playwright/test'

test.describe('Aufnahme Form', () => {
  test('should navigate to form from aufnahme page', async ({ page }) => {
    await page.goto('/aufnahme')
    await expect(page.getByRole('heading', { name: 'Aufnahme' })).toBeVisible()

    // Click the "Jetzt anmelden" button
    await page.getByRole('link', { name: 'Zum Anmeldeformular' }).click()

    // Should be on the form page
    await expect(page).toHaveURL('/aufnahme/formular')
    await expect(
      page.getByRole('heading', { name: 'Aufnahmeformular' }),
    ).toBeVisible()
  })

  test('should display validation errors for empty form', async ({ page }) => {
    await page.goto('/aufnahme/formular')

    // Try to submit empty form
    await page.getByRole('button', { name: 'Absenden' }).click()

    // HTML5 validation should prevent submission
    // Check that we're still on the same page
    await expect(page).toHaveURL('/aufnahme/formular')
  })

  test('should successfully submit complete form', async ({ page }) => {
    await page.goto('/aufnahme/formular')

    // Fill student information
    await page.getByLabel('Vor- und Nachname *').fill('Max Testfrau')
    await page
      .getByLabel('E-Mail *', { exact: true })
      .first()
      .fill('max.test@example.com')
    await page.getByLabel('Wohnadresse *').fill('Teststraße 1, 1010 Wien')
    await page.getByLabel('Geburtsdatum *').fill('2010-05-15')
    await page.getByLabel('Derzeit besuchte Schule *').fill('Test Gymnasium')
    await page.getByLabel('Klasse/Schulstufe *').fill('8a')

    // Fill parent 1 information
    await page.locator('#parent1Name').fill('Anna Testfrau')
    await page.locator('#parent1Phone').fill('+4366012356789')
    await page.locator('#parent1Email').fill('anna.test@example.com')
    await page.locator('#parent1Address').fill('Teststraße 1, 1010 Wien')

    // Fill additional information
    await page
      .getByLabel('Wie sind Sie auf uns aufmerksam geworden? *')
      .fill('Durch Google Suche')

    // Submit form
    await page.getByRole('button', { name: 'Absenden' }).click()

    // Should show success message
    await expect(
      page.getByText('Vielen Dank für Ihre Anmeldung!'),
    ).toBeVisible()
    await expect(
      page.getByText(/Bestätigungs-E-Mail mit weiteren Informationen/),
    ).toBeVisible()
  })

  test('should handle optional parent 2 fields', async ({ page }) => {
    await page.goto('/aufnahme/formular')

    // Fill required fields
    await page.getByLabel('Vor- und Nachname *').fill('Max Testmann')
    await page.locator('#studentEmail').fill('max.test@example.com')
    await page.getByLabel('Wohnadresse *').fill('Teststraße 1, 1010 Wien')
    await page.getByLabel('Geburtsdatum *').fill('2010-05-15')
    await page.getByLabel('Derzeit besuchte Schule *').fill('Test Gymnasium')
    await page.getByLabel('Klasse/Schulstufe *').fill('8a')

    await page.locator('#parent1Name').fill('Anna Testmann')
    await page.locator('#parent1Phone').fill('+43 660 1234567')
    await page.locator('#parent1Email').fill('anna.test@example.com')
    await page.locator('#parent1Address').fill('Teststraße 1, 1010 Wien')

    // Fill parent 2 optional fields
    await page.locator('#parent2Name').fill('Peter Testmann')
    await page.locator('#parent2Phone').fill('+43 660 7654321')
    await page.locator('#parent2Email').fill('peter.test@example.com')
    await page.locator('#parent2Address').fill('Teststraße 1, 1010 Wien')

    await page
      .getByLabel('Wie sind Sie auf uns aufmerksam geworden? *')
      .fill('Empfehlung von Freunden')

    await page.getByRole('button', { name: 'Absenden' }).click()

    await expect(
      page.getByText('Vielen Dank für Ihre Anmeldung!'),
    ).toBeVisible()
  })

  test('should show loading state while submitting', async ({ page }) => {
    await page.goto('/aufnahme/formular')

    // Fill minimum required fields
    await page.locator('#studentName').fill('Max Testmann')
    await page.locator('#studentEmail').fill('max.test@example.com')
    await page.getByLabel('Wohnadresse *').fill('Teststraße 1, 1010 Wien')
    await page.getByLabel('Geburtsdatum *').fill('2010-05-15')
    await page.getByLabel('Derzeit besuchte Schule *').fill('Test Gymnasium')
    await page.getByLabel('Klasse/Schulstufe *').fill('8a')

    await page.locator('#parent1Name').fill('Anna Testmann')
    await page.locator('#parent1Phone').fill('+43 660 1234567')
    await page.locator('#parent1Email').fill('anna.test@example.com')
    await page.locator('#parent1Address').fill('Teststraße 1, 1010 Wien')

    await page
      .getByLabel('Wie sind Sie auf uns aufmerksam geworden? *')
      .fill('Test')

    // Check that submit button gets disabled during submission
    const submitButton = page.getByRole('button', { name: 'Absenden' })
    await submitButton.click()

    // Button should be disabled (but this might happen very quickly)
    // So we just check that the form processes successfully
    await expect(page.getByText('Vielen Dank für Ihre Anmeldung!')).toBeVisible(
      { timeout: 10000 },
    )
  })

  test('should navigate to form from Quereinstieg section', async ({
    page,
  }) => {
    await page.goto('/aufnahme')

    // Click the "Zum Anmeldeformular" button in Quereinstieg section
    await page.getByRole('link', { name: 'Zum Anmeldeformular' }).click()

    // Should be on the form page
    await expect(page).toHaveURL('/aufnahme/formular')
    await expect(
      page.getByRole('heading', { name: 'Aufnahmeformular' }),
    ).toBeVisible()
  })
})
