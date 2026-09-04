import { Link } from 'react-router'

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
  return (
    <div className="px-4 py-8">
      <h1 className="font-condensed text-primary mb-8 text-4xl font-bold">
        Aufnahmeformular
      </h1>

      <div className="rounded-md border border-green-500/50 bg-green-50 p-4">
        <h2 className="mb-2 font-bold text-green-500">
          Vielen Dank für Ihre Anmeldung!
        </h2>
        <p className="text-green-500">
          Sie erhalten in Kürze eine Bestätigungs-E-Mail mit weiteren
          Informationen zum Aufnahmegespräch.
        </p>
      </div>

      <p className="mt-8">
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
