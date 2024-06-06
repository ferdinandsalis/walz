import { BackToTop } from '#app/components/back-to-top.tsx'

export function meta() {
  return [{ title: 'Curriculum | Walz' }]
}

export default function Curriculum() {
  return (
    <div className="text-balance md:mt-12">
      <h1 className="absolute left-0 origin-top-left rotate-90 scale-[4] font-condensed text-xl font-bold text-stone-500 opacity-10">
        Curriculum
      </h1>

      <div id="in-jahren" className="space-y-8">
        <div className="space-y-8 divide-y divide-muted md:space-y-12">
          <article className="space-y-4 pt-4">
            <hgroup>
              <span
                role="presentation"
                className="absolute scale-[8] font-black opacity-5"
              >
                1
              </span>
              <h1 className="font-condensed text-4xl font-bold text-primary">
                1. Jahr
              </h1>
              <p className="font-condensed text-xl font-bold text-secondary md:text-2xl">
                Timeout und Ausprobieren
              </p>
            </hgroup>
            <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
              <p>
                Gute Nachrichten für alle, die nach 8 Jahren Schulbank genug
                haben! Die Walz beginnt mit einem „Time-Out“ von der Schule – du
                lernst neue Lebenswelten kennen und kannst außerhalb des
                traditionellen Schulalltags verschiedenste Fertigkeiten
                erlernen. Die praktischen Erfahrungen auf dem Bauernhof, im
                Forst und in diversen Handwerksbetrieben werden später
                aufgearbeitet und bereiten dich auch auf die
                Externistenprüfungen in den folgenden Jahren vor.
              </p>
            </div>
          </article>

          <article className="space-y-4 pt-4">
            <hgroup>
              <span
                role="presentation"
                className="absolute scale-[8] font-black opacity-5"
              >
                2
              </span>
              <h1 className="font-condensed text-4xl font-bold text-primary">
                2. Jahr
              </h1>
              <p className="font-condensed text-xl font-bold text-secondary md:text-2xl">
                Auslandsabenteuer und erste Prüfungen
              </p>
            </hgroup>
            <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
              <p>
                Es wird ernst, die ersten Prüfungen stehen an! Zusätzlich fahrt
                ihr in diesem Jahr als ganze Gruppe nach Irland. Dort kannst du
                an diversen Arbeitsplätzen (z.B. kleine Handwerksbetriebe,
                Hotels, etc.) deine Englischkenntnisse verbessern und Land und
                Leute kennenlernen. Im Winter geht’s ins Kühtai zum Tourengehen
                und im Frühling findet in St. Margarethen unser erstes
                Kunstprojekt außer Haus statt: Steinhauen.
              </p>
            </div>
          </article>

          <article className="space-y-4 pt-4">
            <hgroup>
              <span
                role="presentation"
                className="absolute scale-[8] font-black opacity-5"
              >
                3
              </span>
              <h1 className="font-condensed text-4xl font-bold text-primary">
                3. Jahr
              </h1>
              <p className="font-condensed text-xl font-bold text-secondary md:text-2xl">
                Ein facettenreiches Jahr
              </p>
            </hgroup>
            <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
              <p>
                Bei der eintägigen Potentialanalyse werden unter Anleitung
                erfahrener Beobachter:innen die eigenen Stärken und
                Entwicklungsfelder analysiert – die Gespräche sind die Grundlage
                für deine individuelle Lernvereinbarung. Im Frühling tauchst du
                in die Sprache und Zeit William Shakespeares ein und kannst auch
                alle Theaterbesucher:innen in diese spannende Welt mitnehmen. Im
                Radioprojekt lernst du selbständig eine Radiosendung moderieren
                und produzieren. Den Abschluss des Jahres bildet das
                „Mann-Frau-Projekt“. Dort setzt du dich mit dem Erwachsenwerden
                und einem differenzierten Geschlechterbild auseinander.
              </p>
            </div>
          </article>

          <article className="space-y-4 pt-4">
            <hgroup>
              <span
                role="presentation"
                className="absolute scale-[8] font-black opacity-5"
              >
                4
              </span>
              <h1 className="font-condensed text-4xl font-bold text-primary">
                4. Jahr
              </h1>
              <p className="font-condensed text-xl font-bold text-secondary md:text-2xl">
                Das soziale Jahr
              </p>
            </hgroup>
            <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
              <p>
                Das Schuljahr startet mit einem Projekt, bei dem du mit unserem
                Theaterpädagogen daran arbeitest, wie du deine individuellen
                Stärken, die du in drei Jahren Walz entwickelt hast, bewusst in
                die Gruppe einbringen kannst. Beim Sozialprojekt um Ostern geht
                es unter anderem darum, diese Fähigkeiten weiterzugeben, sich
                einzubringen und einen positiven Beitrag zu leisten. Im Frühling
                erlebst du in der Toskana „Kunstgeschichte hautnah“ und trittst
                damit gut vorbereitet zur Prüfung im Fach Bildnerisches
                Gestalten und Werken an. Am Ende des Schuljahres beginnst du mit
                deiner Vorwissenschaftlichen Arbeit: du konkretisierst dein
                Thema und legst die Literaturliste fest.
              </p>
            </div>
          </article>

          <article className="space-y-4 pt-4">
            <hgroup>
              <span
                role="presentation"
                className="absolute scale-[8] font-black opacity-5"
              >
                5
              </span>
              <h1 className="font-condensed text-4xl font-bold text-primary">
                5. Jahr
              </h1>
              <p className="font-condensed text-xl font-bold text-secondary md:text-2xl">
                Der große Endspurt
              </p>
            </hgroup>
            <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
              <p>
                Schneller als du denkst ist das letzte Walz-Jahr erreicht und
                damit die Matura in Sicht! Zu Beginn des Jahres wird noch einmal
                der Kunst gefrönt: Die letzte große Kunstreise in der Walz geht
                nach Frankreich –wichtige Stationen und Kunstwerke werden für
                die Kunstgeschichteprüfung besichtigt, besprochen und teilweise
                in Eigeninterpretation gemalt. Als letzte Hürde vor der Matura
                ist im November die Prüfung in der zweiten lebenden Fremdsprache
                zu absolvieren. Für die folgende Maturavorbereitung ist
                selbstständiges Arbeiten unabdingbare Voraussetzung: Der Stoff
                wird kompakt vorgetragen und die Prüfungsvorbereitungen haben
                Universitätscharakter. Bei der Abschlussreise kannst du noch
                einmal zurückblicken: „Wie bin ich in die Walz gekommen, was hat
                mich in diesen Jahren geprägt und verändert?“
              </p>
            </div>
          </article>
        </div>

        <BackToTop />
      </div>
    </div>
  )
}
