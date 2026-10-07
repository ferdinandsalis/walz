/**
 * @vitest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react'
import { createRoutesStub } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AufnahmeFormular, { type AufnahmeActionData } from './formular.tsx'

let plausible = vi.fn()

beforeEach(() => {
  plausible = vi.fn()
  window.plausible = plausible
})

afterEach(() => {
  delete window.plausible
})

function renderWithActionData(actionData: AufnahmeActionData) {
  const Stub = createRoutesStub([
    {
      id: 'formular',
      path: '/aufnahme/formular',
      Component: AufnahmeFormular,
    },
  ])
  render(
    <Stub
      initialEntries={['/aufnahme/formular']}
      hydrationData={{ actionData: { formular: actionData } }}
    />,
  )
  return document.getElementById('aufnahme-errors')
}

function precedes(first: Element, second: Element) {
  return Boolean(
    first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING,
  )
}

describe('Aufnahme form after a failed submit', () => {
  it('puts the mail failure above the first section and focuses it', async () => {
    const summary = renderWithActionData({
      formError: 'mail',
      values: { parent1Name: 'Anna Testfrau' },
    })

    expect(summary?.textContent).toBe(
      'Ihre Anmeldung konnte gerade nicht gesendet werden. Bitte versuchen Sie es in ein paar Minuten noch einmal oder schreiben Sie an office@walz.at.',
    )
    expect(
      summary?.querySelector('a[href="mailto:office@walz.at"]')?.textContent,
    ).toBe('office@walz.at')
    expect(
      precedes(summary!, screen.getByRole('heading', { name: /Ihre Angaben/ })),
    ).toBe(true)
    // The message appears only once, in the summary slot
    expect(
      screen.getAllByText(/konnte gerade nicht gesendet werden/),
    ).toHaveLength(1)
    await waitFor(() => expect(document.activeElement).toBe(summary))
    await waitFor(() => expect(document.title).toBe('Fehler: Anmeldung | Walz'))
    expect(plausible).toHaveBeenCalledExactlyOnceWith('Aufnahme Form Error', {
      props: { type: 'mail' },
    })
  })

  it('lists the field errors in page order, the date linked to its first wrong input', async () => {
    const summary = renderWithActionData({
      fieldErrors: {
        parent2Phone: 'Dieser Eintrag ist zu lang (höchstens 200 Zeichen)',
        parent2Email:
          'Geben Sie die E-Mail-Adresse der weiteren erziehungsberechtigten Person im Format name@beispiel.at ein',
        studentBirthdate: 'Das Geburtsdatum muss Tag, Monat und Jahr enthalten',
        parent1Name: 'Geben Sie Ihren Vor- und Nachnamen ein',
      },
      values: {
        studentBirthDay: '31',
        parent2Email: 'peter@',
        parent2Phone: '0'.repeat(201),
      },
    })

    expect(summary?.querySelector('h2')?.textContent).toBe(
      'Bitte prüfen Sie 4 Angaben',
    )
    const links = Array.from(summary!.querySelectorAll('a'))
    expect(links.map(link => link.getAttribute('href'))).toEqual([
      '#parent1Name',
      '#studentBirthMonth',
      '#parent2Email',
      '#parent2Phone',
    ])
    await waitFor(() => expect(document.activeElement).toBe(summary))
    expect(plausible).toHaveBeenCalledExactlyOnceWith('Aufnahme Form Error', {
      props: { type: 'validation' },
    })
  })
})
