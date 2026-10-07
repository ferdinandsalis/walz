import { WarningCircle } from '@phosphor-icons/react'
import { type MouseEvent, type ReactNode, type Ref } from 'react'
import {
  controlProps,
  describedByIds,
  Field,
  FieldError,
  FieldGroup,
  fieldIds,
  FieldLabel,
} from '#app/components/form-field.tsx'
import { MailLink } from '#app/components/mail-link.tsx'
import { Input } from '#app/components/ui/input.tsx'
import { Label } from '#app/components/ui/label.tsx'
import { PathMarker, PathNode, Waypoint } from '#app/components/ui/path.tsx'
import { visibleFocusOutline } from '#app/components/visible-focus.ts'
import {
  AUFNAHME_FIELD_NAMES,
  type BirthdatePart,
  checkBirthdate,
  DEFAULT_COUNTRY,
  type SectionKey,
  SECTIONS,
  type SectionStatus,
  sectionOf,
} from '#app/utils/aufnahme-form.ts'
import { cn } from '#app/utils/misc.tsx'

/*
  The presentational parts of the Aufnahme form: its sections, the address and
  date fields, and the error summary, with the helpers they share with the
  route.
*/

export type FieldErrors = Record<string, string>
export type FormValues = Record<string, string> | undefined

export const BIRTHDATE_INPUTS: ReadonlyArray<{
  part: BirthdatePart
  name: string
  label: string
  className: string
}> = [
  { part: 'day', name: 'studentBirthDay', label: 'Tag', className: 'w-16' },
  {
    part: 'month',
    name: 'studentBirthMonth',
    label: 'Monat',
    className: 'w-16',
  },
  { part: 'year', name: 'studentBirthYear', label: 'Jahr', className: 'w-24' },
]

export const ALL_BIRTHDATE_PARTS = BIRTHDATE_INPUTS.map(({ part }) => part)

function birthdateInputName(part: BirthdatePart) {
  return BIRTHDATE_INPUTS.find(input => input.part === part)!.name
}

export function isBirthdateInput(name: string) {
  return BIRTHDATE_INPUTS.some(input => input.name === name)
}

// The date's error with the parts it concerns, which the field errors of the
// parse do not name; undefined for a valid date.
export function birthdateProblem(values: FormValues) {
  const result = checkBirthdate(
    values?.studentBirthDay ?? '',
    values?.studentBirthMonth ?? '',
    values?.studentBirthYear ?? '',
  )
  return result.ok
    ? undefined
    : { message: result.message, parts: result.parts }
}

type ErrorSummaryEntry = {
  fieldId: string
  message: string
  section: SectionKey | undefined
}

// The date group has one error; it links to the first of its wrong inputs.
const SUMMARY_ORDER = AUFNAHME_FIELD_NAMES.map(name =>
  isBirthdateInput(name) ? 'studentBirthdate' : name,
)

export function errorSummaryEntries(
  fieldErrors: FieldErrors,
  values: FormValues,
): ErrorSummaryEntry[] {
  // An error for an unlisted field still shows, at the end.
  const position = (name: string) => {
    const index = SUMMARY_ORDER.indexOf(name)
    return index === -1 ? SUMMARY_ORDER.length : index
  }
  return Object.entries(fieldErrors)
    .sort(([a], [b]) => position(a) - position(b))
    .map(([name, message]) => ({
      fieldId:
        name === 'studentBirthdate'
          ? birthdateInputName(birthdateProblem(values)?.parts[0] ?? 'day')
          : name,
      message,
      section: sectionOf(name),
    }))
}

// The entries by section, in page order. Entries outside every section close
// the list, in a group without a label.
function errorSummaryGroups(entries: ErrorSummaryEntry[]) {
  const groups = [
    ...SECTIONS.map(section => ({
      key: section.key,
      section,
      entries: entries.filter(entry => entry.section === section.key),
    })),
    {
      key: 'other',
      section: undefined,
      entries: entries.filter(entry => entry.section === undefined),
    },
  ]
  return groups.filter(group => group.entries.length > 0)
}

// Without JavaScript the link jumps to the input. With it, the input also
// gets focus, a closed further-guardian section opens first, and the label
// scrolls into view above the input, so the question stays readable.
function focusField(event: MouseEvent<HTMLAnchorElement>, fieldId: string) {
  const input = document.getElementById(fieldId)
  if (!input) return
  event.preventDefault()

  const details = input.closest('details')
  if (details && !details.open) details.open = true

  const caption = isBirthdateInput(fieldId)
    ? input.closest('fieldset')?.querySelector(':scope > legend')
    : document.querySelector(`label[for="${fieldId}"]`)
  ;(caption ?? input).scrollIntoView()
  input.focus({ preventScroll: true })
}

export function ErrorSummary({
  ref,
  errors,
  formError,
}: {
  ref: Ref<HTMLDivElement>
  errors: ErrorSummaryEntry[]
  formError?: 'mail'
}) {
  return (
    <div
      ref={ref}
      id="aufnahme-errors"
      tabIndex={-1}
      className={cn(
        'border-foreground-danger bg-card rounded-md border-2 p-4 focus:outline-hidden',
        visibleFocusOutline,
      )}
    >
      <div role="alert">
        {formError === 'mail' ? (
          <p className="text-body-sm flex items-start gap-2 font-medium">
            <WarningCircle
              aria-hidden
              weight="fill"
              className="text-foreground-danger mt-0.5 size-5 shrink-0"
            />
            <span>
              Ihre Anmeldung konnte gerade nicht gesendet werden. Bitte
              versuchen Sie es in ein paar Minuten noch einmal oder schreiben
              Sie an <MailLink address="office@walz.at" />.
            </span>
          </p>
        ) : (
          <>
            <h2 className="font-condensed text-h5 flex items-start gap-2">
              <WarningCircle
                aria-hidden
                weight="fill"
                className="text-foreground-danger mt-1.5 size-5 shrink-0"
              />
              {errors.length === 1
                ? 'Bitte prüfen Sie 1 Angabe'
                : `Bitte prüfen Sie ${errors.length} Angaben`}
            </h2>
            {/* The section labels are plain text, so the count stays the
                summary's only heading. */}
            <ul className="mt-3 flex flex-col gap-3">
              {errorSummaryGroups(errors).map(group => (
                <li key={group.key} className="flex flex-col gap-1.5">
                  {group.section ? (
                    // In line with the heading's text and the links.
                    <p className="font-condensed text-body-sm pl-7 font-bold">
                      {group.section.title}
                    </p>
                  ) : null}
                  <ul className="flex flex-col gap-2 pl-7">
                    {group.entries.map(error => (
                      <li key={error.fieldId}>
                        <a
                          href={`#${error.fieldId}`}
                          onClick={event => focusField(event, error.fieldId)}
                          className={cn(
                            'text-body-sm text-foreground-danger font-medium underline underline-offset-2',
                            visibleFocusOutline,
                          )}
                        >
                          {error.message}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

// A fieldset per section, so a screen reader names the person behind
// repeated labels such as "Vor- und Nachname". Its node on the path shows the
// section's status; the node is decoration, as the fields and the error
// summary say the same.
export function FormSection({
  section,
  status,
  optional = false,
  children,
}: {
  section: SectionKey
  status: SectionStatus
  optional?: boolean
  children: ReactNode
}) {
  const { id, number, title } = SECTIONS.find(({ key }) => key === section)!
  return (
    <fieldset id={id} className="flex min-w-0 flex-col gap-6">
      <legend className="mb-6 w-full">
        <h2 className="font-condensed text-h5 relative">
          <PathMarker>
            <PathNode state={status} number={number} />
          </PathMarker>
          {title}
          {optional ? (
            <>
              {' '}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </>
          ) : null}
        </h2>
      </legend>
      {children}
    </fieldset>
  )
}

export function SubHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-condensed text-h6 relative mt-2 -mb-2">
      <Waypoint />
      {children}
    </h3>
  )
}

export function AddressFields({
  person,
  values,
  errors,
  autocompleteSection,
}: {
  person: 'parent1' | 'student' | 'parent2'
  values: FormValues
  errors: FieldErrors
  autocompleteSection: string
}) {
  // The further guardian's address stays optional.
  const required = person !== 'parent2'
  const street = `${person}Street`
  const postalCode = `${person}PostalCode`
  const city = `${person}City`
  const country = `${person}Country`

  return (
    <>
      <Field
        name={street}
        label="Straße und Hausnummer"
        hint="Mit Stiege und Tür, z. B. Lindengasse 12/2/14"
        error={errors[street]}
      >
        {control => (
          <Input
            {...control}
            autoComplete={`${autocompleteSection} address-line1`}
            required={required}
            defaultValue={values?.[street]}
          />
        )}
      </Field>
      {/* PLZ and Ort share a row, with their errors in a full-width row
          between the labels and the inputs, so a message does not wrap in the
          narrow PLZ column and the two fields stay aligned. */}
      <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-x-4 gap-y-1.5">
        <FieldLabel htmlFor={postalCode}>PLZ</FieldLabel>
        <FieldLabel htmlFor={city}>Ort</FieldLabel>
        {errors[postalCode] || errors[city] ? (
          <div className="col-span-2 flex flex-col gap-1.5">
            {[postalCode, city].map(name =>
              errors[name] ? (
                <FieldError key={name} id={fieldIds(name).errorId}>
                  {errors[name]}
                </FieldError>
              ) : null,
            )}
          </div>
        ) : null}
        {/* No numeric keypad: it would block letters in foreign postcodes. */}
        <Input
          {...controlProps(postalCode, undefined, errors[postalCode])}
          autoComplete={`${autocompleteSection} postal-code`}
          required={required}
          defaultValue={values?.[postalCode]}
        />
        <Input
          {...controlProps(city, undefined, errors[city])}
          autoComplete={`${autocompleteSection} address-level2`}
          required={required}
          defaultValue={values?.[city]}
        />
      </div>
      <Field name={country} label="Land" error={errors[country]}>
        {control => (
          <Input
            {...control}
            autoComplete={`${autocompleteSection} country-name`}
            required={required}
            defaultValue={values?.[country] ?? DEFAULT_COUNTRY}
          />
        )}
      </Field>
    </>
  )
}

export function BirthdateFields({
  values,
  error,
}: {
  values: FormValues
  error?: { message: string; parts: BirthdatePart[] }
}) {
  const hint = 'z. B. 14 3 2012'
  // Each input names the hint and the error itself, so they are read when a
  // single input takes focus, not only on entering the group.
  const describedBy = describedByIds('studentBirthdate', hint, error?.message)

  return (
    <FieldGroup
      name="studentBirthdate"
      legend="Geburtsdatum"
      hint={hint}
      error={error?.message}
      descriptionOnInputs
    >
      {/* No maxLength: a pasted "14.03.2012" must reach validation whole.
          The row wraps on a narrow or zoomed screen. */}
      <div className="flex flex-wrap gap-3">
        {BIRTHDATE_INPUTS.map(input => (
          <div key={input.name} className="flex flex-col gap-1">
            <Label
              htmlFor={input.name}
              className="text-body-sm text-foreground leading-normal"
            >
              {input.label}
            </Label>
            <Input
              id={input.name}
              name={input.name}
              inputMode="numeric"
              autoComplete="off"
              required
              defaultValue={values?.[input.name]}
              aria-describedby={describedBy}
              aria-invalid={
                error?.parts.includes(input.part) ? true : undefined
              }
              className={input.className}
            />
          </div>
        ))}
      </div>
    </FieldGroup>
  )
}
