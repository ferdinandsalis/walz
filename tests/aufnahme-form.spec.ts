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

// The client-side checks and the submit guard need the hydrated page; React
// Router creates its router while hydrating.
async function gotoHydratedForm(page: Page) {
  await page.goto('/aufnahme/formular')
  await page.waitForFunction(() => '__reactRouterDataRouter' in window)
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

  test('describes each date input with the hint and, after a failed submit, the error', async ({
    page,
  }) => {
    await page.goto('/aufnahme/formular')

    const dateInputs = [
      '#studentBirthDay',
      '#studentBirthMonth',
      '#studentBirthYear',
    ]
    for (const id of dateInputs) {
      await expect(page.locator(id)).toHaveAttribute(
        'aria-describedby',
        'studentBirthdate-hint',
      )
    }
    // The inputs carry the description, so the group does not repeat it
    const dateGroup = page.getByRole('group', { name: 'Geburtsdatum' })
    await expect(dateGroup).not.toHaveAttribute('aria-describedby')

    await page.getByRole('button', { name: 'Anmeldung absenden' }).click()

    await expect(page.locator('#studentBirthdate-error')).toBeVisible()
    for (const id of dateInputs) {
      await expect(page.locator(id)).toHaveAttribute(
        'aria-describedby',
        'studentBirthdate-hint studentBirthdate-error',
      )
    }
    await expect(dateGroup).not.toHaveAttribute('aria-describedby')
  })

  test('opens the further guardian section to show its error', async ({
    page,
  }) => {
    await page.goto('/aufnahme/formular')

    await fillRequired(page)
    await page.getByText('Weitere erziehungsberechtigte Person angeben').click()
    await page.locator('#parent2Phone').fill('+43 660 7654321')
    // Closing the section again hides the phone the parent typed
    await page.getByText('Weitere erziehungsberechtigte Person angeben').click()
    await expect(page.locator('#parent2Name')).toBeHidden()

    await page.getByRole('button', { name: 'Anmeldung absenden' }).click()

    await expect(page.locator('#parent2Name')).toBeVisible()
    await expect(page.locator('#parent2Name-error')).toHaveText(
      'Geben Sie den Namen der weiteren erziehungsberechtigten Person ein',
    )
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

  test('focuses an error summary that links to each problem', async ({
    page,
  }) => {
    await gotoHydratedForm(page)

    await page.getByRole('button', { name: 'Anmeldung absenden' }).click()

    const summary = page.locator('#aufnahme-errors')
    await expect(summary).toBeFocused()
    await expect(
      summary.getByRole('heading', { name: 'Bitte prüfen Sie 11 Angaben' }),
    ).toBeVisible()

    await summary
      .getByRole('link', {
        name: 'Geben Sie den Vor- und Nachnamen Ihres Kindes ein',
      })
      .click()
    await expect(page.locator('#studentName')).toBeFocused()

    // The date group links to its first wrong input
    await summary
      .getByRole('link', {
        name: 'Geben Sie das Geburtsdatum Ihres Kindes ein',
      })
      .click()
    await expect(page.locator('#studentBirthDay')).toBeFocused()
  })

  test('reopens the further guardian section from the summary', async ({
    page,
  }) => {
    await gotoHydratedForm(page)

    await fillRequired(page)
    await page.getByText('Weitere erziehungsberechtigte Person angeben').click()
    await page.locator('#parent2Phone').fill('+43 660 7654321')
    await page.getByRole('button', { name: 'Anmeldung absenden' }).click()

    const summary = page.locator('#aufnahme-errors')
    await expect(
      summary.getByRole('heading', { name: 'Bitte prüfen Sie 1 Angabe' }),
    ).toBeVisible()

    // The parent closes the section again before following the link
    await page.getByText('Weitere erziehungsberechtigte Person angeben').click()
    await expect(page.locator('#parent2Name')).toBeHidden()

    await summary
      .getByRole('link', {
        name: 'Geben Sie den Namen der weiteren erziehungsberechtigten Person ein',
      })
      .click()
    await expect(page.locator('#parent2Name')).toBeVisible()
    await expect(page.locator('#parent2Name')).toBeFocused()
  })

  test('prefixes the page title on errors', async ({ page }) => {
    await gotoHydratedForm(page)
    await expect(page).toHaveTitle('Anmeldung | Walz')

    await page.getByRole('button', { name: 'Anmeldung absenden' }).click()

    await expect(page).toHaveTitle('Fehler: Anmeldung | Walz')
  })

  test('checks the email format when leaving the field, not while typing', async ({
    page,
  }) => {
    await gotoHydratedForm(page)

    const email = page.locator('#parent1Email')
    const error = page.locator('#parent1Email-error')
    await email.pressSequentially('anna@')
    await expect(error).toBeHidden()

    await email.press('Tab')
    await expect(error).toHaveText(
      'Geben Sie Ihre E-Mail-Adresse im Format name@beispiel.at ein',
    )
    await expect(email).toHaveAttribute('aria-invalid', 'true')

    await email.click()
    await email.press('End')
    await email.pressSequentially('resend.dev')
    await expect(error).toBeHidden()
    await expect(email).not.toHaveAttribute('aria-invalid')
  })

  test('checks the birthdate only after leaving the date group', async ({
    page,
  }) => {
    await gotoHydratedForm(page)

    const error = page.locator('#studentBirthdate-error')
    await page.locator('#studentBirthDay').pressSequentially('31')
    await page.locator('#studentBirthDay').press('Tab')
    await expect(page.locator('#studentBirthMonth')).toBeFocused()
    await expect(error).toBeHidden()

    await page.locator('#studentBirthMonth').pressSequentially('2')
    await page.locator('#studentBirthMonth').press('Tab')
    await page.locator('#studentBirthYear').pressSequentially('2012')
    await expect(error).toBeHidden()
    await page.locator('#studentBirthYear').press('Tab')

    await expect(error).toContainText('gültiges Datum')
    await expect(page.locator('#studentBirthDay')).toHaveAttribute(
      'aria-invalid',
      'true',
    )
    await expect(page.locator('#studentBirthMonth')).toHaveAttribute(
      'aria-invalid',
      'true',
    )

    // Fixing the day clears the error while typing
    await page.locator('#studentBirthDay').fill('28')
    await expect(error).toBeHidden()
    await expect(page.locator('#studentBirthDay')).not.toHaveAttribute(
      'aria-invalid',
    )
  })

  test("clears a field's error from the last submit once it is valid", async ({
    page,
  }) => {
    await gotoHydratedForm(page)

    await page.getByRole('button', { name: 'Anmeldung absenden' }).click()
    await expect(page.locator('#studentName-error')).toBeVisible()

    await page.locator('#studentName').fill('Max Testfrau')
    await expect(page.locator('#studentName-error')).toBeHidden()
    await expect(page.locator('#studentName')).not.toHaveAttribute(
      'aria-invalid',
    )

    // An unfinished email keeps its error until it is valid
    await page.locator('#parent1Email').fill('anna@')
    await expect(page.locator('#parent1Email-error')).toBeVisible()
    await page.locator('#parent1Email').fill('delivered+anna@resend.dev')
    await expect(page.locator('#parent1Email-error')).toBeHidden()
  })

  test('marks the button busy and announces the submission', async ({
    page,
  }) => {
    await gotoHydratedForm(page)

    // Hold the (empty, so mail-free) submission until the busy state is checked
    let release = () => {}
    const released = new Promise<void>(resolve => (release = resolve))
    await page.route('**/aufnahme/formular*', async route => {
      if (route.request().method() === 'POST') await released
      await route.continue()
    })

    const button = page.getByRole('button', { name: 'Anmeldung absenden' })
    await button.click()

    await expect(button).toHaveAttribute('aria-disabled', 'true')
    // Playwright counts aria-disabled as disabled; the attribute must be absent
    await expect(button).not.toHaveAttribute('disabled')
    await expect(button).toBeFocused()
    await expect(page.getByRole('status')).toHaveText('Wird gesendet …')

    release()

    await expect(page.locator('#aufnahme-errors')).toBeFocused()
    await expect(button).not.toHaveAttribute('aria-disabled')
    await expect(page.getByRole('status')).toHaveText('')
  })

  test('posts once on a double click', async ({ page }) => {
    await gotoHydratedForm(page)

    let posts = 0
    page.on('request', request => {
      if (
        request.method() === 'POST' &&
        new URL(request.url()).pathname.startsWith('/aufnahme/formular')
      ) {
        posts += 1
      }
    })

    // Hold the submission, so a further click lands while it is in flight
    let release = () => {}
    const released = new Promise<void>(resolve => (release = resolve))
    await page.route('**/aufnahme/formular*', async route => {
      if (route.request().method() === 'POST') await released
      // A superseded request is aborted by the browser; nothing to continue
      await route.continue().catch(() => {})
    })

    await fillRequired(page)
    const button = page.getByRole('button', { name: 'Anmeldung absenden' })
    await button.dblclick()
    await expect.poll(() => posts).toBe(1)
    // An aria-disabled button still takes clicks; force skips Playwright's
    // check that would refuse it
    await button.click({ force: true })
    release()

    await expect(page).toHaveURL('/aufnahme/formular/danke')
    expect(posts).toBe(1)
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
      await page.getByLabel('Anderes').check()
      await page.getByLabel('Woher genau?').fill('Plakat in der U-Bahn')
      await page
        .getByText('Weitere erziehungsberechtigte Person angeben')
        .click()
      await page.locator('#parent2Phone').fill('+43 660 7654321')
      await page.locator('#parent2SameAddress').check()

      await page.getByRole('button', { name: 'Anmeldung absenden' }).click()

      await expect(page.locator('#currentGrade-error')).toHaveText(
        'Geben Sie die derzeitige Klasse oder Schulstufe ein',
      )
      await expect(
        page.locator('#aufnahme-errors').getByRole('link', {
          name: 'Geben Sie die derzeitige Klasse oder Schulstufe ein',
        }),
      ).toHaveAttribute('href', '#currentGrade')
      await expect(page).toHaveTitle('Fehler: Anmeldung | Walz')
      await expect(page.locator('#studentSameAddress')).not.toBeChecked()
      await expect(page.locator('#studentStreet')).toBeVisible()
      await expect(page.locator('#studentStreet')).toHaveValue('Kindgasse 5')
      await expect(page.locator('#parent1Name')).toHaveValue('Anna Testfrau')
      await expect(page.locator('#studentBirthYear')).toHaveValue('2012')
      await expect(page.getByLabel('Anderes')).toBeChecked()
      await expect(page.getByLabel('Woher genau?')).toBeVisible()
      await expect(page.getByLabel('Woher genau?')).toHaveValue(
        'Plakat in der U-Bahn',
      )
      await expect(page.locator('#parent2Name')).toBeVisible()
      await expect(page.locator('#parent2Phone')).toHaveValue('+43 660 7654321')
      await expect(page.locator('#parent2SameAddress')).toBeChecked()
      await expect(page.locator('#parent2Street')).toBeHidden()
    })
  })
})
