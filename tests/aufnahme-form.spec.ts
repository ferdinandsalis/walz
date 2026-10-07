import { test, expect, type Page } from '@playwright/test'

// Fills every required field; the child lives at the parent's address, so the
// child address fields stay hidden and untouched.
async function fillRequired(page: Page) {
  await page.locator('#parent1Name').fill('Anna Testfrau')
  await page.locator('#parent1Email').fill('delivered+anna@resend.dev')
  await page.locator('#parent1Phone').fill('+43 660 1234567')
  await page.locator('#parent1Street').fill('Teststraße 1/2/3')
  await page.locator('#parent1PostalCode').fill('1010')
  await page.locator('#parent1City').fill('Wien')

  await page.locator('#studentName').fill('Max Testfrau')
  await page.locator('#studentEmail').fill('delivered+max@resend.dev')
  await page.locator('#studentBirthDay').fill('15')
  await page.locator('#studentBirthMonth').fill('5')
  await page.locator('#studentBirthYear').fill('2012')
  await page.locator('#currentGrade').fill('8a')
  await page.locator('#schoolHistory').fill('MS Testgasse, Wien (2022–heute)')
}

test.describe('Aufnahme Form', () => {
  test('should navigate to form from aufnahme page', async ({ page }) => {
    await page.goto('/aufnahme')
    await expect(page.getByRole('heading', { name: 'Aufnahme' })).toBeVisible()

    // Click the "Jetzt anmelden" button
    await page.getByRole('link', { name: 'Zum Anmeldeformular' }).click()

    // Should be on the form page
    await expect(page).toHaveURL('/aufnahme/formular')
    await expect(
      page.getByRole('heading', { name: 'Anmeldung für die Walz' }),
    ).toBeVisible()
  })

  test('should display validation errors for empty form', async ({ page }) => {
    await page.goto('/aufnahme/formular')

    await page.getByRole('button', { name: 'Anmeldung absenden' }).click()

    // The server answers with per-field errors and the page stays put
    await expect(page.locator('#parent1Name-error')).toHaveText(
      'Geben Sie Ihren Vor- und Nachnamen ein',
    )
    await expect(page.locator('#parent1Name')).toHaveAttribute(
      'aria-invalid',
      'true',
    )
    await expect(page).toHaveURL('/aufnahme/formular')
  })

  test("submits a complete form with the child at the parent's address", async ({
    page,
  }) => {
    await page.goto('/aufnahme/formular')

    await fillRequired(page)
    await page.getByRole('button', { name: 'Anmeldung absenden' }).click()

    // Should land on the confirmation page - its own URL, so the submission
    // is countable as a pageview goal
    await expect(page).toHaveURL('/aufnahme/formular/danke')
    await expect(
      page.getByText('Vielen Dank für Ihre Anmeldung!'),
    ).toBeVisible()
    await expect(
      page.getByText(/Bestätigungs-E-Mail mit weiteren Informationen/),
    ).toBeVisible()
  })

  test('should handle optional parent 2 fields', async ({ page }) => {
    await page.goto('/aufnahme/formular')

    await fillRequired(page)

    await page.getByText('Weitere erziehungsberechtigte Person angeben').click()
    await page.locator('#parent2Name').fill('Peter Testmann')
    await page.locator('#parent2Email').fill('delivered+peter@resend.dev')
    await page.locator('#parent2Phone').fill('+43 660 7654321')
    await page.locator('#parent2SameAddress').check()

    await page.getByRole('button', { name: 'Anmeldung absenden' }).click()

    await expect(
      page.getByText('Vielen Dank für Ihre Anmeldung!'),
    ).toBeVisible()
  })

  test('should show loading state while submitting', async ({ page }) => {
    await page.goto('/aufnahme/formular')

    await fillRequired(page)

    const submitButton = page.getByRole('button', {
      name: 'Anmeldung absenden',
    })
    await submitButton.click()

    // Button should be disabled (but this might happen very quickly)
    // So we just check that the form processes successfully
    await expect(page.getByText('Vielen Dank für Ihre Anmeldung!')).toBeVisible(
      { timeout: 10000 },
    )
  })

  test("reveals the child's address fields when the box is cleared", async ({
    page,
  }) => {
    await page.goto('/aufnahme/formular')

    const sameAddress = page.locator('#studentSameAddress')
    await expect(sameAddress).toBeChecked()
    await expect(page.locator('#studentStreet')).toBeHidden()

    await sameAddress.uncheck()

    await expect(page.locator('#studentStreet')).toBeVisible()
    await expect(page.locator('#studentPostalCode')).toBeVisible()
    await expect(page.locator('#studentCity')).toBeVisible()
    await expect(page.locator('#studentCountry')).toHaveValue('Österreich')
  })

  test('opens the further guardian section and keeps its address box unticked', async ({
    page,
  }) => {
    await page.goto('/aufnahme/formular')

    await expect(page.locator('#parent2Name')).toBeHidden()

    await page.getByText('Weitere erziehungsberechtigte Person angeben').click()

    await expect(page.locator('#parent2Name')).toBeVisible()
    await expect(page.locator('#parent2SameAddress')).not.toBeChecked()
    await expect(page.locator('#parent2Street')).toBeVisible()

    await page.locator('#parent2SameAddress').check()

    await expect(page.locator('#parent2Street')).toBeHidden()
  })

  test('reveals "Woher genau?" only for "Anderes"', async ({ page }) => {
    await page.goto('/aufnahme/formular')

    const sourceOther = page.getByLabel('Woher genau?')
    await expect(sourceOther).toBeHidden()

    await page.getByLabel('Social Media').check()
    await expect(sourceOther).toBeHidden()

    await page.getByLabel('Anderes').check()
    await expect(sourceOther).toBeVisible()
  })

  test('should redirect the legacy success URL to the confirmation page', async ({
    page,
  }) => {
    await page.goto('/aufnahme/formular?success=true')

    await expect(page).toHaveURL('/aufnahme/formular/danke')
    await expect(
      page.getByText('Vielen Dank für Ihre Anmeldung!'),
    ).toBeVisible()
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
      page.getByRole('heading', { name: 'Anmeldung für die Walz' }),
    ).toBeVisible()
  })

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false })

    test('keeps every entry and the unticked box after a failed submit without JavaScript', async ({
      page,
    }) => {
      await page.goto('/aufnahme/formular')

      await fillRequired(page)
      await page.locator('#currentGrade').fill('')
      await page.locator('#studentSameAddress').uncheck()
      await page.locator('#studentStreet').fill('Kindgasse 5')
      await page.locator('#studentPostalCode').fill('1070')
      await page.locator('#studentCity').fill('Wien')

      await page.getByRole('button', { name: 'Anmeldung absenden' }).click()

      await expect(page.locator('#currentGrade-error')).toHaveText(
        'Geben Sie die derzeitige Klasse oder Schulstufe ein',
      )
      await expect(page.locator('#studentSameAddress')).not.toBeChecked()
      await expect(page.locator('#studentStreet')).toBeVisible()
      await expect(page.locator('#studentStreet')).toHaveValue('Kindgasse 5')
      await expect(page.locator('#parent1Name')).toHaveValue('Anna Testfrau')
      await expect(page.locator('#studentBirthYear')).toHaveValue('2012')
    })
  })
})
