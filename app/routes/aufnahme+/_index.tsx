import { BackToTop } from '#app/components/back-to-top.tsx'
import { Toc } from '#app/components/toc.tsx'
import { Divider } from '#app/components/ui/divider.tsx'
import { costs } from '#app/data/costs.ts'
import { DownloadIcon, ExternalLinkIcon, InfoIcon } from 'lucide-react'

export default function Aufnahme() {
  return (
    <div className="md:mt-12">
      <h1 className="absolute left-0 origin-top-left rotate-90 scale-[4] font-condensed text-xl font-bold text-stone-500 opacity-10">
        Aufnahme
      </h1>

      <div className="space-y-12 md:space-y-16">
        <Toc
          links={[
            { name: 'Vorgehensweise', to: '#vorgehensweise' },
            { name: 'Voraussetzungen', to: '#voraussetzungen' },
            { name: 'Kosten', to: '#kosten' },
            { name: 'Stipendien', to: '#stipendien' },
          ]}
        />

        <div className="max-w-lg rounded-md border border-secondary/20 bg-secondary/10 p-6 text-secondary">
          <div className="mb-2 flex items-center gap-1">
            <InfoIcon size={20} />
            <span className="font-bold">Information</span>
          </div>
          <p className="leading-snug">
            Anmeldungen der Geburts&shy;jahrgänge 2009 und 2010 für das
            Schuljahr 2024/25 nehmen wir gerne bis{' '}
            <em className="">24. Februar 2024</em> entgegen. Bitte senden Sie
            dafür das ausgefüllte{' '}
            <a
              download="Anmeldeformular.pdf"
              href="/downloads/anmeldeformular.pdf"
              className="inline-flex items-center gap-1 underline underline-offset-2"
            >
              Anmelde&shy;formular
              <DownloadIcon size={20} />
            </a>{' '}
            an{' '}
            <a
              href="mailto:office@walz.at"
              className="inline-flex items-center gap-1 underline underline-offset-2"
            >
              office@walz.at
              <ExternalLinkIcon size={20} />
            </a>
            .
          </p>
        </div>

        <Divider />

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

          <BackToTop />
        </article>

        <Divider />

        <article id="voraussetzungen">
          <h1 className="mb-8 font-condensed text-4xl font-bold text-primary">
            Voraussetzungen
          </h1>
          <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
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
                className="inline-flex items-center gap-1 underline underline-offset-2"
              >
                office@walz.at <ExternalLinkIcon size={20} />
              </a>
              .
            </p>
          </div>

          <div className="mb-8 max-w-lg rounded-md border border-secondary/20 bg-secondary/10 p-6 text-secondary">
            <div className="mb-2 flex items-center gap-1">
              <InfoIcon size={20} />
              <span className="font-bold">Information</span>
            </div>
            <p className="leading-snug">
              Informationen und Rahmenbedingungen für einen Schulbesuch in der
              Walz.{' '}
              <a
                download="Informationen und Rahmenbedingungen 23-24.pdf"
                href="/downloads/Informationen_und_Rahmenbedingungen_23-24.pdf"
                className="inline-flex max-w-sm items-center gap-1 underline underline-offset-2"
              >
                Hier herunterladen
                <DownloadIcon size={20} className="flex-none" />
              </a>{' '}
            </p>
          </div>

          <BackToTop />
        </article>

        <Divider />

        <article id="kosten" className="space-y-8">
          <h1 className="mb-8 font-condensed text-4xl font-bold text-primary">
            Kosten und Finanzierung
          </h1>
          <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
            <p>
              Die Walz ist ein gemeinnütziger Verein und finanziert sich zu
              einem großen Teil (über 90 %) selbst. Wir müssen, um unsere Kosten
              decken zu können, Schulgeld einheben.
            </p>
            <p>
              Während bei konfessionellen Privatschulen die Personalkosten (also
              80 - 90% der Gesamtkosten) von der öffentlichen Hand übernommen
              werden, müssen Privatschulen (ohne kirchlichem Träger) für alle
              Kosten selbst aufkommen. Die einzige Förderung, welche die Walz,
              so wie alle anderen Privatschulen in freier Trägerschaft, im
              Moment vom Bildungsministerium erhält, hat eine Höhe von ca. 700,-
              pro Jahr pro Schüler:in. Die Walz muss sich daher durch die
              Beiträge der Eltern finanzieren.
            </p>
            <p>
              Wir bemühen uns sehr, die Kosten so niedrig wie möglich zu halten.
              Zum Vergleich betragen laut OECD die Kosten der öffentlichen
              Schule für die Sekundarstufe € 15.729 pro Jahr (letzter
              verfügbarer Wert aus dem Jahr 2019).
            </p>
          </div>
          <p className="font-bold md:text-xl">
            Für das Schuljahr 2023/2024 gelten für die Walz folgende Beträge:
          </p>
          <div className="mb-8 max-w-prose text-base">
            <dl className="grid grid-cols-1 gap-8">
              {costs.map(cost => {
                return (
                  <div className="border-t border-t-border">
                    <div className="grid grid-cols-2 py-2">
                      <div className="start-0 col-span-1 grid grid-cols-1 gap-2">
                        <div className="">
                          <dt className="text-xl font-bold text-secondary md:text-2xl">
                            {cost.name}
                          </dt>
                        </div>
                        <dd className="">
                          <p>{cost.description}</p>
                        </dd>
                      </div>
                      <div className="flex justify-start gap-2 justify-self-end">
                        <span className="text-primary">
                          {cost.multiplier} &times;
                        </span>
                        <span className="font-bold">
                          {Intl.NumberFormat('de-AT', {
                            style: 'currency',
                            currency: 'EUR',
                            maximumFractionDigits: 0,
                            signDisplay: 'never',
                          }).format(cost.cost)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </dl>
          </div>
          <BackToTop />
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

          <BackToTop />
        </article>
      </div>
    </div>
  )
}
