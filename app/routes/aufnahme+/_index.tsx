import { DownloadSimple, ArrowSquareOut, Info } from '@phosphor-icons/react'
import { loadQuery } from '@sanity/react-loader'
import { Link, useLoaderData } from 'react-router'
import { Toc } from '#app/components/toc.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Divider } from '#app/components/ui/divider.tsx'
import { cn } from '#app/utils/misc.tsx'
import {
  type AufnahmeQuery,
  AufnahmeQuerySchema,
  aufnahmeQuery,
} from './_index.query.ts'

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

export default function Aufnahme() {
  const loaderData = useLoaderData<typeof loader>()
  const current = loaderData.currentSchoolYear

  return (
    <div className="relative grid grid-cols-subgrid items-start gap-8 lg:col-span-2">
      <h1 className="font-condensed text-h1 text-muted-foreground font-bold opacity-20">
        Aufnahme
      </h1>

      <div className="bg-muted/30 row-start-1 rounded-md p-6 lg:sticky lg:top-4 lg:z-20 lg:col-start-2 lg:row-start-2">
        <Toc
          links={[
            { name: 'Vorgehensweise', to: '#vorgehensweise' },
            { name: 'Voraussetzungen', to: '#voraussetzungen' },
            { name: 'Kosten', to: '#kosten' },
            { name: 'Stipendien', to: '#stipendien' },
          ]}
        />
      </div>

      <div className="col-start-1 grid grid-cols-12 gap-x-4 gap-y-16 sm:gap-x-6 lg:gap-x-8">
        <article id="vorgehensweise" className="col-span-12 space-y-8">
          <h1 className="font-condensed text-primary mb-8 text-4xl font-bold">
            Vorgehensweise
          </h1>
          <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
            <p>
              Wenn du dich an der Walz bewerben willst, fülle bitte das
              Anmeldeformular aus.
            </p>
            <p>
              Nach Absenden des Formulars senden wir dir und deinen Eltern eine
              Bestätigung per Mail mit Details zum Aufnahmetermin zu. Für den
              neuen Jahrgang beginnen wir ab Mitte November (nach dem Tag der
              offenen Tür) das Aufnahmeverfahren. Dafür melden wir uns
              telefonisch bei deinen Eltern, um einen Aufnahmetermin zu
              vereinbaren.
            </p>
            <p>
              Bei dem persönlichen Aufnahmegespräch mit der Schulleiterin und
              dem/der Mentor:in werden die gegenseitigen Erwartungen abgeklärt
              und bei kleinen Aufgaben bekommst du einen ersten Einblick in die
              Arbeitsweise der Walz. Wir bitten deine Eltern, zum Aufnahmetermin
              mitzukommen.
            </p>
            <p>
              Ab Jänner erhalten du und deine Eltern eine Zu- oder Absage. Wenn
              ihr euch für die Walz entscheidet, ist dein Platz fix reserviert,
              sobald der Schulvertrag unterschrieben und der Aufnahmebeitrag
              eingezahlt ist.
            </p>
          </div>

          <AdmissionDay />
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
                download="Schulvertrag September 2026.pdf"
                href="/downloads/schulvertrag_september_2026.pdf"
                className="text-muted-foreground inline-flex max-w-sm items-center gap-1 underline underline-offset-2"
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
          <div className="mb-8 text-base">
            <dl className="grid grid-cols-1 gap-1">
              {current?.costs.list.map(cost => {
                //const first = idx === 0

                return (
                  <div
                    className={cn('-mx-4 p-4', {
                      'bg-card/90': true,
                    })}
                    key={cost.title}
                  >
                    <div className="grid grid-cols-2 py-2">
                      <div className="inset-s-0 col-span-1 grid grid-cols-1 gap-2">
                        <div className="">
                          <dt className="font-condensed text-secondary text-xl font-bold md:text-2xl">
                            {cost.title}
                          </dt>
                        </div>
                        <dd className="">
                          <p>{cost.description}</p>
                        </dd>
                      </div>
                      <div className="flex flex-col items-end justify-start gap-2 justify-self-end">
                        <span className="font-condensed text-xl font-bold md:text-2xl">
                          {Intl.NumberFormat('de-AT', {
                            style: 'currency',
                            currency: 'EUR',
                            maximumFractionDigits: 0,
                            signDisplay: 'never',
                          }).format(cost.cost)}
                        </span>
                        <span className="text-primary">
                          {cost.interval === 'ONCE'
                            ? `Einmalig`
                            : `${cost.quantity} × im Jahr`}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </dl>
          </div>
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
                className="text-primary hover:text-primary/80 underline underline-offset-4"
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
                className="text-primary hover:text-primary/80 underline underline-offset-4"
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

function AdmissionDay() {
  return (
    <div className="border-muted bg-card ring-muted/40 relative max-w-lg rounded-md border p-4 ring-8">
      <div className="text-secondary mb-2 flex items-center gap-1">
        <Info size={18} className="text-secondary" />
        <span className="font-condensed text-body-md">Aufnahmetermin</span>
      </div>
      <div className="text-body-sm/normal space-y-4">
        <p>
          Für einen Aufnahmetermin für den Jahrgang Zeta (9. Schulstufe,
          Schulbeginn September 2027) fülle das Aufnahmeformular aus. Weitere
          Infos folgen per Mail.
        </p>
        <Button asChild>
          <Link to="/aufnahme/formular">Zum Anmeldeformular</Link>
        </Button>
      </div>
    </div>
  )
}

function LateralEntryBox() {
  return (
    <div className="border-muted bg-card ring-muted/40 relative max-w-lg rounded-md border p-4 ring-8">
      <div className="text-secondary mb-2 flex items-center gap-1">
        <Info size={18} className="text-secondary" />
        <span className="font-condensed text-body-md">Plätze frei</span>
      </div>
      <div className="text-body-sm/normal space-y-4">
        <p>
          Im Jahrgang Delta 2 (10. Schulstufe) und Gamma 3 (11. Schulstufe) sind
          Restplätze verfügbar. Weitere Infos & Vorstellungstermin bei Agnes
          Chorherr:{' '}
          <a
            href="mailto:agnes.chorherr@walz.at"
            className="text-muted-foreground inline-flex items-center gap-1 underline underline-offset-2"
          >
            agnes.chorherr@walz.at
            <ArrowSquareOut size={16} className="text-primary" />
          </a>
        </p>
      </div>
    </div>
  )
}
