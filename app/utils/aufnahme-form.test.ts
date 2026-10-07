import { describe, expect, it } from 'vitest'
import {
  AUFNAHME_FIELD_NAMES,
  AUFNAHME_STEPS,
  DEFAULT_COUNTRY,
  SOURCE_OPTIONS,
  checkBirthdate,
  formatAddress,
  hasParent2Data,
  parseAufnahmeForm,
  resolveAddresses,
  sectionOf,
  sectionStatus,
  SECTIONS,
  type AufnahmeInput,
} from './aufnahme-form.ts'

const validRaw: Record<string, string> = {
  parent1Name: 'Anna Beispiel',
  parent1Email: 'anna@beispiel.at',
  parent1Phone: '0660 1234567',
  parent1Street: 'Lindengasse 12/2/14',
  parent1PostalCode: '1070',
  parent1City: 'Wien',
  parent1Country: 'Österreich',
  studentName: 'Max Beispiel',
  studentEmail: 'max@beispiel.at',
  studentBirthDay: '14',
  studentBirthMonth: '3',
  studentBirthYear: '2012',
  studentSameAddress: 'on',
  currentGrade: '4B',
  schoolHistory: 'MS Lindengasse, Wien (2022–heute)',
}

function parseWith(overrides: Record<string, string>) {
  return parseAufnahmeForm({ ...validRaw, ...overrides })
}

function errorsFor(overrides: Record<string, string>) {
  const result = parseWith(overrides)
  if (result.success) throw new Error('expected the form to be invalid')
  return result.fieldErrors
}

function parsedWith(overrides: Record<string, string>): AufnahmeInput {
  const result = parseWith(overrides)
  if (!result.success) {
    throw new Error(`expected the form to be valid: ${JSON.stringify(result)}`)
  }
  return result.data
}

describe('constants', () => {
  it('lists the steps with title and description', () => {
    expect(AUFNAHME_STEPS).toEqual([
      {
        title: 'Anmeldung absenden',
        description:
          'Sie und Ihr Kind bekommen sofort eine Bestätigung per E-Mail.',
      },
      {
        title: 'Anruf von Frauke Rätz',
        description:
          'Ab Mitte November, nach dem Tag der offenen Tür, vereinbaren wir das Aufnahmegespräch.',
      },
      {
        title: 'Aufnahmegespräch',
        description:
          'Etwa 30 Minuten mit Ihrem Kind; in den letzten 10 Minuten sind Sie dabei.',
      },
      { title: 'Zu- oder Absage', description: 'Ab Jänner.' },
    ])
  })

  it('lists the source options', () => {
    expect(SOURCE_OPTIONS).toEqual([
      { value: 'freunde-familie', label: 'Freund:innen oder Familie' },
      {
        value: 'walz-gemeinschaft',
        label: 'Eltern oder Schüler:innen der Walz',
      },
      { value: 'internet', label: 'Internetsuche oder Website' },
      {
        value: 'veranstaltung',
        label: 'Veranstaltung, z. B. Tag der offenen Tür',
      },
      { value: 'social-media', label: 'Social Media' },
      { value: 'anderes', label: 'Anderes' },
    ])
  })

  it('defaults the country to Österreich', () => {
    expect(DEFAULT_COUNTRY).toBe('Österreich')
  })

  it('lists every form field name from the spec', () => {
    expect([...AUFNAHME_FIELD_NAMES].sort()).toEqual(
      [
        'parent1Name',
        'parent1Email',
        'parent1Phone',
        'parent1Street',
        'parent1PostalCode',
        'parent1City',
        'parent1Country',
        'studentName',
        'studentEmail',
        'studentBirthDay',
        'studentBirthMonth',
        'studentBirthYear',
        'studentSameAddress',
        'studentStreet',
        'studentPostalCode',
        'studentCity',
        'studentCountry',
        'currentGrade',
        'schoolHistory',
        'parent2Name',
        'parent2Phone',
        'parent2Email',
        'parent2SameAddress',
        'parent2Street',
        'parent2PostalCode',
        'parent2City',
        'parent2Country',
        'source',
        'sourceOther',
      ].sort(),
    )
  })
})

describe('parseAufnahmeForm', () => {
  it('parses a complete form', () => {
    const result = parseWith({})

    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data.student.birthdate).toBe('2012-03-14')
    expect(result.data).toEqual({
      parent1: {
        name: 'Anna Beispiel',
        email: 'anna@beispiel.at',
        phone: '0660 1234567',
        address: {
          street: 'Lindengasse 12/2/14',
          postalCode: '1070',
          city: 'Wien',
          country: 'Österreich',
        },
      },
      student: {
        name: 'Max Beispiel',
        email: 'max@beispiel.at',
        birthdate: '2012-03-14',
        sameAddress: true,
        address: undefined,
        currentGrade: '4B',
        schoolHistory: 'MS Lindengasse, Wien (2022–heute)',
      },
      parent2: undefined,
      source: undefined,
    })
  })

  it.each([
    ['parent1Name', 'Geben Sie Ihren Vor- und Nachnamen ein'],
    ['parent1Email', 'Geben Sie Ihre E-Mail-Adresse ein'],
    ['parent1Phone', 'Geben Sie Ihre Telefonnummer ein'],
    ['parent1Street', 'Geben Sie Ihre Straße und Hausnummer ein'],
    ['parent1PostalCode', 'Geben Sie Ihre Postleitzahl ein'],
    ['parent1City', 'Geben Sie Ihren Wohnort ein'],
    ['parent1Country', 'Geben Sie Ihr Land ein'],
    ['studentName', 'Geben Sie den Vor- und Nachnamen Ihres Kindes ein'],
    ['studentEmail', 'Geben Sie die E-Mail-Adresse Ihres Kindes ein'],
    ['currentGrade', 'Geben Sie die derzeitige Klasse oder Schulstufe ein'],
    [
      'schoolHistory',
      'Geben Sie die besuchten Schulen nach der Volksschule ein',
    ],
  ])(
    'reports a missing %s with its person-specific message',
    (field, message) => {
      expect(errorsFor({ [field]: '' })).toEqual({ [field]: message })
    },
  )

  it('treats whitespace-only input as empty and trims padded values', () => {
    expect(errorsFor({ studentName: '   ' }).studentName).toBe(
      'Geben Sie den Vor- und Nachnamen Ihres Kindes ein',
    )
    expect(
      parsedWith({ parent1Email: ' anna@beispiel.at ' }).parent1.email,
    ).toBe('anna@beispiel.at')
  })

  it('treats absent fields as empty', () => {
    const { parent1Name: _omitted, ...withoutName } = validRaw
    const result = parseAufnahmeForm(withoutName)

    expect(result).toEqual({
      success: false,
      fieldErrors: { parent1Name: 'Geben Sie Ihren Vor- und Nachnamen ein' },
    })
  })

  it('accepts non-ASCII names and addresses', () => {
    const data = parsedWith({
      studentName: 'Zoë Ğül-Müller',
      parent1Street: 'Straße 5/2/14',
    })

    expect(data.student.name).toBe('Zoë Ğül-Müller')
    expect(data.parent1.address.street).toBe('Straße 5/2/14')
  })

  it.each([
    [
      'parent1Email',
      'Geben Sie Ihre E-Mail-Adresse im Format name@beispiel.at ein',
    ],
    [
      'studentEmail',
      'Geben Sie die E-Mail-Adresse Ihres Kindes im Format name@beispiel.at ein',
    ],
    [
      'parent2Email',
      'Geben Sie die E-Mail-Adresse der weiteren erziehungsberechtigten Person im Format name@beispiel.at ein',
    ],
  ])('rejects a malformed %s with the format message', (field, message) => {
    const overrides: Record<string, string> = {
      parent2Name: 'Ben Beispiel',
      [field]: 'kein-at-zeichen',
    }

    expect(errorsFor(overrides)).toEqual({ [field]: message })
  })

  it('reports the birthdate group under studentBirthdate', () => {
    expect(errorsFor({ studentBirthYear: '12' })).toEqual({
      studentBirthdate: 'Das Jahr muss vier Ziffern haben',
    })
  })

  it('validates the child address only when the box is unticked', () => {
    expect(errorsFor({ parent1Street: '' })).toEqual({
      parent1Street: 'Geben Sie Ihre Straße und Hausnummer ein',
    })

    const { studentSameAddress: _ticked, ...unticked } = validRaw
    expect(parseAufnahmeForm(unticked)).toEqual({
      success: false,
      fieldErrors: {
        studentStreet: 'Geben Sie Straße und Hausnummer Ihres Kindes ein',
        studentPostalCode: 'Geben Sie die Postleitzahl Ihres Kindes ein',
        studentCity: 'Geben Sie den Wohnort Ihres Kindes ein',
        studentCountry: 'Geben Sie das Land Ihres Kindes ein',
      },
    })
  })

  it('keeps the child address when the box is unticked', () => {
    const { studentSameAddress: _ticked, ...unticked } = validRaw
    const result = parseAufnahmeForm({
      ...unticked,
      studentStreet: 'Ringstraße 1',
      studentPostalCode: '1010',
      studentCity: 'Wien',
      studentCountry: 'Österreich',
    })

    expect(result.success && result.data.student).toMatchObject({
      sameAddress: false,
      address: {
        street: 'Ringstraße 1',
        postalCode: '1010',
        city: 'Wien',
        country: 'Österreich',
      },
    })
  })

  it('ignores hidden child address values while the box is ticked', () => {
    const data = parsedWith({ studentStreet: 'Ringstraße 1' })

    expect(data.student.sameAddress).toBe(true)
    expect(data.student.address).toBeUndefined()
  })

  describe('second guardian', () => {
    it('requires a name once any second-guardian data is given', () => {
      expect(errorsFor({ parent2Phone: '0660 1' })).toEqual({
        parent2Name:
          'Geben Sie den Namen der weiteren erziehungsberechtigten Person ein',
      })
    })

    it.each([
      'parent2Email',
      'parent2Street',
      'parent2PostalCode',
      'parent2City',
    ])('counts %s as given', field => {
      expect(errorsFor({ [field]: 'x' })).toHaveProperty('parent2Name')
    })

    it('ignores the second guardian when only defaults remain', () => {
      const data = parsedWith({
        parent2Country: 'Österreich',
        parent2SameAddress: 'on',
      })

      expect(data.parent2).toBeUndefined()
    })

    it('drops a second guardian whose fields were all cleared', () => {
      const data = parsedWith({
        parent2Name: '',
        parent2Phone: '',
        parent2Email: '',
        parent2Street: '',
        parent2PostalCode: '',
        parent2City: '',
      })

      expect(data.parent2).toBeUndefined()
    })

    it('keeps optional second-guardian fields undefined when empty', () => {
      const data = parsedWith({ parent2Name: 'Ben Beispiel' })

      expect(data.parent2).toEqual({
        name: 'Ben Beispiel',
        email: undefined,
        phone: undefined,
        sameAddress: false,
        address: undefined,
      })
    })

    it('keeps a second guardian with an own address', () => {
      const data = parsedWith({
        parent2Name: 'Ben Beispiel',
        parent2Email: 'ben@beispiel.at',
        parent2Phone: '0660 2',
        parent2Street: 'Ringstraße 1',
        parent2PostalCode: '1010',
        parent2City: 'Wien',
        parent2Country: 'Österreich',
      })

      expect(data.parent2).toEqual({
        name: 'Ben Beispiel',
        email: 'ben@beispiel.at',
        phone: '0660 2',
        sameAddress: false,
        address: {
          street: 'Ringstraße 1',
          postalCode: '1010',
          city: 'Wien',
          country: 'Österreich',
        },
      })
    })

    it('ignores the hidden address while the second guardian shares parent 1', () => {
      const data = parsedWith({
        parent2Name: 'Ben Beispiel',
        parent2SameAddress: 'on',
        parent2Street: 'Ringstraße 1',
      })

      expect(data.parent2).toMatchObject({ sameAddress: true })
      expect(data.parent2?.address).toBeUndefined()
    })

    it('skips the hidden address checks while the box is ticked', () => {
      const data = parsedWith({
        parent2Name: 'Ben Beispiel',
        parent2SameAddress: 'on',
        parent2Street: 'x'.repeat(201),
        parent2PostalCode: 'x'.repeat(201),
        parent2City: 'x'.repeat(201),
        parent2Country: 'x'.repeat(201),
      })

      expect(data.parent2).toMatchObject({ sameAddress: true })
      expect(data.parent2?.address).toBeUndefined()
    })

    it('does not count a hidden address as given while the box is ticked', () => {
      const data = parsedWith({
        parent2SameAddress: 'on',
        parent2Street: 'Ringstraße 1',
        parent2PostalCode: '1010',
        parent2City: 'Wien',
      })

      expect(data.parent2).toBeUndefined()
    })
  })

  describe('source', () => {
    it('drops sourceOther unless the source is "anderes"', () => {
      expect(
        parsedWith({ source: 'internet', sourceOther: 'x' }).source,
      ).toEqual({ value: 'internet' })
    })

    it('keeps sourceOther for "anderes"', () => {
      expect(
        parsedWith({ source: 'anderes', sourceOther: ' Plakat ' }).source,
      ).toEqual({ value: 'anderes', other: 'Plakat' })
    })

    it('leaves out an empty sourceOther', () => {
      expect(parsedWith({ source: 'anderes', sourceOther: '' }).source).toEqual(
        { value: 'anderes' },
      )
    })

    it('is undefined when absent', () => {
      expect(parsedWith({}).source).toBeUndefined()
    })

    it('ignores an unknown source value', () => {
      expect(parsedWith({ source: 'unbekannt' }).source).toBeUndefined()
    })
  })

  describe('length limits', () => {
    it('limits schoolHistory to 2000 characters', () => {
      expect(parsedWith({ schoolHistory: 'a'.repeat(2000) })).toBeDefined()
      expect(errorsFor({ schoolHistory: 'a'.repeat(2001) })).toEqual({
        schoolHistory:
          'Die Liste der Schulen darf höchstens 2000 Zeichen lang sein',
      })
    })

    it('reports an overlong email as too long, not as malformed', () => {
      const overlong = `anna.${'a'.repeat(200)}@beispiel.at`

      expect(errorsFor({ parent1Email: overlong })).toEqual({
        parent1Email: 'Dieser Eintrag ist zu lang (höchstens 200 Zeichen)',
      })
    })

    it('limits single-line fields to 200 characters', () => {
      expect(errorsFor({ parent1City: 'a'.repeat(201) })).toEqual({
        parent1City: 'Dieser Eintrag ist zu lang (höchstens 200 Zeichen)',
      })
    })

    it('applies the 200 character limit to every single-line field', () => {
      const long = 'a'.repeat(201)
      const { studentSameAddress: _ticked, ...unticked } = validRaw
      const result = parseAufnahmeForm({
        ...unticked,
        parent1Name: long,
        parent1Phone: long,
        parent1Street: long,
        parent1PostalCode: long,
        parent1Country: long,
        studentName: long,
        studentStreet: long,
        studentPostalCode: long,
        studentCity: long,
        studentCountry: long,
        currentGrade: long,
        parent2Name: long,
        parent2Phone: long,
        parent2Street: long,
        parent2PostalCode: long,
        parent2City: long,
        parent2Country: long,
        source: 'anderes',
        sourceOther: long,
      })

      expect(result.success).toBe(false)
      if (result.success) return
      expect(Object.keys(result.fieldErrors).sort()).toEqual(
        [
          'parent1Name',
          'parent1Phone',
          'parent1Street',
          'parent1PostalCode',
          'parent1Country',
          'studentName',
          'studentStreet',
          'studentPostalCode',
          'studentCity',
          'studentCountry',
          'currentGrade',
          'parent2Name',
          'parent2Phone',
          'parent2Street',
          'parent2PostalCode',
          'parent2City',
          'parent2Country',
          'sourceOther',
        ].sort(),
      )
      expect(new Set(Object.values(result.fieldErrors))).toEqual(
        new Set(['Dieser Eintrag ist zu lang (höchstens 200 Zeichen)']),
      )
    })
  })
})

describe('hasParent2Data', () => {
  it('is false for an untouched section', () => {
    expect(hasParent2Data({})).toBe(false)
  })

  it('ignores the defaulted country and the checkbox', () => {
    expect(
      hasParent2Data({
        parent2Country: 'Österreich',
        parent2SameAddress: 'on',
      }),
    ).toBe(false)
  })

  it('treats whitespace-only values as empty', () => {
    expect(hasParent2Data({ parent2Name: '  ', parent2Street: ' ' })).toBe(
      false,
    )
  })

  it.each([
    'parent2Name',
    'parent2Phone',
    'parent2Email',
    'parent2Street',
    'parent2PostalCode',
    'parent2City',
  ])('counts %s while the box is unticked', field => {
    expect(hasParent2Data({ [field]: 'x' })).toBe(true)
  })

  it.each(['parent2Street', 'parent2PostalCode', 'parent2City'])(
    'ignores the hidden %s while the box is ticked',
    field => {
      expect(hasParent2Data({ [field]: 'x', parent2SameAddress: 'on' })).toBe(
        false,
      )
    },
  )

  it.each(['parent2Name', 'parent2Phone', 'parent2Email'])(
    'still counts %s while the box is ticked',
    field => {
      expect(hasParent2Data({ [field]: 'x', parent2SameAddress: 'on' })).toBe(
        true,
      )
    },
  )
})

describe('checkBirthdate', () => {
  const today = new Date('2026-10-07T12:00:00Z')

  it('asks for the date when all parts are empty', () => {
    expect(checkBirthdate('', '', '', today)).toEqual({
      ok: false,
      message: 'Geben Sie das Geburtsdatum Ihres Kindes ein',
      parts: ['day', 'month', 'year'],
    })
  })

  it('flags only the empty parts when partly empty', () => {
    expect(checkBirthdate('14', '', '2012', today)).toEqual({
      ok: false,
      message: 'Das Geburtsdatum muss Tag, Monat und Jahr enthalten',
      parts: ['month'],
    })
  })

  it('treats whitespace-only parts as empty', () => {
    expect(checkBirthdate('  ', '  ', '  ', today)).toMatchObject({
      ok: false,
      message: 'Geben Sie das Geburtsdatum Ihres Kindes ein',
    })
  })

  it('requires a four-digit year', () => {
    expect(checkBirthdate('14', '3', '12', today)).toEqual({
      ok: false,
      message: 'Das Jahr muss vier Ziffern haben',
      parts: ['year'],
    })
  })

  it('rejects a date that does not exist', () => {
    expect(checkBirthdate('31', '2', '2012', today)).toEqual({
      ok: false,
      message: 'Das Geburtsdatum muss ein gültiges Datum sein',
      parts: ['day', 'month', 'year'],
    })
  })

  it('rejects non-numeric parts as not a real date', () => {
    expect(checkBirthdate('xx', '3', '2012', today)).toMatchObject({
      ok: false,
      message: 'Das Geburtsdatum muss ein gültiges Datum sein',
    })
  })

  it('reports a pasted full date as partly empty, without truncating it', () => {
    expect(checkBirthdate('14.03.2012', '', '', today)).toEqual({
      ok: false,
      message: 'Das Geburtsdatum muss Tag, Monat und Jahr enthalten',
      parts: ['month', 'year'],
    })
  })

  it('rejects a date in the future', () => {
    expect(checkBirthdate('8', '10', '2026', today)).toEqual({
      ok: false,
      message: 'Das Geburtsdatum muss in der Vergangenheit liegen',
      parts: ['day', 'month', 'year'],
    })
  })

  it('rejects today, which is not in the past', () => {
    expect(checkBirthdate('7', '10', '2026', today)).toMatchObject({
      ok: false,
      message: 'Das Geburtsdatum muss in der Vergangenheit liegen',
    })
  })

  it('accepts yesterday', () => {
    expect(checkBirthdate('6', '10', '2026', today)).toEqual({
      ok: true,
      iso: '2026-10-06',
    })
  })

  it('trims and zero-pads the parts', () => {
    expect(checkBirthdate(' 4 ', '03', '2012', today)).toEqual({
      ok: true,
      iso: '2012-03-04',
    })
  })

  it('accepts a leap day', () => {
    expect(checkBirthdate('29', '2', '2012', today)).toEqual({
      ok: true,
      iso: '2012-02-29',
    })
  })

  it('rejects a leap day in a non-leap year', () => {
    expect(checkBirthdate('29', '2', '2013', today)).toMatchObject({
      ok: false,
      message: 'Das Geburtsdatum muss ein gültiges Datum sein',
    })
  })

  it('defaults to the current date', () => {
    expect(checkBirthdate('1', '1', '2999')).toMatchObject({
      ok: false,
      message: 'Das Geburtsdatum muss in der Vergangenheit liegen',
    })
  })
})

describe('resolveAddresses', () => {
  const lindengasse = {
    street: 'Lindengasse 12/2/14',
    postalCode: '1070',
    city: 'Wien',
    country: 'Österreich',
  }

  it('gives the child the parent address when the box is ticked', () => {
    const submission = resolveAddresses(parsedWith({}))

    expect(submission.student.address).toEqual(lindengasse)
    expect(submission.student.sameAddressAsParent1).toBe(true)
    expect(submission.parent1.address).toEqual(lindengasse)
    expect(submission.parent1.sameAddressAsParent1).toBe(false)
  })

  it('keeps the child own address when the box is unticked', () => {
    const { studentSameAddress: _ticked, ...unticked } = validRaw
    const result = parseAufnahmeForm({
      ...unticked,
      studentStreet: 'Ringstraße 1',
      studentPostalCode: '1010',
      studentCity: 'Wien',
      studentCountry: 'Österreich',
    })
    if (!result.success) throw new Error('expected a valid form')

    const submission = resolveAddresses(result.data)

    expect(submission.student.address).toMatchObject({ street: 'Ringstraße 1' })
    expect(submission.student.sameAddressAsParent1).toBe(false)
  })

  it('gives the second guardian the parent address when the box is ticked', () => {
    const submission = resolveAddresses(
      parsedWith({ parent2Name: 'Ben Beispiel', parent2SameAddress: 'on' }),
    )

    expect(submission.parent2).toEqual({
      name: 'Ben Beispiel',
      email: undefined,
      phone: undefined,
      address: lindengasse,
      sameAddressAsParent1: true,
    })
  })

  it('leaves an unticked second guardian without an address alone', () => {
    const submission = resolveAddresses(
      parsedWith({ parent2Name: 'Ben Beispiel' }),
    )

    expect(submission.parent2?.address).toBeUndefined()
    expect(submission.parent2?.sameAddressAsParent1).toBe(false)
  })

  it('leaves an unticked second guardian with an own address alone', () => {
    const submission = resolveAddresses(
      parsedWith({
        parent2Name: 'Ben Beispiel',
        parent2Street: 'Ringstraße 1',
        parent2PostalCode: '1010',
        parent2City: 'Wien',
        parent2Country: 'Österreich',
      }),
    )

    expect(submission.parent2?.address).toMatchObject({
      street: 'Ringstraße 1',
    })
  })

  it('leaves out the second guardian when not given', () => {
    expect(resolveAddresses(parsedWith({})).parent2).toBeUndefined()
  })

  it('resolves the source to its option label', () => {
    expect(
      resolveAddresses(parsedWith({ source: 'veranstaltung' })).source,
    ).toEqual({ label: 'Veranstaltung, z. B. Tag der offenen Tür' })
    expect(
      resolveAddresses(parsedWith({ source: 'anderes', sourceOther: 'Plakat' }))
        .source,
    ).toEqual({ label: 'Anderes', other: 'Plakat' })
    expect(resolveAddresses(parsedWith({})).source).toBeUndefined()
  })

  it('carries the remaining child data over', () => {
    expect(resolveAddresses(parsedWith({})).student).toMatchObject({
      name: 'Max Beispiel',
      email: 'max@beispiel.at',
      birthdate: '2012-03-14',
      currentGrade: '4B',
      schoolHistory: 'MS Lindengasse, Wien (2022–heute)',
    })
  })
})

describe('formatAddress', () => {
  it('joins the parts on one line', () => {
    expect(
      formatAddress({
        street: 'Lindengasse 12/2/14',
        postalCode: '1070',
        city: 'Wien',
        country: 'Österreich',
      }),
    ).toBe('Lindengasse 12/2/14, 1070 Wien, Österreich')
  })

  it('skips empty parts of a partly filled address', () => {
    expect(
      formatAddress({
        street: 'Lindengasse 12',
        postalCode: '',
        city: 'Wien',
        country: '',
      }),
    ).toBe('Lindengasse 12, Wien')
  })
})

describe('SECTIONS', () => {
  it('lists the four sections in page order', () => {
    expect(SECTIONS).toEqual([
      {
        key: 'parent1',
        number: 1,
        title: 'Ihre Angaben',
        id: 'abschnitt-1',
      },
      { key: 'student', number: 2, title: 'Ihr Kind', id: 'abschnitt-2' },
      {
        key: 'parent2',
        number: 3,
        title: 'Weitere erziehungsberechtigte Person',
        id: 'abschnitt-3',
      },
      { key: 'final', number: 4, title: 'Zum Schluss', id: 'abschnitt-4' },
    ])
  })
})

describe('sectionOf', () => {
  it.each([
    ['parent1Name', 'parent1'],
    ['parent1PostalCode', 'parent1'],
    ['studentName', 'student'],
    ['studentSameAddress', 'student'],
    ['studentBirthdate', 'student'],
    ['currentGrade', 'student'],
    ['schoolHistory', 'student'],
    ['parent2Email', 'parent2'],
    ['parent2SameAddress', 'parent2'],
    ['source', 'final'],
    ['sourceOther', 'final'],
  ])('maps %s to %s', (key, section) => {
    expect(sectionOf(key)).toBe(section)
  })

  it('maps every form field to a section', () => {
    const unmapped = AUFNAHME_FIELD_NAMES.filter(
      name => sectionOf(name) === undefined,
    )
    expect(unmapped).toEqual([])
  })

  it('maps keys that belong to no section to undefined', () => {
    expect(sectionOf('mail')).toBeUndefined()
    expect(sectionOf('')).toBeUndefined()
  })
})

describe('sectionStatus', () => {
  const statuses = (
    values: Record<string, string>,
    shownErrors: Record<string, string> = {},
  ) => ({
    parent1: sectionStatus('parent1', values, shownErrors),
    student: sectionStatus('student', values, shownErrors),
    parent2: sectionStatus('parent2', values, shownErrors),
    final: sectionStatus('final', values, shownErrors),
  })

  it('shows an empty form as open, open, optional, open', () => {
    expect(statuses({})).toEqual({
      parent1: 'open',
      student: 'open',
      parent2: 'optional',
      final: 'open',
    })
  })

  it('marks the sections of a complete valid form as done', () => {
    expect(statuses(validRaw)).toEqual({
      parent1: 'done',
      student: 'done',
      parent2: 'optional',
      final: 'open',
    })
  })

  it('keeps the child section open for an impossible date', () => {
    const values = {
      ...validRaw,
      studentBirthDay: '31',
      studentBirthMonth: '2',
      studentBirthYear: '2012',
    }
    expect(sectionStatus('student', values, {})).toBe('open')
  })

  it('keeps the child section open while the school fields are empty', () => {
    expect(
      sectionStatus('student', { ...validRaw, currentGrade: '' }, {}),
    ).toBe('open')
  })

  it('lets a shown error win over values that parse clean', () => {
    const shownErrors = { studentBirthdate: 'Das Jahr muss vier Ziffern haben' }
    expect(sectionStatus('student', validRaw, shownErrors)).toBe('attention')
    expect(sectionStatus('parent1', validRaw, shownErrors)).toBe('done')
  })

  it('ignores shown errors that belong to no section', () => {
    expect(sectionStatus('parent1', validRaw, { mail: 'Fehler' })).toBe('done')
  })

  it('counts the child address as done while the box is ticked', () => {
    const values = {
      ...validRaw,
      studentSameAddress: 'on',
      studentStreet: '',
      studentPostalCode: '',
      studentCity: '',
      studentCountry: '',
    }
    expect(sectionStatus('student', values, {})).toBe('done')
  })

  it('keeps the child section open when the box is cleared and the address is empty', () => {
    const values = {
      ...validRaw,
      studentSameAddress: '',
      studentStreet: '',
      studentPostalCode: '',
      studentCity: '',
      studentCountry: '',
    }
    expect(sectionStatus('student', values, {})).toBe('open')
  })

  it('marks parent 2 done with a name and a phone', () => {
    const values = {
      ...validRaw,
      parent2Name: 'Boris Beispiel',
      parent2Phone: '0660 7654321',
    }
    expect(sectionStatus('parent2', values, {})).toBe('done')
  })

  it('keeps parent 2 open with only a phone', () => {
    const values = { ...validRaw, parent2Phone: '0660 7654321' }
    expect(sectionStatus('parent2', values, {})).toBe('open')
  })

  it('keeps parent 2 open when the email is malformed', () => {
    const values = {
      ...validRaw,
      parent2Name: 'Boris Beispiel',
      parent2Email: 'kein-email',
    }
    expect(sectionStatus('parent2', values, {})).toBe('open')
  })

  it('shows parent 2 as optional again once every text field is cleared', () => {
    const values = {
      ...validRaw,
      parent2Name: '',
      parent2Email: '',
      parent2Phone: '',
      parent2Street: '',
      parent2PostalCode: '',
      parent2City: '',
    }
    expect(sectionStatus('parent2', values, {})).toBe('optional')
  })

  it('ignores a hidden parent 2 address while the box is ticked', () => {
    const values = {
      ...validRaw,
      parent2SameAddress: 'on',
      parent2Street: 'Versteckt 1',
    }
    expect(sectionStatus('parent2', values, {})).toBe('optional')
  })

  it('shows parent 2 as attention when one of its fields has a shown error', () => {
    expect(sectionStatus('parent2', validRaw, { parent2Email: 'Fehler' })).toBe(
      'attention',
    )
  })

  it('keeps the final section open for source "anderes" without detail', () => {
    const values = { ...validRaw, source: 'anderes', sourceOther: '' }
    expect(sectionStatus('final', values, {})).toBe('open')
  })

  it('marks the final section as attention for a shown sourceOther error', () => {
    const values = { ...validRaw, source: 'anderes' }
    expect(sectionStatus('final', values, { sourceOther: 'Fehler' })).toBe(
      'attention',
    )
  })

  it('never shows the final section as done or optional', () => {
    const values = { ...validRaw, source: 'internet' }
    expect(sectionStatus('final', values, {})).toBe('open')
    expect(sectionStatus('final', {}, {})).toBe('open')
  })
})
