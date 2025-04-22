import { loadQuery } from '@sanity/react-loader'
import { DownloadIcon, ExternalLinkIcon, InfoIcon } from 'lucide-react'
import { useLoaderData } from 'react-router'
import { Toc } from '#app/components/toc.tsx'
import { Divider } from '#app/components/ui/divider.tsx'
import { cn } from '#app/utils/misc.tsx'
import {
  type AufnahmeQuery,
  AufnahmeQuerySchema,
  aufnahmeQuery,
} from './ _index.query.ts'

export function meta() {
  return [{ title: 'Aufnahme | Walz' }]
}

export async function loader() {
  const queryResult = await loadQuery<AufnahmeQuery>(aufnahmeQuery)
  return AufnahmeQuerySchema.parse(queryResult.data)
}

export default function Aufnahme() {
  const loaderData = useLoaderData<typeof loader>()
  const current = loaderData.currentSchoolYear

  return (
    <div className="relative grid grid-cols-subgrid items-start gap-8 lg:col-span-2">
      <h1 className="font-condensed text-h1 font-bold text-muted-foreground opacity-20">
        Aufnahme
      </h1>

      <div className="row-start-1 rounded-md bg-muted/30 p-6 lg:sticky lg:top-4 lg:z-20 lg:col-start-2 lg:row-start-2">
        <Toc
          links={[
            { name: 'Vorgehensweise', to: '#vorgehensweise' },
            { name: 'Voraussetzungen', to: '#voraussetzungen' },
            { name: 'Kosten', to: '#kosten' },
            { name: 'Stipendien', to: '#stipendien' },
          ]}
        />
      </div>

      <div className="col-start-1 grid grid-cols-1 gap-16">
        <article id="vorgehensweise" className="space-y-8">
          <h1 className="mb-8 font-condensed text-4xl font-bold text-primary">
            Vorgehensweise
          </h1>
          <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
            <p>
              Der Aufnahmetag für das folgende Schuljahr findet im März statt.
              Hier haben die Jugendlichen bei einigen Übungen und persönlichen
              Gesprächen die Möglichkeit, sich mit der Arbeitsweise in der Walz
              vertraut zu machen. Im Anschluss daran trifft das Aufnahmeteam der
              Walz gemeinsam die Entscheidung, wem die Aufnahme in den neuen
              Jahrgang angeboten wird. Nach der Zusage von Seiten der Eltern und
              des/der Jugendlichen und der Einzahlung des Aufnahmebeitrags ist
              der Platz im neuen Jahrgang fix.
            </p>
          </div>

          <div className="relative max-w-lg rounded-md border border-muted bg-card p-4 ring-8 ring-muted/40">
            <div className="mb-2 flex items-center gap-1 text-secondary">
              <InfoIcon size={16} className="stroke-secondary" />
              <span className="font-condensed">Plätze im Jahrgang Delta</span>
            </div>
            <p className="text-body-sm/normal">
              Im September 2025 startet der Jahrgang Delta. Für eine Nachmeldung
              vereinbaren Sie bitte einen Termin bei{' '}
              <a
                href="mailto:agnes.chorherr@walz.at"
                className="inline-flex items-center gap-1 text-muted-foreground underline underline-offset-2"
              >
                Agnes Chorherr
                <ExternalLinkIcon size={16} className="stroke-primary" />
              </a>
              !
            </p>
          </div>
        </article>

        <Divider />

        <article id="voraussetzungen" className="space-y-8">
          <h1 className="font-condensed text-4xl font-bold text-primary">
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
              Zu den Möglichkeiten einer Aufnahme in einen bestehenden Jahrgang
              bitten wir um Kontaktaufnahme unter{' '}
              <a
                href="mailto:office@walz.at"
                className="inline-flex items-center gap-1 stroke-primary text-muted-foreground underline underline-offset-2"
              >
                office@walz.at <ExternalLinkIcon size={20} />
              </a>
              .
            </p>
          </div>

          <div className="relative max-w-lg rounded-md border border-muted bg-card p-4 ring-8 ring-muted/40">
            <div className="mb-2 flex items-center gap-1 text-secondary">
              <InfoIcon size={16} className="stroke-secondary" />
              <span className="font-condensed">Wichtige Information</span>
            </div>
            <p className="text-body-sm/normal">
              Informationen und Rahmenbedingungen für einen Schulbesuch in der
              Walz.{' '}
              <a
                download="Informationen und Rahmenbedingungen 23-24.pdf"
                href="/downloads/Informationen_und_Rahmenbedingungen_23-24.pdf"
                className="inline-flex max-w-sm items-center gap-1 text-muted-foreground underline underline-offset-2"
              >
                Hier herunterladen
                <DownloadIcon size={16} className="flex-none stroke-primary" />
              </a>{' '}
            </p>
          </div>
        </article>

        <Divider />

        <article id="kosten" className="space-y-8">
          <h1 className="mb-8 font-condensed text-4xl font-bold text-primary">
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
          <h2 className="font-condensed font-bold md:text-h4">
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
                      <div className="start-0 col-span-1 grid grid-cols-1 gap-2">
                        <div className="">
                          <dt className="font-condensed text-xl font-bold text-secondary md:text-2xl">
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

        <Divider />

        <article id="stipendien" className="space-y-8">
          <h1 className="mb-8 font-condensed text-4xl font-bold text-primary">
            Stipendien
          </h1>
          <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
            <p>
              Durch private Sponsoren steht der Walz ein gewisser Betrag für
              Stipendien zur Verfügung. Dieser Betrag wird auf mehrere
              Jugendliche aufgeteilt. Im Bedarfsfall kann ein Antrag (inkl.
              Einkommensnachweise und Begründung) gestellt werden.
            </p>
          </div>
        </article>
        <Divider className="bg-transparent" />
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AdmissionDay() {
  return (
    <>
      <div className="relative max-w-lg rounded-md border border-muted bg-card p-4 ring-8 ring-muted/40">
        <div className="mb-2 flex items-center gap-1 text-secondary">
          <InfoIcon size={16} className="stroke-secondary" />
          <span className="font-condensed">Nächster Aufnahmetag</span>
        </div>
        <p className="text-body-sm/normal">
          Der Aufnahmetag für den Jahrgang Delta (9. Schulstufe, Schulbeginn
          September 2025) findet am 15.März 2025 statt. Für die Anmeldung zum
          Aufnahmetag bitte das ausgefüllte{' '}
          <a
            download="Aufnahmeformular.pdf"
            href="/downloads/aufnahmeformular_2025.pdf"
            className="inline-flex items-center gap-1 text-muted-foreground underline underline-offset-2"
          >
            Aufnahme&shy;formular
            <DownloadIcon size={16} className="stroke-primary" />
          </a>{' '}
          an{' '}
          <a
            href="mailto:office@walz.at"
            className="inline-flex items-center gap-1 text-muted-foreground underline underline-offset-2"
          >
            office@walz.at
            <ExternalLinkIcon size={16} className="stroke-primary" />
          </a>{' '}
          schicken. Weitere Infos folgen per Mail. .
        </p>
      </div>

      <Divider />
    </>
  )
}
