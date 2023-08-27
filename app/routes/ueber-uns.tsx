import { persons } from '~/data/persons'

function tStaffRole(role: string) {
  switch (role) {
    case 'mentor':
      return 'Mentor:in'
    case 'project-leader':
      return 'Projektleiter:in'
    case 'therapist':
      return 'Therapeut:in'
    case 'administrator':
      return 'Administrator:in'
    default:
      return 'Mitarbeiter:in'
  }
}

export default function UeberUns() {
  return (
    <div className="mt-12 space-y-12 lg:mt-24">
      <h1 className="font-condensed text-xl font-bold text-primary md:text-4xl lg:text-5xl xl:text-6xl">
        Über uns
      </h1>
      <div className="max-w-prose space-y-4">
        <p className="text-2xl">
          Die Walz ist eine private Bildungseinrichtung mit Öffentlichkeitsrecht
          für Jugendliche im Alter von 14 bis 19 Jahren (9.-13. Schulstufe). Die
          Walz schließt mit Matura (Externistenreifeprüfung) ab.
        </p>
        <p className="text-2xl">
          Der Unterricht orientiert sich am Lehrplan des
          Oberstufenrealgymnasiums mit Bildnerischem Gestalten und
          Werkerziehung.
        </p>
        <p className="text-2xl">
          Die Walz bietet 5 Jahrgängen zu ca. 30 Jugendlichen verschiedenste
          Lernumwelten an welche die Jugendlichen auf ein selbst bestimmtes
          Leben in einer sich verändernden Welt vorbereiten sollen.
        </p>
      </div>
      <nav className="flex flex-col space-y-1">
        <a href="#menschen" className="text-xl font-bold text-primary">
          Menschen
        </a>
        <a href="#philosophie" className="text-xl font-bold text-primary">
          Philosophie
        </a>
        <a href="#geschichte" className="text-xl font-bold text-primary">
          Geschichte
        </a>
      </nav>
      <hr className="border-primary" />
      <section id="menschen" className="space-y-4">
        <h1 className="mb-8 font-condensed text-4xl font-bold text-secondary">
          Menschen
        </h1>

        <article>
          <h1 className="font-bold text-muted">Leitung</h1>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(0,_1fr))] gap-8">
            {persons
              .filter(person => person.roles.includes('leadership'))
              .map(person => (
                <figure key={person.name} className="space-y-2 bg-card p-6">
                  <img
                    src={person.image || ''}
                    alt={person.name}
                    className="aspect-square w-32 rounded-full object-cover"
                  />
                  <figcaption>
                    <h1 className="font-bold">{person.name}</h1>
                    <p>{person.email}</p>
                  </figcaption>
                </figure>
              ))}
          </div>
        </article>
        <article className="space-y-8">
          <h1 className="font-bold text-muted">Mitarbeitende</h1>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Mentor:innen</h2>
            <p className="max-w-prose">
              Mentor:innen sind für Jahrgänge hauptverantwortlich und kümmern
              sich organisatorische Aufgaben sowie Projekte. Ihre Kernfunktion
              ist die Entwicklungsbegleitung der Jugendlichen, wobei sie deren
              Stärken fördern, Begabungen unterstützen und sie in individuellen
              Lernsituationen begleiten.
            </p>
            {/* vertical scrollable area of mentor images with caoption */}
            <div className="flex flex-wrap gap-8">
              {persons
                .filter(person => person.roles.includes('mentor'))
                .map(person => (
                  <figure key={person.name} className="space-y-2 bg-card p-4">
                    <img
                      src={person.image || ''}
                      alt={person.name}
                      className="aspect-square w-32 rounded-full object-cover"
                    />
                    <figcaption>
                      <h1 className="font-bold">{person.name}</h1>
                      <p>{person.email}</p>
                    </figcaption>
                  </figure>
                ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Projektleiter:innen</h2>
            <p className="max-w-prose">
              Projektleiter:innen in der Walz bereiten die Jugendlichen auf
              Externistenprüfungen vor. Sie agieren als "Trainer", erarbeiten
              klar definierte Stoffgebiete und übernehmen nicht selbst die
              Prüfung. Viele unterrichten blockweise und haben nebenbei einen
              Hauptberuf. Einige sind Fachexperten statt Pädagogen, wodurch
              Jugendliche realistische Einblicke in die Arbeitswelt erhalten.
            </p>
          </div>

          <h2 className="text-2xl font-bold">Therapeut:innen</h2>
          <h2 className="text-2xl font-bold">Administrator:innen</h2>
        </article>
        <article>
          <h1 className="font-bold">Jahrgänge</h1>
          <p>Jetztige</p>
          <p>Ehemalige</p>
        </article>
      </section>

      <section id="philosophie">
        <h1 className="mb-8 font-condensed text-2xl font-bold text-secondary">
          Philosophie
        </h1>
        <div className="max-w-prose space-y-4 text-lg"></div>
      </section>

      <section id="geschichte">
        <h1 className="mb-8 font-condensed text-2xl font-bold text-secondary">
          Geschichte
        </h1>
        <div className="max-w-prose space-y-4 text-lg">
          <p>
            Die w@lz wurde im Jahr 2000 von Renate Chorherr gegründet und
            startete zunächst mit einem Jahrgang, den „Alphas“ in Räumlichkeiten
            auf dem Gelände des Wiener Kabelwerks im 12. Bezirk. Als im Jahr
            2003 die w@lz mit 5 Jahrgängen (9.-13. Schulstufe) komplett war, war
            es an der Zeit, sich nach einer neuen Bleibe mit ausreichend Platz
            umzusehen.
          </p>

          <p>
            Nach eineinhalb Jahren suchen, Sponsoren finden, Planung und Umbau
            wurde die "neue" w@lz im Herbst 2005 eröffnet – der jetzige Standort
            befindet sich im 14. Bezirk, gegenüber dem Hanusch-Krankenhaus.
          </p>

          <p>
            Seit dem Schuljahr 2002/03 hat die w@lz das Öffentlichkeitsrecht für
            die 9. Schulstufe, seit 2006/07 auch für die 10.-13. Schulstufe.
          </p>
        </div>
      </section>
    </div>
  )
}
