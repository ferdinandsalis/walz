import { CircleNotch, Lock, Plus } from '@phosphor-icons/react'
import { captureException } from '@sentry/react-router'
import { isbot } from 'isbot'
import {
  type FocusEvent,
  type FormEvent,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from 'react'
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
import { Field, FieldGroup } from '#app/components/form-field.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { ChoiceCard, ChoiceList } from '#app/components/ui/choice.tsx'
import { Input } from '#app/components/ui/input.tsx'
import { Notice } from '#app/components/ui/notice.tsx'
import { PathMarker, PathRail, RailEnd } from '#app/components/ui/path.tsx'
import { SectionMap } from '#app/components/ui/section-map.tsx'
import { StepsPath } from '#app/components/ui/steps-path.tsx'
import { Textarea } from '#app/components/ui/textarea.tsx'
import { visibleFocusOutline } from '#app/components/visible-focus.ts'
import { trackEvent } from '#app/utils/analytics.ts'
import {
  AUFNAHME_FIELD_NAMES,
  AUFNAHME_STEPS,
  type BirthdatePart,
  hasParent2Data,
  parseAufnahmeForm,
  resolveAddresses,
  type SectionKey,
  SECTIONS,
  type SectionStatus,
  sectionStatus,
  SOURCE_OPTIONS,
} from '#app/utils/aufnahme-form.ts'
import {
  sendAufnahmeConfirmationEmail,
  sendAufnahmeNotificationEmail,
} from '#app/utils/email.server.ts'
import { checkHoneypot } from '#app/utils/honeypot.server.ts'
import { cn } from '#app/utils/misc.tsx'
import {
  ALL_BIRTHDATE_PARTS,
  AddressFields,
  BIRTHDATE_INPUTS,
  BirthdateFields,
  birthdateProblem,
  ErrorSummary,
  errorSummaryEntries,
  type FieldErrors,
  FormSection,
  isBirthdateInput,
  SubHeading,
} from './__formular-parts.tsx'

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
    // Both reports use constant messages: the provider's error text may quote
    // an address from the form, which must not reach Sentry.
    captureException(new Error('Aufnahme notification email failed'))
    return data<AufnahmeActionData>(
      { formError: 'mail', values },
      { status: 502 },
    )
  }

  // The application is recorded at this point, so a failed confirmation is
  // reported but does not turn the submission into an error.
  const confirmationResult = await sendAufnahmeConfirmationEmail(submission)
  if (!confirmationResult.success) {
    captureException(new Error('Aufnahme confirmation email failed'))
  }

  return redirect(SUCCESS_PATH)
}

export default function AufnahmeFormular() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()

  // A failed submit returns the raw values, so every entry, box and reveal is
  // restored, also after a full page reload without JavaScript.
  const values = actionData?.values
  const serverErrors: FieldErrors =
    actionData && 'fieldErrors' in actionData ? actionData.fieldErrors : {}
  const { errors, birthdateError, handleBlur, handleInput } = useFormatChecks(
    actionData,
    serverErrors,
  )

  const formRef = useRef<HTMLFormElement>(null)
  const statuses = useSectionStatuses(formRef, actionData, errors)

  const parent2Open =
    hasParent2Data(values ?? {}) ||
    Object.keys(serverErrors).some(name => name.startsWith('parent2'))

  // The form is long, so knowing how many people start it but never finish is
  // as interesting as the completions themselves. Fires once per page view.
  const started = useRef(false)
  function handleFirstInput() {
    if (started.current) return
    started.current = true
    trackEvent('Aufnahme Form Start')
  }

  // Every action result is a failure, as success redirects. Each new one moves
  // focus to the summary, so a screen reader hears what went wrong. The event
  // makes failures countable: the page neither navigates nor changes its URL.
  const summaryRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!actionData) return
    trackEvent('Aufnahme Form Error', {
      type: 'formError' in actionData ? 'mail' : 'validation',
    })
    summaryRef.current?.focus()
  }, [actionData])

  // The button stays enabled, so it keeps focus; this guard drops the clicks
  // that land while a submission is in flight. A ref, because the navigation
  // state reaches the component only after a render.
  const isBusy = navigation.state !== 'idle'
  const showSpinner = useSpinDelay(isBusy)
  const submissionInFlight = useRef(false)
  useEffect(() => {
    if (navigation.state === 'idle') submissionInFlight.current = false
  }, [navigation.state, actionData])
  function guardSubmit(event: FormEvent<HTMLFormElement>) {
    if (submissionInFlight.current) {
      event.preventDefault()
      return
    }
    submissionInFlight.current = true
  }

  return (
    <div className="grid grid-cols-subgrid items-start gap-8 lg:col-span-2">
      <div className="flex max-w-xl flex-col gap-6 pb-8">
        <title>
          {actionData ? 'Fehler: Anmeldung | Walz' : 'Anmeldung | Walz'}
        </title>

        <h1 className="font-condensed text-primary text-4xl font-bold">
          Anmeldung für die Walz
        </h1>

        <p className="text-body-sm/relaxed">
          Schön, dass Sie sich für die Walz interessieren. Bitte füllen Sie das
          Formular als Elternteil oder erziehungsberechtigte Person aus. Es
          dauert etwa 5 Minuten.
        </p>

        <StepsPath
          steps={AUFNAHME_STEPS}
          variant="compact"
          heading="So geht es weiter"
        />

        <p className="text-body-xs text-muted-foreground">
          Felder ohne „optional“ müssen ausgefüllt werden.
        </p>

        {actionData ? (
          <ErrorSummary
            ref={summaryRef}
            errors={errorSummaryEntries(serverErrors, values)}
            formError={
              'formError' in actionData ? actionData.formError : undefined
            }
          />
        ) : null}

        <Form
          ref={formRef}
          method="POST"
          noValidate
          onSubmit={guardSubmit}
          onInput={event => {
            handleFirstInput()
            handleInput(event)
          }}
          onBlur={handleBlur}
        >
          <HoneypotInputs />

          {/* One path runs through all sections and ends at the submit. */}
          <PathRail className="flex flex-col gap-12">
            <FormSection section="parent1" status={statuses.parent1}>
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
              <Field
                name="parent1Email"
                label="E-Mail"
                error={errors.parent1Email}
              >
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

            <FormSection section="student" status={statuses.student}>
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
                <ChoiceCard
                  name="studentSameAddress"
                  label="Wohnt an Ihrer Adresse"
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
                label="Bisher besuchte Schulen"
                hint="Alle Schulen nach der Volksschule, mit Ort und Jahren, die derzeitige zuletzt, z. B. MS Lindengasse, Wien (2022–heute)"
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

            <FormSection section="parent2" status={statuses.parent2} optional>
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
                    <ChoiceCard
                      name="parent2SameAddress"
                      label="Wohnt an Ihrer Adresse"
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

            <FormSection section="final" status={statuses.final}>
              <FieldGroup
                name="source"
                legend="Wie haben Sie von der Walz erfahren? (optional)"
                className="group/source"
              >
                <ChoiceList
                  name="source"
                  defaultValue={values?.source}
                  options={SOURCE_OPTIONS.map(option => ({
                    ...option,
                    after:
                      option.value === 'anderes' ? (
                        // Indented under the option's label text.
                        <Field
                          name="sourceOther"
                          label="Woher genau?"
                          error={errors.sourceOther}
                          className="hidden pr-3.5 pb-3 pl-[2.875rem] group-has-[[value=anderes]:checked]/source:flex"
                        >
                          {control => (
                            <Input
                              {...control}
                              defaultValue={values?.sourceOther}
                            />
                          )}
                        </Field>
                      ) : undefined,
                  }))}
                />
              </FieldGroup>

              <Notice icon={Lock} className="text-body-xs/relaxed">
                Wir verwenden Ihre Angaben nur für das Aufnahmeverfahren der
                Walz. Kommt kein Schulvertrag zustande, löschen wir sie. Mehr
                dazu in unserer{' '}
                <Link
                  to="/datenschutz"
                  className={cn(
                    'text-foreground underline underline-offset-2',
                    visibleFocusOutline,
                  )}
                >
                  Datenschutzerklärung
                </Link>
                .
              </Notice>

              {/* The path ends in a dot beside the button. */}
              <div className="relative flex">
                <RailEnd className="top-1/2" />
                <PathMarker className="h-full">
                  <span className="bg-path-done size-3 rounded-full ring-4 ring-(color:--path-gap)" />
                </PathMarker>
                {/* At 20px bold the white label counts as large text, which
                passes 3:1 on the orange. */}
                <Button
                  type="submit"
                  size="lg"
                  aria-disabled={isBusy ? true : undefined}
                  className={cn(
                    'w-full gap-2 text-[1.25rem] font-bold aria-disabled:cursor-wait aria-disabled:opacity-70 sm:w-auto',
                    visibleFocusOutline,
                  )}
                >
                  {showSpinner ? (
                    <CircleNotch aria-hidden className="size-5 animate-spin" />
                  ) : null}
                  Anmeldung absenden
                </Button>
              </div>
              {/* Always rendered, so screen readers pick up the text change. */}
              <p role="status" className="sr-only">
                {isBusy ? 'Wird gesendet …' : ''}
              </p>
            </FormSection>
          </PathRail>
        </Form>
      </div>

      {/* After the form, so a screen reader meets it last; the grid places it
      in the site's right column. */}
      <SectionMap
        sections={SECTIONS.map(section => ({
          ...section,
          state: statuses[section.key],
        }))}
        className="hidden lg:sticky lg:top-4 lg:col-start-2 lg:row-start-1 lg:block"
      />
    </div>
  )
}

/**
 * What the checks found for a field since the last submit: a message to show,
 * or null once the value is valid, which hides the server's error. A field
 * without an entry shows the server's error, if any.
 */
type ClientCheck = { message: string; parts?: BirthdatePart[] } | null

/**
 * Checks while the parent fills in the form, merged over the errors of the
 * last submit. They parse the form like the submit does, so both always agree.
 * Empty required fields are left to the submit.
 */
function useFormatChecks(
  actionData: AufnahmeActionData | undefined,
  serverErrors: FieldErrors,
) {
  // The checks belong to one action result; a new result starts afresh, so a
  // check made before it cannot hide one of its errors.
  const [state, setState] = useState<{
    actionData: AufnahmeActionData | undefined
    checks: Record<string, ClientCheck | undefined>
  }>({ actionData, checks: {} })
  const checks = state.actionData === actionData ? state.checks : {}

  function setChecks(update: Record<string, ClientCheck | undefined>) {
    setState(current => ({
      actionData,
      checks: {
        ...(current.actionData === actionData ? current.checks : {}),
        ...update,
      },
    }))
  }

  const errors: FieldErrors = { ...serverErrors }
  for (const [name, check] of Object.entries(checks)) {
    if (check === null) delete errors[name]
    else if (check) errors[name] = check.message
  }

  const birthdateError = errors.studentBirthdate
    ? {
        message: errors.studentBirthdate,
        parts:
          checks.studentBirthdate?.parts ??
          birthdateProblem(actionData?.values)?.parts ??
          ALL_BIRTHDATE_PARTS,
      }
    : undefined

  // Email fields are checked on leaving them; the date group once focus
  // leaves all three of its inputs, so moving from Tag to Monat is quiet.
  function handleBlur(event: FocusEvent<HTMLFormElement>) {
    const input = event.target
    if (!(input instanceof HTMLInputElement)) return

    if (input.type === 'email') {
      const message = currentFieldErrors(input.form)[input.name]
      if (input.value.trim() === '') {
        // An empty required email is left to the submit; an optional one is
        // valid.
        setChecks({ [input.name]: message ? undefined : null })
      } else {
        setChecks({ [input.name]: message ? { message } : null })
      }
    } else if (isBirthdateInput(input.name)) {
      if (input.closest('fieldset')?.contains(event.relatedTarget)) return
      const values = formValues(input.form)
      const allEmpty = BIRTHDATE_INPUTS.every(
        ({ name }) => (values[name] ?? '').trim() === '',
      )
      setChecks({
        studentBirthdate: allEmpty
          ? undefined
          : (birthdateProblem(values) ?? null),
      })
    }
  }

  // While typing, an error only ever clears, once a submit would no longer
  // report it. Every shown error is checked, as an entry can settle another
  // field's error: emptying the further guardian's section makes the name
  // optional again.
  function handleInput(event: FormEvent<HTMLFormElement>) {
    const input = event.target
    if (
      !(input instanceof HTMLInputElement) &&
      !(input instanceof HTMLTextAreaElement)
    ) {
      return
    }
    const fieldErrors = currentFieldErrors(input.form)
    const settled = Object.keys(errors).filter(name => !(name in fieldErrors))
    if (settled.length > 0) {
      setChecks(Object.fromEntries(settled.map(name => [name, null])))
    }
  }

  return { errors, birthdateError, handleBlur, handleInput }
}

/**
 * Each section's status for its node on the path. Until the form is mounted,
 * and so without JavaScript, it follows the submitted values. Then it follows
 * the form's own values, which include restored and autofilled entries.
 */
function useSectionStatuses(
  formRef: RefObject<HTMLFormElement | null>,
  actionData: AufnahmeActionData | undefined,
  errors: FieldErrors,
): Record<SectionKey, SectionStatus> {
  const [liveValues, setLiveValues] = useState<Record<string, string> | null>(
    null,
  )
  useEffect(() => {
    const form = formRef.current
    if (!form) return
    const update = () => setLiveValues(formValues(form))
    update()
    form.addEventListener('input', update)
    form.addEventListener('change', update)
    return () => {
      form.removeEventListener('input', update)
      form.removeEventListener('change', update)
    }
  }, [formRef])

  const values = liveValues ?? actionData?.values ?? {}
  return Object.fromEntries(
    SECTIONS.map(({ key }) => [key, sectionStatus(key, values, errors)]),
  ) as Record<SectionKey, SectionStatus>
}

function formValues(form: HTMLFormElement | null) {
  const values: Record<string, string> = {}
  if (!form) return values
  for (const [name, value] of new FormData(form)) {
    if (typeof value === 'string') values[name] = value
  }
  return values
}

// The errors a submit of the form's current values would get.
function currentFieldErrors(form: HTMLFormElement | null): FieldErrors {
  const result = parseAufnahmeForm(formValues(form))
  return result.success ? {} : result.fieldErrors
}
