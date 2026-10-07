/**
 * @vitest-environment jsdom
 */
import { render, screen, waitFor, within } from '@testing-library/react'
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

  it('groups the error summary by section', () => {
    const summary = renderWithActionData({
      fieldErrors: {
        studentBirthdate: 'Das Geburtsdatum muss Tag, Monat und Jahr enthalten',
        mystery: 'Ein unbekannter Fehler',
        parent1Email: 'Geben Sie Ihre E-Mail-Adresse ein',
        parent1Name: 'Geben Sie Ihren Vor- und Nachnamen ein',
      },
      values: { studentBirthDay: '31' },
    })!

    // The group label is plain text: the count stays the summary's only
    // heading, and the form keeps the only heading for "Ihre Angaben"
    const label = within(summary).getByText('Ihre Angaben')
    expect(label.tagName).toBe('P')
    expect(label.closest('h1, h2, h3, h4, h5, h6')).toBeNull()
    expect(summary.querySelectorAll('h1, h2, h3, h4, h5, h6')).toHaveLength(1)
    expect(
      screen.getAllByRole('heading', { name: /Ihre Angaben/ }),
    ).toHaveLength(1)

    const hrefs = (group: Element) =>
      Array.from(group.querySelectorAll('ul a')).map(link =>
        link.getAttribute('href'),
      )
    const firstGroup = label.closest('li')!
    expect(hrefs(firstGroup)).toEqual(['#parent1Name', '#parent1Email'])
    expect(precedes(label, firstGroup.querySelector('ul')!)).toBe(true)

    const groups = Array.from(summary.querySelector('ul')!.children)
    expect(groups.map(group => group.tagName)).toEqual(['LI', 'LI', 'LI'])
    expect(within(groups[1] as HTMLElement).getByText('Ihr Kind')).toBeTruthy()
    expect(hrefs(groups[1]!)).toEqual(['#studentBirthMonth'])

    // An error outside every section closes the list, without a label
    const trailing = groups[2]!
    expect(trailing.firstElementChild?.tagName).toBe('UL')
    expect(hrefs(trailing)).toEqual(['#mystery'])
    expect(trailing.textContent).toBe('Ein unbekannter Fehler')
  })
})
