import { DownloadSimple, ArrowSquareOut, Info } from '@phosphor-icons/react'
import { loadQuery } from '@sanity/react-loader'
import { type ReactNode } from 'react'
import { Link, useLoaderData } from 'react-router'
import { type PageTitleHandle } from '#app/components/page-title.tsx'
import { PageHead, TocRail, type TocSection } from '#app/components/toc.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Divider } from '#app/components/ui/divider.tsx'
import { Notice } from '#app/components/ui/notice.tsx'
import {
  PathMarker,
  PathNode,
  PathRail,
  RailEnd,
} from '#app/components/ui/path.tsx'
import { trackEvent } from '#app/utils/analytics.ts'
import { AUFNAHME_STEPS } from '#app/utils/aufnahme-form.ts'
import {
  type AufnahmeQuery,
  AufnahmeQuerySchema,
  aufnahmeQuery,
} from './_index.query.ts'

export const handle: PageTitleHandle = { pageTitle: 'Aufnahme' }

export function meta() {
  return [{ title: 'Aufnahme | Walz' }]
}

export async function loader() {
  // en-CA locale produces YYYY-MM-DD format needed for Sanity date comparison
  const today = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Europe/Vienna',
  })
  const queryResult = await loadQuery<AufnahmeQuery>(aufnahmeQuery, { today })
  return AufnahmeQuerySchema.parse(queryResult.data)
}

const sections: TocSection[] = [
  { name: 'Vorgehensweise', id: 'vorgehensweise' },
  { name: 'Voraussetzungen', id: 'voraussetzungen' },
  { name: 'Kosten', id: 'kosten' },
  { name: 'Stipendien', id: 'stipendien' },
]

export default function Aufnahme() {
  const loaderData = useLoaderData<typeof loader>()
  const current = loaderData.currentSchoolYear

  return (
    <div className="relative grid grid-cols-subgrid items-start gap-8 lg:col-span-2">
      <PageHead sections={sections} />

      <TocRail
        sections={sections}
        className="hidden lg:sticky lg:top-4 lg:z-20 lg:col-start-2 lg:row-start-2 lg:grid"
      />

      <div className="col-start-1 grid grid-cols-12 gap-x-4 gap-y-16 sm:gap-x-6 lg:gap-x-8">
        <article id="vorgehensweise" className="col-span-12 space-y-8">
          <h1 className="font-condensed text-primary mb-8 text-4xl font-bold">
            Vorgehensweise
          </h1>
          <AdmissionSteps />
        </article>

        <Divider className="col-span-12" />

        <article id="voraussetzungen" className="col-span-12 space-y-8">
          <h1 className="font-condensed text-primary text-4xl font-bold">
            Voraussetzungen
          </h1>
          <div className="max-w-prose space-y-4 text-base md:text-xl">
            <p>
              Der Besuch der Walz beginnt mit der 9. Schulstufe, d.h.
              Jugendliche, die auf die Walz kommen möchten, müssen zum Zeitpunkt
              der Anmeldung die 8. Schulstufe besuchen und sie im selben Jahr
              positiv abschließen (keine Aufstiegsklausel).
            </p>
            <p>
              Alle wichtigen Informationen und Rahmenbedingungen sind in unserem
              Schulvertrag zusammengefasst.{' '}
              <a
                download="Schulvertrag September 2027.pdf"
                href="/downloads/schulvertrag_september_2027.pdf"
                className="inline-flex items-center gap-1 underline underline-offset-2"
              >
                Hier herunterladen
                <DownloadSimple size={16} className="text-primary flex-none" />
              </a>
            </p>
          </div>

          <section>
            <h2 className="font-condensed text-h5 md:text-h4 mb-4 font-bold">
              Quereinstieg
            </h2>
            <div className="max-w-prose space-y-4 text-base md:text-xl">
              <p>
                Grundsätzlich ist ein Quereinstieg in den ersten 3 Walzjahren
                möglich (9., 10., 11. Schulstufe). Wenn du dich für einen
                Quereinstieg interessierst, fülle bitte das Anmeldeformular aus
                und wir melden uns für einen persönlichen Vorstellungstermin,
                bei dem auch deine Eltern dabei sein sollen.
              </p>
            </div>
          </section>

          <LateralEntryBox />
        </article>

        <Divider className="col-span-12" />

        <article id="kosten" className="col-span-12 space-y-8">
          <h1 className="font-condensed text-primary mb-8 text-4xl font-bold">
            Kosten und Finanzierung
          </h1>
          <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
            <p>
              Die Walz ist ein gemeinnütziger Verein und finanziert sich zu
              einem großen Teil (über 90%) selbst. Wir müssen, um unsere Kosten
              decken zu können, Schulgeld einheben.
            </p>
            <p>
              Während bei konfessionellen Privatschulen die Personalkosten (also
              80&ndash;90% der Gesamtkosten) von der öffentlichen Hand
              übernommen werden, müssen Privatschulen (ohne kirchlichem Träger)
              für alle Kosten selbst aufkommen. Die einzige Förderung, welche
              die Walz, so wie alle anderen Privatschulen in freier
              Trägerschaft, im Moment vom Bildungsministerium erhält, hat eine
              Höhe von ca. € 700,&ndash; pro Jahr pro Schüler:in. Die Walz muss
              sich daher durch die Beiträge der Eltern finanzieren.
            </p>
            <p>
              Wir bemühen uns sehr, die Kosten so niedrig wie möglich zu halten.
              Zum Vergleich betragen laut{' '}
              <abbr title="Organisation for Economic Co-operation and Development">
                OECD
              </abbr>{' '}
              die Kosten der öffentlichen Schule für die Sekundarstufe €
              15.729,&ndash; pro Jahr (letzter verfügbarer Wert aus dem Jahr
              2019).
            </p>
          </div>
          <h2 className="font-condensed text-h5 md:text-h4 font-bold">
            Beiträge Schuljahr {current?.start.getFullYear()}/
            {current?.end.getFullYear().toString().slice(-2)}
          </h2>
          <dl className="divide-border border-border max-w-prose divide-y border-y">
            {current?.costs.list.map(cost => (
              // Phones show the amount under the title, wider screens beside
              // it, so the description keeps the full width.
              <div
                key={cost.title}
                className="grid gap-x-8 gap-y-2 py-6 sm:grid-cols-[1fr_auto]"
              >
                <dt className="font-condensed text-h5 font-bold">
                  {cost.title}
                </dt>
                <dd className="flex flex-wrap items-baseline gap-x-2 sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:flex-col sm:items-end">
                  <span className="font-condensed text-h5 font-bold">
                    {Intl.NumberFormat('de-AT', {
                      style: 'currency',
                      currency: 'EUR',
                      maximumFractionDigits: 0,
                      signDisplay: 'never',
                    }).format(cost.cost)}
                  </span>
                  <span className="text-muted-foreground text-body-sm">
                    {cost.interval === 'ONCE'
                      ? `Einmalig`
                      : `${cost.quantity} × im Jahr`}
                  </span>
                </dd>
                <dd className="text-base md:text-xl">{cost.description}</dd>
              </div>
            ))}
          </dl>
        </article>

        <Divider className="col-span-12" />

        <article id="stipendien" className="col-span-12 space-y-8">
          <h1 className="font-condensed text-primary mb-8 text-4xl font-bold">
            Stipendien
          </h1>
          <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
            <p>
              Durch private Sponsoren und der Initiative{' '}
              <Link
                to="/alumni#ehrensache"
                className="underline underline-offset-2"
              >
                „Ehrensache Walz"
              </Link>{' '}
              steht der Walz ein gewisser Betrag für Stipendien zur Verfügung.
              Dieser Betrag wird auf mehrere Jugendliche aufgeteilt. Im
              Bedarfsfall kann ein Antrag (inkl. Einkommensnachweise und
              Begründung) gestellt werden.
            </p>
            <p>
              Hierfür melde dich mit deiner Anfrage bitte an{' '}
              <a
                href="mailto:office@walz.at"
                className="underline underline-offset-2"
              >
                office@walz.at
              </a>
              .
            </p>
          </div>
        </article>
        <Divider className="col-span-12 bg-transparent" />
      </div>
    </div>
  )
}

/** What happens at each admission step, keyed by its title. */
const admissionStepTexts: Record<string, ReactNode> = {
  'Anmeldung absenden': (
    <>
      <p>
        Wenn du dich an der Walz bewerben willst, fülle bitte das
        Anmeldeformular aus.
      </p>
      <p>
        Nach Absenden des Formulars senden wir dir und deinen Eltern eine
        Bestätigung per Mail mit Details zum Aufnahmetermin zu.
      </p>
      <AdmissionDay />
    </>
  ),
  'Anruf von der Walz': (
    <p>
      Für den neuen Jahrgang beginnen wir ab Mitte November (nach dem Tag der
      offenen Tür) das Aufnahmeverfahren. Dafür melden wir uns telefonisch bei
      deinen Eltern, um einen Aufnahmetermin zu vereinbaren.
    </p>
  ),
  Aufnahmegespräch: (
    <p>
      Bei dem persönlichen Aufnahmegespräch mit der Schulleiterin und dem/der
      Mentor:in werden die gegenseitigen Erwartungen abgeklärt und bei kleinen
      Aufgaben bekommst du einen ersten Einblick in die Arbeitsweise der Walz.
      Wir bitten deine Eltern, zum Aufnahmetermin mitzukommen.
    </p>
  ),
  'Zu- oder Absage': (
    <p>
      Ab Jänner erhalten du und deine Eltern eine Zu- oder Absage. Wenn ihr euch
      für die Walz entscheidet, ist dein Platz fix reserviert, sobald der
      Schulvertrag unterschrieben und der Aufnahmebeitrag eingezahlt ist.
    </p>
  ),
}

/**
 * The admission steps on the Lernpfad, each numbered, with its title as a
 * heading and its text below. The titles are the ones the form and the
 * confirmation page show. From xl the path hangs in the left margin, as it
 * does there.
 */
function AdmissionSteps() {
  return (
    <PathRail dashed hanging>
      {/* Safari drops the list role from a list without bullets. */}
      <ol
        role="list"
        aria-label="Aufnahmeprozess"
        className="flex flex-col gap-12"
      >
        {AUFNAHME_STEPS.map((step, index) => (
          <li
            key={step.title}
            // The title's size sets the line height that centres the node on
            // the title (`lh`).
            className="text-h5 md:text-h4 relative"
          >
            {index === AUFNAHME_STEPS.length - 1 ? <RailEnd /> : null}
            <PathMarker>
              <PathNode state="open" number={index + 1} />
            </PathMarker>
            <h2 className="font-condensed font-bold">{step.title}</h2>
            <div className="mt-3 max-w-prose space-y-4 text-base font-normal md:text-xl">
              {admissionStepTexts[step.title]}
            </div>
          </li>
        ))}
      </ol>
    </PathRail>
  )
}

function AdmissionDay() {
  return (
    <Notice icon={Info} className="max-w-lg">
      <div className="text-body-sm/normal space-y-4">
        <p>
          Für einen Aufnahmetermin für den Jahrgang Zeta (9. Schulstufe,
          Schulbeginn September 2027) fülle das Aufnahmeformular aus. Weitere
          Infos folgen per Mail.
        </p>
        <Button asChild>
          <Link
            to="/aufnahme/formular"
            onClick={() =>
              trackEvent('Aufnahme CTA', { position: 'aufnahme-box' })
            }
          >
            Zum Anmeldeformular
          </Link>
        </Button>
      </div>
    </Notice>
  )
}

function LateralEntryBox() {
  return (
    <Notice icon={Info} title="Plätze frei" titleAs="h3" className="max-w-lg">
      <div className="text-body-sm/normal space-y-4">
        <p>
          Im Jahrgang Delta 2 (10. Schulstufe) und Gamma 3 (11. Schulstufe) sind
          Restplätze verfügbar. Weitere Infos & Vorstellungstermin bei Agnes
          Chorherr:{' '}
          <a
            href="mailto:agnes.chorherr@walz.at"
            className="inline-flex items-center gap-1 underline underline-offset-2"
          >
            agnes.chorherr@walz.at
            <ArrowSquareOut size={16} className="text-primary" />
          </a>
        </p>
      </div>
    </Notice>
  )
}
