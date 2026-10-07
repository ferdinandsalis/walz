import { CircleNotch, Lock, Plus } from '@phosphor-icons/react'
import { captureException } from '@sentry/react-router'
import { isbot } from 'isbot'
import { Fragment, type ReactNode, useEffect, useRef } from 'react'
import {
  type ActionFunctionArgs,
  data,
  Form,
  Link,
  type LoaderFunctionArgs,
  redirect,
  useActionData,
  useNavigation,
} from 'react-router'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { useSpinDelay } from 'spin-delay'
import { Field, FieldGroup, fieldIds } from '#app/components/form-field.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Input } from '#app/components/ui/input.tsx'
import { Label } from '#app/components/ui/label.tsx'
import { Textarea } from '#app/components/ui/textarea.tsx'
import { trackEvent } from '#app/utils/analytics.ts'
import {
  AUFNAHME_FIELD_NAMES,
  AUFNAHME_STEPS,
  type BirthdatePart,
  checkBirthdate,
  DEFAULT_COUNTRY,
  parseAufnahmeForm,
  resolveAddresses,
  SOURCE_OPTIONS,
} from '#app/utils/aufnahme-form.ts'
import {
  sendAufnahmeConfirmationEmail,
  sendAufnahmeNotificationEmail,
} from '#app/utils/email.server.ts'
import { checkHoneypot } from '#app/utils/honeypot.server.ts'

export const SUCCESS_PATH = '/aufnahme/formular/danke'

// The page renders its own <title>, so it can carry an error prefix; an empty
// meta keeps the root "Walz" title from adding a second one.
export function meta() {
  return []
}

export const handle = { hideNewsletter: true }

/**
 * Confirmation used to live at `?success=true`; keep old links working.
 */
export function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  if (url.searchParams.get('success') === 'true') {
    return redirect(SUCCESS_PATH)
  }
  return null
}

export type AufnahmeActionData =
  | { fieldErrors: Record<string, string>; values: Record<string, string> }
  | { formError: 'mail'; values: Record<string, string> }

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()

  // Check for bot user agents
  const userAgent = request.headers.get('user-agent')
  if (userAgent && isbot(userAgent)) {
    throw new Response('Bot detected', { status: 403 })
  }

  // Check honeypot for spam
  await checkHoneypot(formData)

  // Only known fields are read, so the honeypot inputs never echo back.
  const values: Record<string, string> = {}
  for (const name of AUFNAHME_FIELD_NAMES) {
    const value = formData.get(name)
    if (typeof value === 'string') values[name] = value
  }

  const parseResult = parseAufnahmeForm(values)
  if (!parseResult.success) {
    return data<AufnahmeActionData>(
      { fieldErrors: parseResult.fieldErrors, values },
      { status: 400 },
    )
  }

  const submission = resolveAddresses(parseResult.data)

  // The office copy goes first: if it fails nothing was recorded, so the
  // parents must be able to retry instead of getting a confirmation.
  const notificationResult = await sendAufnahmeNotificationEmail(submission)
  if (!notificationResult.success) {
    captureException(
      new Error(
        `Aufnahme notification email failed: ${notificationResult.error}`,
      ),
    )
    return data<AufnahmeActionData>(
      { formError: 'mail', values },
      { status: 502 },
    )
  }

  // The application is recorded at this point, so a failed confirmation is
  // reported but does not turn the submission into an error.
  const confirmationResult = await sendAufnahmeConfirmationEmail(submission)
  if (!confirmationResult.success) {
    captureException(
      new Error(
        `Aufnahme confirmation email failed: ${confirmationResult.error}`,
      ),
    )
  }

  return redirect(SUCCESS_PATH)
}

export default function AufnahmeFormular() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'
  const showSpinner = useSpinDelay(isSubmitting)

  // A failed submit returns the raw values, so every entry, box and reveal is
  // restored, also after a full page reload without JavaScript.
  const values = actionData?.values
  const errors: FieldErrors =
    actionData && 'fieldErrors' in actionData ? actionData.fieldErrors : {}

  const birthdateError = errors.studentBirthdate
    ? {
        message: errors.studentBirthdate,
        parts: invalidBirthdateParts(values),
      }
    : undefined

  const parent2Open =
    PARENT2_DATA_FIELDS.some(name => values?.[name]?.trim()) ||
    Object.keys(errors).some(name => name.startsWith('parent2'))

  // The form is long, so knowing how many people start it but never finish is
  // as interesting as the completions themselves. Fires once per page view.
  const started = useRef(false)
  function handleFirstInput() {
    if (started.current) return
    started.current = true
    trackEvent('Aufnahme Form Start')
  }

  // A failed submission is invisible otherwise: the page neither navigates nor
  // changes its URL, and the mail failure below is reported the same way.
  useEffect(() => {
    if (actionData) trackEvent('Aufnahme Form Error')
  }, [actionData])

  return (
    <div className="flex max-w-xl flex-col gap-6 pb-8">
      <title>Anmeldung | Walz</title>

      <h1 className="font-condensed text-primary text-4xl font-bold">
        Anmeldung für die Walz
      </h1>

      <p className="text-body-sm/relaxed">
        Schön, dass Sie sich für die Walz interessieren. Bitte füllen Sie das
        Formular als Elternteil oder erziehungsberechtigte Person aus, gerne
        gemeinsam mit Ihrem Kind. Es dauert etwa 5 Minuten.
      </p>

      <div className="border-muted bg-card rounded-md border px-4 py-3">
        <h2 className="font-condensed text-body-sm font-bold">
          So geht es weiter
        </h2>
        <ol className="text-body-xs mt-1.5 flex flex-col gap-1">
          {AUFNAHME_STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-2">
              <span className="text-muted-foreground w-3 shrink-0 tabular-nums">
                {index + 1}.
              </span>
              {step.title}
            </li>
          ))}
        </ol>
      </div>

      <p className="text-body-xs text-muted-foreground">
        Felder ohne „optional“ müssen ausgefüllt werden.
      </p>

      <Form
        method="POST"
        noValidate
        onInput={handleFirstInput}
        className="mt-2 flex flex-col gap-12"
      >
        <HoneypotInputs />

        <FormSection number={1} title="Ihre Angaben">
          <Field
            name="parent1Name"
            label="Vor- und Nachname"
            error={errors.parent1Name}
          >
            {control => (
              <Input
                {...control}
                autoComplete="section-parent1 name"
                spellCheck={false}
                required
                defaultValue={values?.parent1Name}
              />
            )}
          </Field>
          <Field name="parent1Email" label="E-Mail" error={errors.parent1Email}>
            {control => (
              <Input
                {...control}
                type="email"
                autoComplete="section-parent1 email"
                spellCheck={false}
                required
                defaultValue={values?.parent1Email}
              />
            )}
          </Field>
          <Field
            name="parent1Phone"
            label="Telefon"
            hint="Wir rufen Sie an, um den Termin für das Aufnahmegespräch zu vereinbaren."
            error={errors.parent1Phone}
          >
            {control => (
              <Input
                {...control}
                type="tel"
                autoComplete="section-parent1 tel"
                required
                defaultValue={values?.parent1Phone}
              />
            )}
          </Field>
          <AddressFields
            person="parent1"
            values={values}
            errors={errors}
            autocompleteSection="section-parent1"
          />
        </FormSection>

        <FormSection number={2} title="Ihr Kind">
          <Field
            name="studentName"
            label="Vor- und Nachname"
            error={errors.studentName}
          >
            {control => (
              <Input
                {...control}
                autoComplete="off"
                spellCheck={false}
                required
                defaultValue={values?.studentName}
              />
            )}
          </Field>
          <Field
            name="studentEmail"
            label="E-Mail Ihres Kindes"
            hint="Ihr Kind bekommt die Bestätigung ebenfalls. Hat es keine eigene Adresse, geben Sie Ihre an."
            error={errors.studentEmail}
          >
            {control => (
              <Input
                {...control}
                type="email"
                autoComplete="off"
                spellCheck={false}
                required
                defaultValue={values?.studentEmail}
              />
            )}
          </Field>
          <BirthdateFields values={values} error={birthdateError} />

          <SubHeading>Wohnadresse</SubHeading>
          {/* The address shows only while the box is cleared; CSS does it, so
              it works before hydration and without JavaScript. */}
          <div className="group/student-address flex flex-col gap-6">
            <SameAddressCheckbox
              name="studentSameAddress"
              hint="Entfernen Sie den Haken, wenn Ihr Kind woanders wohnt."
              defaultChecked={
                values ? values.studentSameAddress === 'on' : true
              }
            />
            <div className="flex flex-col gap-6 group-has-[[name=studentSameAddress]:checked]/student-address:hidden">
              <AddressFields
                person="student"
                values={values}
                errors={errors}
                autocompleteSection="section-student"
              />
            </div>
          </div>

          <SubHeading>Schule</SubHeading>
          <Field
            name="currentGrade"
            label="Derzeitige Klasse / Schulstufe"
            hint="z. B. 4B, 8. Schulstufe"
            error={errors.currentGrade}
          >
            {control => (
              <Input
                {...control}
                required
                defaultValue={values?.currentGrade}
              />
            )}
          </Field>
          <Field
            name="schoolHistory"
            label="Besuchte Schulen nach der Volksschule"
            hint="Mit Ort und Jahren, die derzeitige Schule zuletzt, z. B. MS Lindengasse, Wien (2022–heute)"
            error={errors.schoolHistory}
          >
            {control => (
              <Textarea
                {...control}
                rows={4}
                required
                defaultValue={values?.schoolHistory}
              />
            )}
          </Field>
        </FormSection>

        <FormSection
          number={3}
          title={
            <>
              Weitere erziehungsberechtigte Person{' '}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </>
          }
        >
          {/* A parent may open the native disclosure before hydration; the
              open attribute then differs from the server HTML on purpose. */}
          <details
            open={parent2Open}
            suppressHydrationWarning
            className="group/parent2"
          >
            <summary className="border-input bg-card hover:bg-muted/40 focus-visible:ring-ring flex cursor-pointer list-none items-center gap-3 rounded-md border border-dashed px-4 py-3 font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden [&::-webkit-details-marker]:hidden">
              <Plus
                aria-hidden
                weight="bold"
                className="text-primary size-5 shrink-0 transition-transform group-open/parent2:rotate-45"
              />
              Weitere erziehungsberechtigte Person angeben
            </summary>
            <div className="mt-6 flex flex-col gap-6">
              <Field
                name="parent2Name"
                label="Vor- und Nachname"
                error={errors.parent2Name}
              >
                {control => (
                  <Input
                    {...control}
                    autoComplete="section-parent2 name"
                    spellCheck={false}
                    defaultValue={values?.parent2Name}
                  />
                )}
              </Field>
              <Field
                name="parent2Email"
                label="E-Mail"
                error={errors.parent2Email}
              >
                {control => (
                  <Input
                    {...control}
                    type="email"
                    autoComplete="section-parent2 email"
                    spellCheck={false}
                    defaultValue={values?.parent2Email}
                  />
                )}
              </Field>
              <Field
                name="parent2Phone"
                label="Telefon"
                error={errors.parent2Phone}
              >
                {control => (
                  <Input
                    {...control}
                    type="tel"
                    autoComplete="section-parent2 tel"
                    defaultValue={values?.parent2Phone}
                  />
                )}
              </Field>
              <div className="group/parent2-address flex flex-col gap-6">
                <SameAddressCheckbox
                  name="parent2SameAddress"
                  defaultChecked={values?.parent2SameAddress === 'on'}
                />
                <div className="flex flex-col gap-6 group-has-[[name=parent2SameAddress]:checked]/parent2-address:hidden">
                  <AddressFields
                    person="parent2"
                    values={values}
                    errors={errors}
                    autocompleteSection="section-parent2"
                  />
                </div>
              </div>
            </div>
          </details>
        </FormSection>

        <FormSection number={4} title="Zum Schluss">
          <FieldGroup
            name="source"
            legend="Wie haben Sie von der Walz erfahren? (optional)"
            className="group/source"
          >
            <div className="flex flex-col gap-1">
              {SOURCE_OPTIONS.map(option => (
                <Fragment key={option.value}>
                  <label className="text-body-sm flex cursor-pointer items-center gap-3 py-1.5">
                    <input
                      type="radio"
                      name="source"
                      value={option.value}
                      defaultChecked={values?.source === option.value}
                      className="accent-primary size-5 shrink-0"
                    />
                    {option.label}
                  </label>
                  {option.value === 'anderes' ? (
                    <Field
                      name="sourceOther"
                      label="Woher genau?"
                      error={errors.sourceOther}
                      className="hidden pt-1 pl-8 group-has-[[value=anderes]:checked]/source:flex"
                    >
                      {control => (
                        <Input
                          {...control}
                          defaultValue={values?.sourceOther}
                        />
                      )}
                    </Field>
                  ) : null}
                </Fragment>
              ))}
            </div>
          </FieldGroup>

          <p className="text-body-xs text-muted-foreground flex gap-2">
            <Lock aria-hidden className="mt-0.5 size-4 shrink-0" />
            <span>
              Wir verwenden Ihre Angaben nur für das Aufnahmeverfahren der Walz.
              Kommt kein Schulvertrag zustande, löschen wir sie. Mehr dazu in
              unserer{' '}
              <Link
                to="/datenschutz"
                className="text-foreground underline underline-offset-2"
              >
                Datenschutzerklärung
              </Link>
              .
            </span>
          </p>

          {actionData && 'formError' in actionData ? (
            <div className="rounded-md border border-red-500 bg-red-50 p-4 text-red-900">
              Ihre Anmeldung konnte gerade nicht gesendet werden. Bitte
              versuchen Sie es in ein paar Minuten noch einmal oder schreiben
              Sie an office@walz.at.
            </div>
          ) : null}

          <div className="flex items-center gap-4">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Anmeldung absenden
            </Button>
            {showSpinner && (
              <CircleNotch className="text-secondary animate-spin" />
            )}
          </div>
        </FormSection>
      </Form>
    </div>
  )
}

type FieldErrors = Record<string, string>
type FormValues = Record<string, string> | undefined

// The same fields that make a second guardian "given" in the schema; the
// prefilled country and the checkbox alone keep the section closed.
const PARENT2_DATA_FIELDS = [
  'parent2Name',
  'parent2Phone',
  'parent2Email',
  'parent2Street',
  'parent2PostalCode',
  'parent2City',
]

function invalidBirthdateParts(values: FormValues): BirthdatePart[] {
  const result = checkBirthdate(
    values?.studentBirthDay ?? '',
    values?.studentBirthMonth ?? '',
    values?.studentBirthYear ?? '',
  )
  return result.ok ? ['day', 'month', 'year'] : result.parts
}

// A fieldset per section, so a screen reader names the person behind
// repeated labels such as "Vor- und Nachname".
function FormSection({
  number,
  title,
  children,
}: {
  number: number
  title: ReactNode
  children: ReactNode
}) {
  return (
    <fieldset className="flex min-w-0 flex-col gap-6">
      <legend className="border-muted mb-6 w-full border-t pt-8">
        <h2 className="font-condensed text-h5 flex items-start gap-3">
          <span className="border-primary text-body-sm flex size-8 shrink-0 items-center justify-center rounded-full border-2">
            {number}
          </span>
          <span>{title}</span>
        </h2>
      </legend>
      {children}
    </fieldset>
  )
}

function SubHeading({ children }: { children: ReactNode }) {
  return <h3 className="font-condensed text-h6 -mb-2 pt-2">{children}</h3>
}

function SameAddressCheckbox({
  name,
  hint,
  defaultChecked,
}: {
  name: string
  hint?: string
  defaultChecked: boolean
}) {
  const { hintId } = fieldIds(name)
  return (
    <div className="flex flex-col gap-1">
      <label className="text-body-sm flex cursor-pointer items-center gap-3 font-medium">
        <input
          type="checkbox"
          id={name}
          name={name}
          defaultChecked={defaultChecked}
          aria-describedby={hint ? hintId : undefined}
          className="accent-primary size-5 shrink-0"
        />
        Wohnt an Ihrer Adresse
      </label>
      {hint ? (
        <p id={hintId} className="text-body-xs text-muted-foreground pl-8">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

function AddressFields({
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
      <div className="grid grid-cols-[7rem_minmax(0,1fr)] items-end gap-4">
        {/* No numeric keypad: it would block letters in foreign postcodes. */}
        <Field name={postalCode} label="PLZ" error={errors[postalCode]}>
          {control => (
            <Input
              {...control}
              autoComplete={`${autocompleteSection} postal-code`}
              required={required}
              defaultValue={values?.[postalCode]}
            />
          )}
        </Field>
        <Field name={city} label="Ort" error={errors[city]}>
          {control => (
            <Input
              {...control}
              autoComplete={`${autocompleteSection} address-level2`}
              required={required}
              defaultValue={values?.[city]}
            />
          )}
        </Field>
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

const BIRTHDATE_INPUTS: ReadonlyArray<{
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

function BirthdateFields({
  values,
  error,
}: {
  values: FormValues
  error?: { message: string; parts: BirthdatePart[] }
}) {
  const { errorId } = fieldIds('studentBirthdate')

  return (
    <FieldGroup
      name="studentBirthdate"
      legend="Geburtsdatum"
      hint="z. B. 14 3 2012"
      error={error?.message}
    >
      {/* No maxLength: a pasted "14.03.2012" must reach validation whole. */}
      <div className="flex gap-3">
        {BIRTHDATE_INPUTS.map(input => (
          <div key={input.name} className="flex flex-col gap-1">
            <Label
              htmlFor={input.name}
              className="text-body-xs text-foreground leading-normal"
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
              aria-describedby={error ? errorId : undefined}
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
