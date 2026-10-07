import { z } from 'zod'

export type Address = {
  street: string
  postalCode: string
  city: string
  country: string
}

export type SourceValue =
  | 'freunde-familie'
  | 'walz-gemeinschaft'
  | 'internet'
  | 'veranstaltung'
  | 'social-media'
  | 'anderes'

export const SOURCE_OPTIONS: ReadonlyArray<{
  value: SourceValue
  label: string
}> = [
  { value: 'freunde-familie', label: 'Freund:innen oder Familie' },
  { value: 'walz-gemeinschaft', label: 'Eltern oder Schüler:innen der Walz' },
  { value: 'internet', label: 'Internetsuche oder Website' },
  {
    value: 'veranstaltung',
    label: 'Veranstaltung, z. B. Tag der offenen Tür',
  },
  { value: 'social-media', label: 'Social Media' },
  { value: 'anderes', label: 'Anderes' },
]

// Shown as a short list before the form and in full on the confirmation page.
export const AUFNAHME_STEPS: ReadonlyArray<{
  title: string
  description: string
}> = [
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
]

export const DEFAULT_COUNTRY = 'Österreich'

// In page order, so the error summary lists problems top to bottom.
export const AUFNAHME_FIELD_NAMES: ReadonlyArray<string> = [
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
  'parent2Email',
  'parent2Phone',
  'parent2SameAddress',
  'parent2Street',
  'parent2PostalCode',
  'parent2City',
  'parent2Country',
  'source',
  'sourceOther',
]

const MAX_LINE_LENGTH = 200
const MAX_SCHOOL_HISTORY_LENGTH = 2000
const LINE_TOO_LONG = `Dieser Eintrag ist zu lang (höchstens ${MAX_LINE_LENGTH} Zeichen)`

export type BirthdatePart = 'day' | 'month' | 'year'

const BIRTHDATE_PARTS: BirthdatePart[] = ['day', 'month', 'year']

export function checkBirthdate(
  day: string,
  month: string,
  year: string,
  today: Date = new Date(),
):
  | { ok: true; iso: string }
  | { ok: false; message: string; parts: BirthdatePart[] } {
  const given = { day: day.trim(), month: month.trim(), year: year.trim() }
  const emptyParts = BIRTHDATE_PARTS.filter(part => given[part] === '')

  if (emptyParts.length === BIRTHDATE_PARTS.length) {
    return {
      ok: false,
      message: 'Geben Sie das Geburtsdatum Ihres Kindes ein',
      parts: BIRTHDATE_PARTS,
    }
  }
  if (emptyParts.length > 0) {
    return {
      ok: false,
      message: 'Das Geburtsdatum muss Tag, Monat und Jahr enthalten',
      parts: emptyParts,
    }
  }
  if (!/^\d{4}$/.test(given.year)) {
    return {
      ok: false,
      message: 'Das Jahr muss vier Ziffern haben',
      parts: ['year'],
    }
  }

  const notRealDate = {
    ok: false as const,
    message: 'Das Geburtsdatum muss ein gültiges Datum sein',
    parts: BIRTHDATE_PARTS,
  }
  if (!/^\d{1,2}$/.test(given.day) || !/^\d{1,2}$/.test(given.month)) {
    return notRealDate
  }

  // Date rolls impossible dates over (31 Feb becomes 3 Mar), so a date is only
  // real when it survives the round trip. setUTCFullYear avoids the two-digit
  // year mapping of the Date constructor.
  const dayNumber = Number(given.day)
  const monthNumber = Number(given.month)
  const yearNumber = Number(given.year)
  const date = new Date(0)
  date.setUTCFullYear(yearNumber, monthNumber - 1, dayNumber)
  if (
    date.getUTCFullYear() !== yearNumber ||
    date.getUTCMonth() !== monthNumber - 1 ||
    date.getUTCDate() !== dayNumber
  ) {
    return notRealDate
  }

  const startOfToday = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
  )
  if (date.getTime() >= startOfToday) {
    return {
      ok: false,
      message: 'Das Geburtsdatum muss in der Vergangenheit liegen',
      parts: BIRTHDATE_PARTS,
    }
  }

  return { ok: true, iso: date.toISOString().slice(0, 10) }
}

export type FormatCheckedField =
  | 'parent1Email'
  | 'studentEmail'
  | 'parent2Email'

const EMAIL_FORMAT_MESSAGES: Record<FormatCheckedField, string> = {
  parent1Email: 'Geben Sie Ihre E-Mail-Adresse im Format name@beispiel.at ein',
  studentEmail:
    'Geben Sie die E-Mail-Adresse Ihres Kindes im Format name@beispiel.at ein',
  parent2Email:
    'Geben Sie die E-Mail-Adresse der weiteren erziehungsberechtigten Person im Format name@beispiel.at ein',
}

function isEmail(value: string) {
  return z.email().safeParse(value).success
}

// Empty values are left to the required check, so a blur on an untouched field
// reports nothing.
export function checkEmailFormat(
  field: FormatCheckedField,
  value: string,
): string | undefined {
  const trimmed = value.trim()
  if (trimmed === '' || isEmail(trimmed)) return undefined
  return EMAIL_FORMAT_MESSAGES[field]
}

export type AufnahmeInput = {
  parent1: { name: string; email: string; phone: string; address: Address }
  student: {
    name: string
    email: string
    birthdate: string
    sameAddress: boolean
    address?: Address
    currentGrade: string
    schoolHistory: string
  }
  parent2?: {
    name: string
    email?: string
    phone?: string
    sameAddress: boolean
    address?: Address
  }
  source?: { value: SourceValue; other?: string }
}

const required = (message: string) =>
  z.string().trim().min(1, message).max(MAX_LINE_LENGTH, LINE_TOO_LONG)

const optional = () => z.string().trim().max(MAX_LINE_LENGTH, LINE_TOO_LONG)

const requiredEmail = (message: string, field: FormatCheckedField) =>
  required(message).refine(isEmail, EMAIL_FORMAT_MESSAGES[field])

const addressFields = (messages: {
  street: string
  postalCode: string
  city: string
  country: string
}) => ({
  street: required(messages.street),
  postalCode: required(messages.postalCode),
  city: required(messages.city),
  country: required(messages.country),
})

// The schemas use generic keys (name, street, ...); parseSection maps issues
// back to the form field names by prefixing the person.
const parent1Schema = z.object({
  name: required('Geben Sie Ihren Vor- und Nachnamen ein'),
  email: requiredEmail('Geben Sie Ihre E-Mail-Adresse ein', 'parent1Email'),
  phone: required('Geben Sie Ihre Telefonnummer ein'),
  ...addressFields({
    street: 'Geben Sie Ihre Straße und Hausnummer ein',
    postalCode: 'Geben Sie Ihre Postleitzahl ein',
    city: 'Geben Sie Ihren Wohnort ein',
    country: 'Geben Sie Ihr Land ein',
  }),
})

const studentSchema = z.object({
  name: required('Geben Sie den Vor- und Nachnamen Ihres Kindes ein'),
  email: requiredEmail(
    'Geben Sie die E-Mail-Adresse Ihres Kindes ein',
    'studentEmail',
  ),
  birthdate: z
    .object({ day: z.string(), month: z.string(), year: z.string() })
    .transform((parts, ctx) => {
      const result = checkBirthdate(parts.day, parts.month, parts.year)
      if (!result.ok) {
        ctx.addIssue({ code: 'custom', message: result.message })
        return z.NEVER
      }
      return result.iso
    }),
})

const studentAddressSchema = z.object(
  addressFields({
    street: 'Geben Sie Straße und Hausnummer Ihres Kindes ein',
    postalCode: 'Geben Sie die Postleitzahl Ihres Kindes ein',
    city: 'Geben Sie den Wohnort Ihres Kindes ein',
    country: 'Geben Sie das Land Ihres Kindes ein',
  }),
)

const schoolSchema = z.object({
  currentGrade: required('Geben Sie die derzeitige Klasse oder Schulstufe ein'),
  schoolHistory: z
    .string()
    .trim()
    .min(1, 'Geben Sie die besuchten Schulen nach der Volksschule ein')
    .max(
      MAX_SCHOOL_HISTORY_LENGTH,
      `Die Liste der Schulen darf höchstens ${MAX_SCHOOL_HISTORY_LENGTH} Zeichen lang sein`,
    ),
})

// Every field is optional; the address stays optional even once a name is
// required.
const parent2Schema = z.object({
  name: required(
    'Geben Sie den Namen der weiteren erziehungsberechtigten Person ein',
  ),
  email: optional().refine(
    value => value === '' || isEmail(value),
    EMAIL_FORMAT_MESSAGES.parent2Email,
  ),
  phone: optional(),
  street: optional(),
  postalCode: optional(),
  city: optional(),
  country: optional(),
})

const sourceOtherSchema = z.object({ sourceOther: optional() })

type FieldErrors = Record<string, string>

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function parseSection<Schema extends z.ZodType>(
  schema: Schema,
  input: unknown,
  prefix: string,
  fieldErrors: FieldErrors,
): z.output<Schema> | undefined {
  const result = schema.safeParse(input)
  if (result.success) return result.data

  for (const issue of result.error.issues) {
    const key = String(issue.path[0])
    const fieldName = prefix ? `${prefix}${capitalize(key)}` : key
    fieldErrors[fieldName] ??= issue.message
  }
  return undefined
}

const EMPTY_ADDRESS: Address = {
  street: '',
  postalCode: '',
  city: '',
  country: '',
}

const PARENT2_CONTACT_FIELDS = ['parent2Name', 'parent2Phone', 'parent2Email']
const PARENT2_ADDRESS_FIELDS = [
  'parent2Street',
  'parent2PostalCode',
  'parent2City',
]

// Whether the form holds data for a second guardian. The checkbox and the
// defaulted country do not count, so an untouched section is dropped instead
// of failing; the address counts only while it is shown (box unticked).
export function hasParent2Data(
  values: Record<string, string | undefined>,
): boolean {
  const fields =
    values.parent2SameAddress === 'on'
      ? PARENT2_CONTACT_FIELDS
      : [...PARENT2_CONTACT_FIELDS, ...PARENT2_ADDRESS_FIELDS]
  return fields.some(name => (values[name] ?? '').trim() !== '')
}

const OPTIONAL_FIELDS: ReadonlyArray<string> = [
  'parent2Email',
  'parent2Phone',
  ...PARENT2_ADDRESS_FIELDS,
  'parent2Country',
  'sourceOther',
]

const FORMAT_CHECKED_FIELDS: ReadonlyArray<string> = Object.keys(
  EMAIL_FORMAT_MESSAGES,
)

/**
 * Whether a field's value would pass the schema's check for it, so an error
 * from the last submit can clear while the parent corrects it. The date of
 * birth has its own check, `checkBirthdate`.
 */
export function isFieldValueValid(
  name: string,
  values: Record<string, string | undefined>,
): boolean {
  const value = (values[name] ?? '').trim()
  if (value === '') {
    // The further guardian's name is needed only while other data is given.
    if (name === 'parent2Name') return !hasParent2Data(values)
    return OPTIONAL_FIELDS.includes(name)
  }
  if (FORMAT_CHECKED_FIELDS.includes(name) && !isEmail(value)) return false
  const maxLength =
    name === 'schoolHistory' ? MAX_SCHOOL_HISTORY_LENGTH : MAX_LINE_LENGTH
  return value.length <= maxLength
}

function isSourceValue(value: string): value is SourceValue {
  return SOURCE_OPTIONS.some(option => option.value === value)
}

export function parseAufnahmeForm(
  raw: Record<string, string>,
):
  | { success: true; data: AufnahmeInput }
  | { success: false; fieldErrors: Record<string, string> } {
  const values: Record<string, string> = {}
  for (const name of AUFNAHME_FIELD_NAMES) values[name] = raw[name] ?? ''

  // The generic keys of one person's fields, e.g. parent1Street -> street.
  const personFields = (prefix: string) => ({
    name: values[`${prefix}Name`] ?? '',
    email: values[`${prefix}Email`] ?? '',
    phone: values[`${prefix}Phone`] ?? '',
    street: values[`${prefix}Street`] ?? '',
    postalCode: values[`${prefix}PostalCode`] ?? '',
    city: values[`${prefix}City`] ?? '',
    country: values[`${prefix}Country`] ?? '',
  })

  const fieldErrors: FieldErrors = {}

  const parent1Fields = personFields('parent1')
  const parent1 = parseSection(
    parent1Schema,
    parent1Fields,
    'parent1',
    fieldErrors,
  )

  const studentFields = personFields('student')
  const student = parseSection(
    studentSchema,
    {
      name: studentFields.name,
      email: studentFields.email,
      birthdate: {
        day: values.studentBirthDay,
        month: values.studentBirthMonth,
        year: values.studentBirthYear,
      },
    },
    'student',
    fieldErrors,
  )

  const studentSameAddress = values.studentSameAddress === 'on'
  const studentAddress = studentSameAddress
    ? undefined
    : parseSection(studentAddressSchema, studentFields, 'student', fieldErrors)

  const school = parseSection(
    schoolSchema,
    {
      currentGrade: values.currentGrade,
      schoolHistory: values.schoolHistory,
    },
    '',
    fieldErrors,
  )

  // While the box is ticked the address fields are hidden, so whatever they
  // still hold is neither validated nor kept.
  const parent2SameAddress = values.parent2SameAddress === 'on'
  const parent2Fields = parent2SameAddress
    ? { ...personFields('parent2'), ...EMPTY_ADDRESS }
    : personFields('parent2')
  const parent2Given = hasParent2Data(values)
  const parent2 = parent2Given
    ? parseSection(parent2Schema, parent2Fields, 'parent2', fieldErrors)
    : undefined

  const sourceValue = isSourceValue(values.source) ? values.source : undefined
  const sourceOther =
    sourceValue === 'anderes'
      ? parseSection(
          sourceOtherSchema,
          { sourceOther: values.sourceOther },
          '',
          fieldErrors,
        )?.sourceOther
      : undefined

  if (
    Object.keys(fieldErrors).length > 0 ||
    !parent1 ||
    !student ||
    !school ||
    (!studentSameAddress && !studentAddress) ||
    (parent2Given && !parent2)
  ) {
    return { success: false, fieldErrors }
  }

  return {
    success: true,
    data: {
      parent1: {
        name: parent1.name,
        email: parent1.email,
        phone: parent1.phone,
        address: {
          street: parent1.street,
          postalCode: parent1.postalCode,
          city: parent1.city,
          country: parent1.country,
        },
      },
      student: {
        name: student.name,
        email: student.email,
        birthdate: student.birthdate,
        sameAddress: studentSameAddress,
        address: studentAddress,
        currentGrade: school.currentGrade,
        schoolHistory: school.schoolHistory,
      },
      parent2: parent2
        ? {
            name: parent2.name,
            email: parent2.email || undefined,
            phone: parent2.phone || undefined,
            sameAddress: parent2SameAddress,
            address: parent2SameAddress ? undefined : optionalAddress(parent2),
          }
        : undefined,
      source: sourceValue
        ? { value: sourceValue, other: sourceOther || undefined }
        : undefined,
    },
  }
}

// A second guardian may leave the address out entirely; the country alone
// does not count, because it is prefilled.
function optionalAddress(fields: Address): Address | undefined {
  if (!fields.street && !fields.postalCode && !fields.city) return undefined
  return {
    street: fields.street,
    postalCode: fields.postalCode,
    city: fields.city,
    country: fields.country,
  }
}

export type Guardian = {
  name: string
  email?: string
  phone?: string
  address?: Address
  sameAddressAsParent1: boolean
}

export type AufnahmeSubmission = {
  parent1: Guardian & { email: string; phone: string; address: Address }
  student: {
    name: string
    email: string
    birthdate: string
    address: Address
    sameAddressAsParent1: boolean
    currentGrade: string
    schoolHistory: string
  }
  parent2?: Guardian
  source?: { label: string; other?: string }
}

export function resolveAddresses(input: AufnahmeInput): AufnahmeSubmission {
  const parent1Address = input.parent1.address

  const studentAddress = input.student.sameAddress
    ? parent1Address
    : input.student.address
  if (!studentAddress) {
    throw new Error('The child address is missing although the box is cleared')
  }

  const sourceOption = input.source
    ? SOURCE_OPTIONS.find(option => option.value === input.source?.value)
    : undefined

  return {
    parent1: { ...input.parent1, sameAddressAsParent1: false },
    student: {
      name: input.student.name,
      email: input.student.email,
      birthdate: input.student.birthdate,
      address: studentAddress,
      sameAddressAsParent1: input.student.sameAddress,
      currentGrade: input.student.currentGrade,
      schoolHistory: input.student.schoolHistory,
    },
    parent2: input.parent2
      ? {
          name: input.parent2.name,
          email: input.parent2.email,
          phone: input.parent2.phone,
          address: input.parent2.sameAddress
            ? parent1Address
            : input.parent2.address,
          sameAddressAsParent1: input.parent2.sameAddress,
        }
      : undefined,
    source:
      input.source && sourceOption
        ? { label: sourceOption.label, other: input.source.other }
        : undefined,
  }
}

export function formatAddress(address: Address): string {
  return [
    address.street,
    [address.postalCode, address.city].filter(Boolean).join(' '),
    address.country,
  ]
    .filter(Boolean)
    .join(', ')
}
