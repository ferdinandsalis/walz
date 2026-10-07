import { Lightbulb } from '@phosphor-icons/react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { MailLink } from '#app/components/mail-link.tsx'
import { Notice } from '#app/components/ui/notice.tsx'
import { StepsPath } from '#app/components/ui/steps-path.tsx'
import { AUFNAHME_STEPS } from '#app/utils/aufnahme-form.ts'

export function meta() {
  return [
    { title: 'Anmeldung erhalten | Walz' },
    { name: 'robots', content: 'noindex' },
  ]
}

/**
 * Confirmation page for the admissions form.
 *
 * This is its own route rather than a `?success=true` flag on the form so the
 * submission is countable: Plausible strips query parameters, so a success
 * flag is indistinguishable from a plain form view. `/aufnahme/formular/danke`
 * is configured as a pageview goal — see docs/analytics-messplan.md.
 */
export const handle = {
  getSitemapEntries: () => null,
}

export default function AufnahmeFormularDanke() {
  const headingRef = useRef<HTMLHeadingElement>(null)

  // The form redirects client-side, so focus moves to the heading to have a
  // screen reader announce the new page
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <div className="flex max-w-xl flex-col gap-6 pb-8">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="font-condensed text-primary text-4xl font-bold outline-none"
      >
        Danke, wir haben Ihre Anmeldung erhalten
      </h1>

      <div className="flex flex-col gap-1">
        <p className="text-body-sm/relaxed">
          Wir haben eine Bestätigung an die angegebenen E-Mail-Adressen
          geschickt.
        </p>
        <p className="text-body-xs text-muted-foreground">
          Keine E-Mail da? Schauen Sie im Spam-Ordner nach oder schreiben Sie an{' '}
          <MailLink address="office@walz.at" />.
        </p>
      </div>

      <StepsPath
        steps={AUFNAHME_STEPS}
        variant="full"
        heading="So geht es weiter"
        className="mt-2"
      />

      <Notice
        icon={Lightbulb}
        title="Für dich bis zum Gespräch"
        titleAs="h2"
        className="text-body-sm/relaxed"
      >
        <p>
          Schicke drei Gründe, warum du in die Walz gehen möchtest, per E-Mail
          an <MailLink address="agnes.chorherr@walz.at" />, und überlege dir
          eine kreative Antwort auf die Frage, was du mit der Walz verbindest.
        </p>
      </Notice>

      <p>
        <Link
          to="/aufnahme"
          className="text-muted-foreground underline underline-offset-2"
        >
          Zurück zur Aufnahme
        </Link>
      </p>
    </div>
  )
}
