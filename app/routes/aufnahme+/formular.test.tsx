/**
 * @vitest-environment jsdom
 */
import { CaretDown } from '@phosphor-icons/react'
import { render, screen, waitFor, within } from '@testing-library/react'
import { createRoutesStub } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderStatic } from '#tests/setup/render-static.ts'
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
    expect(
      within(groups[1] as HTMLElement).getByText('Jugendliche:r'),
    ).toBeTruthy()
    expect(hrefs(groups[1]!)).toEqual(['#studentBirthMonth'])

    // An error outside every section closes the list, without a label
    const trailing = groups[2]!
    expect(trailing.firstElementChild?.tagName).toBe('UL')
    expect(hrefs(trailing)).toEqual(['#mystery'])
    expect(trailing.textContent).toBe('Ein unbekannter Fehler')
  })
})

describe('Aufnahme form error summary lists', () => {
  // Safari drops the list role from a list without bullets.
  it('keeps the list role on the outer and the nested lists', () => {
    const summary = renderWithActionData({
      fieldErrors: {
        parent1Name: 'Geben Sie Ihren Vor- und Nachnamen ein',
        studentName: 'Geben Sie den Vor- und Nachnamen ein',
      },
      values: {},
    })!

    const lists = Array.from(summary.querySelectorAll('ul'))
    expect(lists).toHaveLength(3)
    expect(lists.map(list => list.getAttribute('role'))).toEqual([
      'list',
      'list',
      'list',
    ])
  })
})

describe('Aufnahme form school history', () => {
  it('asks for all schools attended so far, without a hint', () => {
    renderWithActionData({ fieldErrors: {}, values: {} })

    const field = screen.getByLabelText('Alle bisher besuchten Schulen')
    expect(field.tagName).toBe('TEXTAREA')
    expect(document.getElementById(`${field.id}-hint`)).toBeNull()
    expect(field.hasAttribute('aria-describedby')).toBe(false)
  })
})

describe('Aufnahme form street hint', () => {
  it('asks for staircase and door without an example, for every person', () => {
    renderWithActionData({ fieldErrors: {}, values: {} })

    for (const person of ['parent1', 'student', 'parent2']) {
      const hint = document.getElementById(`${person}Street-hint`)
      expect(hint?.textContent).toBe('Mit Stiege und Tür')
    }
  })
})

describe('Aufnahme form section for the applicant', () => {
  it('addresses the applicant without calling them a child', () => {
    renderWithActionData({ fieldErrors: {}, values: {} })

    const heading = screen.getByRole('heading', { name: /Jugendliche:r/ })
    const section = heading.closest('fieldset')!
    const email = within(section).getByLabelText('E-Mail')
    expect(document.getElementById(`${email.id}-hint`)?.textContent).toBe(
      'Die Bestätigung geht auch an diese Adresse. Gibt es keine eigene, geben Sie Ihre an.',
    )
    expect(section.textContent).toContain(
      'Entfernen Sie den Haken bei einer anderen Wohnadresse.',
    )
    expect(section.textContent).not.toMatch(/Kind/)
  })
})

describe('Aufnahme form source question', () => {
  it('asks how they heard about the Walz in one optional text box', () => {
    renderWithActionData({ fieldErrors: {}, values: {} })

    const field = screen.getByLabelText(
      'Wie haben Sie von der Walz erfahren? (optional)',
    )
    expect(field.tagName).toBe('TEXTAREA')
    expect(field.getAttribute('name')).toBe('source')
    expect(field.getAttribute('rows')).toBe('3')
    expect(field.hasAttribute('required')).toBe(false)
    expect(document.getElementById(`${field.id}-hint`)?.textContent).toBe(
      'z. B. über Freunde, eine Veranstaltung, Instagram …',
    )
    expect(document.querySelector('input[type=radio]')).toBeNull()
    expect(document.querySelector('[name=sourceOther]')).toBeNull()
  })

  it('restores the answer and shows its error after a failed submit', () => {
    renderWithActionData({
      fieldErrors: {
        source: 'Die Antwort darf höchstens 1000 Zeichen lang sein',
      },
      values: { source: 'Über Freunde' },
    })

    const field = screen.getByLabelText(
      'Wie haben Sie von der Walz erfahren? (optional)',
    )
    expect((field as HTMLTextAreaElement).value).toBe('Über Freunde')
    expect(field.getAttribute('aria-invalid')).toBe('true')
    expect(document.getElementById(`${field.id}-error`)?.textContent).toBe(
      'Die Antwort darf höchstens 1000 Zeichen lang sein',
    )
  })
})

describe('Aufnahme form further guardian toggle', () => {
  // A plus that turns into "×" when open reads as "remove this person", but
  // closing the section keeps what was typed.
  it('marks the toggle with a caret, not a plus', () => {
    renderWithActionData({ fieldErrors: {}, values: {} })

    const summary = screen
      .getByText('Weitere erziehungsberechtigte Person angeben')
      .closest('summary')!
    const caret = renderStatic(<CaretDown weight="bold" />).querySelector('svg')

    expect(summary.querySelector('svg')?.innerHTML).toBe(caret?.innerHTML)
  })
})
