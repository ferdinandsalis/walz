import { loadQuery } from '@sanity/react-loader'
import {
  DownloadIcon,
  ExternalLinkIcon,
  FileCheck,
  GraduationCap,
  Handshake,
  InfoIcon,
  Mail,
  MessageSquare,
  Phone,
  Users,
} from 'lucide-react'
import { Link, useLoaderData } from 'react-router'
import { Toc } from '#app/components/toc.tsx'
import { Button } from '#app/components/ui/button.tsx'
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
              Wenn du dich an der Walz bewerben willst, fülle bitte das
              Anmeldeformular aus.
            </p>
            <p>
              Nach Absenden des Formulars senden wir dir und deinen Eltern eine
              Bestätigung per Mail mit Details zum Aufnahmetermin zu. Ab Mitte
              November melden wir uns telefonisch bei deinen Eltern, um einen
              Aufnahmetermin zu vereinbaren.
            </p>
            <p>
              Bei einem persönlichen Aufnahmegespräch mit der Schulleiterin und
              dem/der Mentor:in werden die gegenseitigen Erwartungen abgeklärt
              und bei kleinen Aufgaben bekommst du einen ersten Einblick in die
              Arbeitsweise der Walz. Wir bitten die Eltern, zum Aufnahmetermin
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
              Alle wichtigen Informationen und Rahmenbedingungen sind in unserem
              Schulvertrag zusammengefasst.{' '}
              <a
                download="Schulvertrag September 2026.pdf"
                href="/downloads/schulvertrag_september_2026.pdf"
                className="inline-flex max-w-sm items-center gap-1 text-muted-foreground underline underline-offset-2"
              >
                Hier herunterladen
                <DownloadIcon size={16} className="flex-none stroke-primary" />
              </a>
            </p>
          </div>

          <section>
            <h2 className="mb-4 font-condensed text-h5 font-bold md:text-h4">
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
          <h2 className="font-condensed text-h5 font-bold md:text-h4">
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

function AdmissionTimeline() {
  const steps = [
    {
      icon: Mail,
      title: 'Onlineformular ausfüllen',
      date: '',
    },
    {
      icon: Phone,
      title: 'Telefonische Terminvergabe nach dem Tag der offenen Tür',
      date: 'ab 15. November 2025',
    },
    {
      icon: MessageSquare,
      title: 'Aufnahmegespräch',
      date: '',
    },
    {
      icon: Handshake,
      title: 'Feedback',
      date: 'bis Jänner 2026',
    },
    {
      icon: FileCheck,
      title: 'Unterschriebene Unterlagen & Überweisung Aufnahmebetrag',
      subtitle: '→ Platz fix',
      date: 'Bis spätestens 1 Woche nach den Semesterferien',
    },
    {
      icon: FileCheck,
      title: 'Positives Abschlusszeugnis 8. Schulstufe',
      date: 'Juni 2025',
    },
    {
      icon: Users,
      title: 'Jahrgangstreffen & erster Elternabend',
      date: 'Juni 2026',
    },
    {
      icon: GraduationCap,
      title: 'Schulbeginn',
      date: 'September 2026',
    },
  ]

  return (
    <div className="relative max-w-2xl">
      {steps.map((step, index) => {
        const Icon = step.icon
        return (
          <div key={index} className="relative flex gap-3">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded bg-secondary shadow-md">
                <Icon className="h-6 w-6 text-white" />
              </div>
              {index < steps.length - 1 && (
                <div className="my-2 h-16 w-0.5 bg-secondary/30" />
              )}
            </div>
            <div className="flex-1 pb-2">
              <h3 className="font-condensed text-lg font-bold leading-tight">
                {step.title}
              </h3>
              {step.subtitle && (
                <p className="mt-1 text-sm font-bold text-secondary">
                  {step.subtitle}
                </p>
              )}
              {step.date && (
                <p className="mt-1 text-sm text-primary">{step.date}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function AdmissionDay() {
  return (
    <div className="relative max-w-lg rounded-md border border-muted bg-card p-4 ring-8 ring-muted/40">
      <div className="mb-2 flex items-center gap-1 text-secondary">
        <InfoIcon size={18} className="stroke-secondary" />
        <span className="font-condensed text-body-md">Aufnahmetermin</span>
      </div>
      <div className="space-y-4 text-body-sm/normal">
        <p>
          Für einen Aufnahmetermin für den Jahrgang Epsilon (9. Schulstufe,
          Schulbeginn September 2026) fülle das Aufnahmeformular aus. Weitere
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
    <div className="relative max-w-lg rounded-md border border-muted bg-card p-4 ring-8 ring-muted/40">
      <div className="mb-2 flex items-center gap-1 text-secondary">
        <InfoIcon size={18} className="stroke-secondary" />
        <span className="font-condensed text-body-md">Plätze frei</span>
      </div>
      <div className="space-y-4 text-body-sm/normal">
        <p>
          Im Jahrgang Delta 1 (9. Schulstufe, Schulbeginn September 2025) und
          Gamma 2 (10. Schulstufe) sind Restplätze verfügbar. Infos &
          Vorstellungstermin bei Agnes Chorherr:{' '}
          <a
            href="mailto:agnes.chorherr@walz.at"
            className="inline-flex items-center gap-1 text-muted-foreground underline underline-offset-2"
          >
            agnes.chorherr@walz.at
            <ExternalLinkIcon size={16} className="stroke-primary" />
          </a>
        </p>
      </div>
    </div>
  )
}
