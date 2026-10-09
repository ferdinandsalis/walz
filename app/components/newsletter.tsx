import { CheckCircle, CircleNotch } from '@phosphor-icons/react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useFetcher } from 'react-router'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { useSpinDelay } from 'spin-delay'
import { type action } from '#app/routes/resources+/newsletter.ts'
import { cn } from '#app/utils/misc.tsx'
import { FieldError, FieldLabel } from './form-field.tsx'
import { MailLink } from './mail-link.tsx'
import { Button } from './ui/button.tsx'
import { Input } from './ui/input.tsx'
import { Notice } from './ui/notice.tsx'
import { visibleFocusOutline } from './visible-focus.ts'

// Not `email`: the footer shows on pages that may have their own email field.
const FIELD_ID = 'newsletter-email'
const ERROR_ID = `${FIELD_ID}-error`

const MISSING_ADDRESS = 'Gib deine E-Mail-Adresse ein.'
const MALFORMED_ADDRESS =
  'Gib deine E-Mail-Adresse im Format name@beispiel.at ein.'

export function NewsletterForm() {
  const fetcher = useFetcher<typeof action>()
  const inputRef = useRef<HTMLInputElement>(null)
  const [browserError, setBrowserError] = useState<string>()
  const [submittedEmail, setSubmittedEmail] = useState('')
  // A server-side rejection stays on the field until the reader edits it
  const [editedSinceSubmit, setEditedSinceSubmit] = useState(false)

  const isBusy = fetcher.state !== 'idle'
  const showSpinner = useSpinDelay(isBusy)
  const result = isBusy ? undefined : fetcher.data
  const serverError =
    result?.ok === false && !editedSinceSubmit ? result.reason : undefined
  const error =
    browserError ?? (serverError === 'invalid' ? MALFORMED_ADDRESS : undefined)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const input = inputRef.current
    if (isBusy || !input) {
      event.preventDefault()
      return
    }
    const message = input.validity.valueMissing
      ? MISSING_ADDRESS
      : input.validity.typeMismatch
        ? MALFORMED_ADDRESS
        : undefined
    if (message) {
      event.preventDefault()
      setBrowserError(message)
      input.focus()
      return
    }
    setSubmittedEmail(input.value)
    setEditedSinceSubmit(false)
  }

  return (
    <div className="bg-card flex max-w-xl flex-col gap-4 rounded-md p-6 shadow-md xl:p-8">
      <div className="flex flex-col gap-1">
        <h2 className="font-condensed text-body-md text-secondary-800 font-bold">
          Newsletter
        </h2>
        <p className="text-body-sm/relaxed">
          Neuigkeiten aus der Walz – Termine, Infoabende und Einblicke in den
          Schulalltag, direkt in dein Postfach.
        </p>
      </div>

      {result?.ok === true ? (
        <SubscribedNotice email={submittedEmail} />
      ) : (
        <fetcher.Form
          name="newsletter"
          method="POST"
          action="/resources/newsletter"
          noValidate
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <HoneypotInputs />
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor={FIELD_ID}>E-Mail-Adresse</FieldLabel>
            {error ? <FieldError id={ERROR_ID}>{error}</FieldError> : null}
            <Input
              ref={inputRef}
              id={FIELD_ID}
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="name@beispiel.at"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? ERROR_ID : undefined}
              onChange={() => {
                setBrowserError(undefined)
                setEditedSinceSubmit(true)
              }}
            />
          </div>
          {/* At 20px bold the white label counts as large text, which passes
          3:1 on the orange. */}
          <Button
            type="submit"
            size="lg"
            aria-disabled={isBusy ? true : undefined}
            className={cn(
              'focus-visible:ring-card/20 w-full gap-2 text-[1.25rem] font-bold focus-visible:ring-offset-0 aria-disabled:cursor-wait aria-disabled:opacity-70 sm:w-auto sm:self-start',
              visibleFocusOutline,
            )}
          >
            {showSpinner ? (
              <CircleNotch aria-hidden className="size-5 animate-spin" />
            ) : null}
            Abonnieren
          </Button>
          {/* Always rendered, so screen readers pick up the text change. */}
          <p role="status" className="sr-only">
            {isBusy ? 'Wird gesendet …' : ''}
          </p>
          {serverError === 'unavailable' ? (
            <p
              role="alert"
              className="text-body-sm text-foreground-danger font-medium"
            >
              Das hat leider nicht geklappt. Bitte versuch es später noch einmal
              oder schreib uns an <MailLink address="office@walz.at" />.
            </p>
          ) : null}
        </fetcher.Form>
      )}

      <p className="text-body-xs text-muted-foreground">
        Abmelden geht jederzeit über den Link in jeder Ausgabe. Mehr dazu in
        unserer{' '}
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
      </p>
    </div>
  )
}

function SubscribedNotice({ email }: { email: string }) {
  const ref = useRef<HTMLDivElement>(null)

  // The form it replaces held focus, so focus moves here to have a screen
  // reader announce the confirmation
  useEffect(() => {
    ref.current?.focus()
  }, [])

  return (
    <div ref={ref} tabIndex={-1} className="outline-none">
      <Notice
        icon={CheckCircle}
        title="Danke für deine Anmeldung!"
        titleAs="h3"
      >
        Der nächste Newsletter kommt an{' '}
        <strong className="font-medium break-words">{email}</strong>.
      </Notice>
    </div>
  )
}
