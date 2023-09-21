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
            Kosten
          </h1>
          <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
            <dl>
              {costs.map(cost => {
                return (
                  <div className="grid grid-cols-2 items-center border-b-2 border-b-background bg-card px-2">
                    <dt className="">
                      <div className="font-bold">{cost.name}</div>
                    </dt>
                    <dd className="grid grid-cols-2 justify-items-end py-1">
                      <div>{cost.multiplier} &times;</div>
                      <div>
                        {Intl.NumberFormat('de-AT', {
                          style: 'currency',
                          currency: 'EUR',
                          maximumFractionDigits: 0,
                          signDisplay: 'never',
                        }).format(cost.cost)}
                      </div>
                    </dd>
                  </div>
                )
              })}
            </dl>
            <p className="text-base">Tarife 2023/2024</p>
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
