import { getImage } from '@sanity/asset-utils'
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from '#app/components/ui/carousel.js'
import { Divider } from '#app/components/ui/divider.tsx'
import { urlFor } from '#app/sanity/instance.js'

export function meta() {
  return [{ title: 'Curriculum | Walz' }]
}

export default function Curriculum() {
  return (
    <div className="relative grid grid-cols-subgrid items-start gap-8 text-balance lg:col-span-2">
      <h1 className="font-condensed text-h1 font-bold text-muted-foreground opacity-20">
        Curriculum
      </h1>

      <div className="col-start-1 grid grid-cols-1 gap-16 text-balance md:text-body-md">
        <article className="space-y-8 pt-4">
          <hgroup>
            <h1 className="text-h4 font-bold text-muted-foreground">1. Jahr</h1>
            <p className="font-condensed text-h2 font-bold text-primary">
              Timeout und Ausprobieren
            </p>
          </hgroup>
          <div className="mb-8 max-w-prose space-y-4">
            <p>
              Gute Nachrichten für alle, die nach 8 Jahren Schulbank genug
              haben! Die Walz beginnt mit einem „Time-Out“ von der Schule – du
              lernst neue Lebenswelten kennen und kannst außerhalb des
              traditionellen Schulalltags verschiedenste Fertigkeiten erlernen.
              Die praktischen Erfahrungen auf dem Bauernhof, im Forst und in
              diversen Handwerksbetrieben werden später aufgearbeitet und
              bereiten dich auch auf die Externistenprüfungen in den folgenden
              Jahren vor.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <h2 className="font-condensed text-h4 font-bold text-secondary">
                Projekte
              </h2>
              <ul className="list-inside list-disc" aria-label="Projekte">
                <li>Landschaftspflege</li>
                <li>Landwirtschaft</li>
                <li>Handwerk</li>
                <li>Schattentheater</li>
                <li>Zeichnen</li>
                <li>Tanz und Akrobatik</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h2 className="font-condensed text-h4 font-bold text-secondary">
                Externe Prüfungen
              </h2>
              <ul className="list-inside list-disc">
                <li>keine</li>
              </ul>
            </div>
          </div>
          <div>
            <Carousel
              className="w-full"
              opts={{
                align: 'start',
              }}
            >
              <CarouselContent>
                <CarouselItem className="h-56 basis-auto">
                  <img
                    src={urlFor(
                      getImage(
                        'https://cdn.sanity.io/images/iaejvb99/production/2f24bbc27cee6d6f4363c20ebb2dbfe9bf87eb12-1475x985.jpg',
                      ),
                    )
                      .height(256)
                      .format('webp')
                      .url()}
                    className="h-full object-cover"
                  />
                </CarouselItem>
                <CarouselItem className="h-56 basis-auto">
                  <img
                    src={urlFor(
                      getImage(
                        'https://cdn.sanity.io/images/iaejvb99/production/4bb465814e4be4848499559d026dce59a8b33b36-394x296.jpg',
                      ),
                    )
                      .height(256)
                      .url()}
                    className="h-full object-cover"
                  />
                </CarouselItem>
                <CarouselItem className="h-56 basis-auto">
                  <img
                    src={urlFor(
                      getImage(
                        'https://cdn.sanity.io/images/iaejvb99/production/e05d6bdfb5eda2bdcfafb48dcba9582fec7baaa1-440x585.jpg',
                      ),
                    )
                      .height(256)
                      .url()}
                    className="h-full object-cover"
                  />
                </CarouselItem>
              </CarouselContent>
              <div className="flex justify-center gap-4 px-8">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            </Carousel>
          </div>
        </article>

        <Divider />

        <article className="space-y-4 pt-4">
          <hgroup>
            <h1 className="text-h4 font-bold text-muted-foreground">2. Jahr</h1>
            <p className="font-condensed text-h2 font-bold text-primary">
              Externe Prüfungen
            </p>
          </hgroup>
          <div className="mb-8 max-w-prose space-y-4">
            <p>
              Es wird ernst, die ersten Prüfungen stehen an! Zusätzlich fahrt
              ihr in diesem Jahr als ganze Gruppe nach Irland. Dort kannst du an
              diversen Arbeitsplätzen (z.B. kleine Handwerksbetriebe, Hotels,
              etc.) deine Englischkenntnisse verbessern und Land und Leute
              kennenlernen. Im Winter geht’s ins Kühtai zum Tourengehen und im
              Frühling findet in St. Margarethen unser erstes Kunstprojekt außer
              Haus statt: Steinhauen.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <h2 className="font-condensed text-h4 font-bold text-secondary">
                Projekte
              </h2>
              <ul className="list-inside list-disc" aria-label="Projekte">
                <li>Kamp</li>
                <li>Holzschlag</li>
                <li>Irland</li>
                <li>Theaterwerkstatt</li>
                <li>Kühtai</li>
                <li>Steinhauen</li>
                <li>Sprachpraktikum 2. Fremdsprache</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h2 className="font-condensed text-h4 font-bold text-secondary">
                Externe Prüfungen
              </h2>
              <ul className="list-inside list-disc">
                <li>Englisch</li>
                <li>Deutsch</li>
                <li>Musik</li>
                <li>Informatik</li>
                <li>Geographie- u. Wirtschaftskunde</li>
              </ul>
            </div>
          </div>
        </article>

        <Divider />

        <article className="space-y-4 pt-4">
          <hgroup>
            <h1 className="text-h4 font-bold text-muted-foreground">3. Jahr</h1>
            <p className="font-condensed text-h2 font-bold text-primary">
              Ein facettenreiches Jahr
            </p>
          </hgroup>
          <div className="mb-8 max-w-prose space-y-4">
            <p>
              Bei der eintägigen Potentialanalyse werden unter Anleitung
              erfahrener Beobachter:innen die eigenen Stärken und
              Entwicklungsfelder analysiert – die Gespräche sind die Grundlage
              für deine individuelle Lernvereinbarung. Im Frühling tauchst du in
              die Sprache und Zeit William Shakespeares ein und kannst auch alle
              Theaterbesucher:innen in diese spannende Welt mitnehmen. Im
              Radioprojekt lernst du selbständig eine Radiosendung moderieren
              und produzieren. Den Abschluss des Jahres bildet das
              „Mann-Frau-Projekt“. Dort setzt du dich mit dem Erwachsenwerden
              und einem differenzierten Geschlechterbild auseinander.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <h2 className="font-condensed text-h4 font-bold text-secondary">
                Projekte
              </h2>
              <ul className="list-inside list-disc" aria-label="Projekte">
                <li>Palfau</li>
                <li>Theaterwerkstatt</li>
                <li>Shakespeare</li>
                <li>Sprachpraktikum 2. Fremdsprache</li>
                <li>Medienarbeit</li>
                <li>Junior Company</li>
                <li>Potenzialanalyse</li>
                <li>Mann/Frau Projekt</li>
                <li>Sozialpraktikum</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h2 className="font-condensed text-h4 font-bold text-secondary">
                Externe Prüfungen
              </h2>
              <ul className="list-inside list-disc">
                <li>Chemie</li>
                <li>Mathematik</li>
                <li>Spanisch&thinsp;/&thinsp;Französisch</li>
                <li>Physik</li>
              </ul>
            </div>
          </div>
        </article>

        <Divider />

        <article className="space-y-4 pt-4">
          <hgroup>
            <h1 className="text-h5 font-bold text-muted-foreground">4. Jahr</h1>
            <p className="font-condensed text-h2 font-bold text-primary">
              Das soziale Jahr
            </p>
          </hgroup>
          <div className="mb-8 max-w-prose space-y-4">
            <p>
              Das Schuljahr startet mit einem Projekt, bei dem du mit unserem
              Theaterpädagogen daran arbeitest, wie du deine individuellen
              Stärken, die du in drei Jahren Walz entwickelt hast, bewusst in
              die Gruppe einbringen kannst. Beim Sozialprojekt um Ostern geht es
              unter anderem darum, diese Fähigkeiten weiterzugeben, sich
              einzubringen und einen positiven Beitrag zu leisten. Im Frühling
              erlebst du in der Toskana „Kunstgeschichte hautnah“ und trittst
              damit gut vorbereitet zur Prüfung im Fach Bildnerisches Gestalten
              und Werken an. Am Ende des Schuljahres beginnst du mit deiner
              Vorwissenschaftlichen Arbeit: du konkretisierst dein Thema und
              legst die Literaturliste fest.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <h2 className="font-condensed text-h4 font-bold text-secondary">
                Projekte
              </h2>
              <ul className="list-inside list-disc" aria-label="Projekte">
                <li>Autonomie</li>
                <li>Theater</li>
                <li>Sozialpraktikum</li>
                <li>Kunst Toskana</li>
                <li>Sprachpraktikum 2.Fremdsprache</li>
                <li>Junior Company</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h2 className="font-condensed text-h4 font-bold text-secondary">
                Externe Prüfungen
              </h2>
              <ul className="list-inside list-disc">
                <li>Philosophie&thinsp;/&thinsp;Psychologie</li>
                <li>Biologie</li>
                <li>Geschichte</li>
                <li>Englisch Wahlpflichtfach</li>
                <li>Bildnerisches Gestalten</li>
              </ul>
            </div>
          </div>
        </article>

        <Divider />

        <article className="space-y-4 pt-4">
          <hgroup>
            <h1 className="text-h5 font-bold text-muted-foreground">5. Jahr</h1>
            <p className="font-condensed text-h2 font-bold text-primary">
              Der große Endspurt
            </p>
          </hgroup>
          <div className="mb-8 max-w-prose space-y-4">
            <p>
              Schneller als du denkst ist das letzte Walz-Jahr erreicht und
              damit die Matura in Sicht! Zu Beginn des Jahres wird noch einmal
              der Kunst gefrönt: Die letzte große Kunstreise in der Walz geht
              nach Frankreich –wichtige Stationen und Kunstwerke werden für die
              Kunstgeschichteprüfung besichtigt, besprochen und teilweise in
              Eigeninterpretation gemalt. Als letzte Hürde vor der Matura ist im
              November die Prüfung in der zweiten lebenden Fremdsprache zu
              absolvieren. Für die folgende Maturavorbereitung ist
              selbstständiges Arbeiten unabdingbare Voraussetzung: Der Stoff
              wird kompakt vorgetragen und die Prüfungsvorbereitungen haben
              Universitätscharakter. Bei der Abschlussreise kannst du noch
              einmal zurückblicken: „Wie bin ich in die Walz gekommen, was hat
              mich in diesen Jahren geprägt und verändert?“
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <h2 className="font-condensed text-h4 font-bold text-secondary">
                Projekte
              </h2>
              <ul className="list-inside list-disc" aria-label="Projekte">
                <li>Kunst in Paris</li>
                <li>Literaturwoche</li>
                <li>Sprachpraktikum Englisch</li>
                <li>Abschlussreise</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h2 className="font-condensed text-h4 font-bold text-secondary">
                Externe Prüfungen
              </h2>
              <ul className="list-inside list-disc">
                <li>Spanisch&thinsp;/&thinsp;Französisch</li>
                <li>Matura</li>
              </ul>
            </div>
          </div>
        </article>

        <Divider className="bg-transparent" />
      </div>
    </div>
  )
}
