import * as ScrollArea from '@radix-ui/react-scroll-area'
import { unstable_defineLoader as defineLoader } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { loadQuery } from '@sanity/react-loader'
import { ExternalLinkIcon, SmileIcon } from 'lucide-react'
import slug from 'slug'
import { BackToTop } from '#app/components/back-to-top.tsx'
import { Toc } from '#app/components/toc.tsx'
import { Divider } from '#app/components/ui/divider.tsx'
import { urlFor } from '#app/sanity/instance.ts'
import { LinkPhotoCard } from '../_index.tsx'
import { type Person, query, type QueryResult } from './_index.query.ts'
import { pillars } from './philosophie.tsx'

export function meta() {
  return [{ title: 'Über uns | Walz' }]
}

export const loader = defineLoader(async () => {
  const queryResult = await loadQuery<QueryResult>(query)

  return {
    query,
    data: queryResult.data,
  }
})

export default function UeberUns() {
  const loaderData = useLoaderData<typeof loader>()
  const persons = loaderData.data.persons

  return (
    <div className="hyphens-auto text-pretty md:mt-12">
      <h1 className="absolute left-0 origin-top-left rotate-90 scale-[4] font-condensed text-xl font-bold text-stone-500 opacity-10">
        Über uns
      </h1>

      <div className="space-y-12 md:space-y-16">
        <Toc
          links={[
            { name: 'Menschen', to: '#menschen' },
            { name: 'Philosophie', to: '#philosophie' },
            { name: 'Leitbild', to: '#leitbild' },
            { name: 'Geschichte', to: '#geschichte' },
          ]}
        />

        <Divider />

        <div className="max-w-2xl space-y-4 hyphens-auto text-base md:text-xl">
          <p>
            Die Walz bietet fünf Jahrgängen von jeweils ca. 30 Jugendlichen
            verschiedenste Lernwelten an, die sie auf ein selbstbestimmtes Leben
            in einer sich verändernden Welt vorbereiten sollen.
          </p>
          <p>
            Die Walz ist eine private Bildungseinrichtung mit
            Öffentlichkeitsrecht für Jugendliche im Alter von 14 bis 19 Jahren
            (9.&ndash;13. Schulstufe). Die Walz schließt mit Matura
            (Externistenreifeprüfung) ab.
          </p>
          <p>
            Der Unterricht orientiert sich am Lehrplan eines
            Oberstufenrealgymnasiums mit Bildnerischem Gestalten und
            Werkerziehung.
          </p>
        </div>

        <section id="menschen">
          <h1 className="mb-8 font-condensed text-4xl font-bold text-primary">
            Menschen
          </h1>

          <article className="mb-12">
            <h1 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Leitung
            </h1>
            <StaffRoll>
              {persons
                .filter(person => person?.roles?.includes('leadership'))
                .map(person => (
                  <StaffCard key={person.name} person={person} />
                ))}
            </StaffRoll>
          </article>

          <article className="mb-12">
            <h1 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Mitarbeitende
            </h1>

            <div className="space-y-8">
              <div className="space-y-4">
                <h2
                  id="mentor"
                  className="font-condensed text-2xl font-bold text-secondary"
                >
                  <a href="#mentor">Mentor:innen</a>
                </h2>
                <p className="mb-4 max-w-prose hyphens-auto">
                  Mentor:innen sind für ihren Jahrgang verantwortlich. Ihre
                  Kernfunktion ist die Entwicklungsbegleitung der Jugendlichen,
                  wobei sie deren Stärken fördern, Begabungen unterstützen und
                  sie in individuellen Lernsituationen begleiten.
                </p>
                <StaffRoll>
                  {persons
                    .filter(person => person?.roles?.includes('mentor'))
                    .map(person => (
                      <StaffCard key={person.name} person={person} />
                    ))}
                </StaffRoll>
              </div>

              <div className="space-y-4">
                <h2
                  id="project_lead"
                  className="font-condensed text-2xl font-bold text-secondary"
                >
                  <a href="#project_lead">Projektleiter:innen</a>
                </h2>
                <div className="max-w-prose hyphens-auto">
                  <p>
                    Projektleiter:innen agieren als "Trainer:innen", sie
                    begleiten Projekte, unterstützen Jugendliche bei der
                    Erreichung ihrer Ziele und bereiten sie auf die externen
                    Prüfungen vor. Viele unterrichten blockweise. Einige sind
                    Fachexpert:innen statt Pädagog:innen, wodurch die
                    Jugendlichen realistische Einblicke in die Arbeitswelt
                    erhalten.
                  </p>
                </div>
                <StaffRoll>
                  {persons
                    .filter(person => person?.roles?.includes('project_lead'))
                    .map(person => (
                      <StaffCard key={person.name} person={person} />
                    ))}
                </StaffRoll>
              </div>

              <div className="space-y-4">
                <h2
                  id="administrator"
                  className="font-condensed text-2xl font-bold text-secondary"
                >
                  <a href="#administrator">Administrator:innen</a>
                </h2>
                <div className="max-w-prose hyphens-auto">
                  <p>
                    Um ein anspruchsvolles Projekt wie die Walz verwirklichen zu
                    können, braucht es viele Menschen im Hintergrund, die den
                    notwendigen Arbeits&shy;rahmen schaffen und zur Verfügung
                    stellen. Projekt- und Reiseorganisation, Abrechnungen,
                    Prüfungs&shy;anmeldungen sind nur einige der vielfältigen
                    Aufgaben der Verwaltungs&shy;mitarbeiter:innen.
                  </p>
                </div>
                <StaffRoll>
                  {persons
                    .filter(person => person?.roles?.includes('administrator'))
                    .map(person => (
                      <StaffCard key={person.name} person={person} />
                    ))}
                </StaffRoll>
              </div>

              <div className="space-y-4">
                <h2
                  id="therapist"
                  className="font-condensed text-2xl font-bold text-secondary"
                >
                  <a href="#therapist">Therapeut:innen</a>
                </h2>
                <div className="max-w-prose hyphens-auto">
                  <p>
                    Jede Woche stehen eine erfahrene Psychologin und eine
                    Psychotherapeutin für Gespräche mit den Jugendlichen zur
                    Verfügung. Zusätzlich runden wir das Angebot mit
                    Stressbewältigungstechniken, Drogenpräventionsprogrammen,
                    „Systemische und Integrative Bewegungslehre“ und
                    „Therapeutic Touch“ ab. Wir bieten Aufklärungsseminare und
                    Elternabende an, um das Wohlbefinden und die persönliche
                    Entwicklung aller Beteiligten zu fördern.
                  </p>
                </div>
                <StaffRoll>
                  {persons
                    .filter(person => person?.roles?.includes('therapist'))
                    .map(person => (
                      <StaffCard key={person.name} person={person} />
                    ))}
                </StaffRoll>
              </div>
            </div>
          </article>

          <BackToTop />
        </section>

        <Divider />

        <section id="philosophie" className="space-y-8">
          <h1 className="font-condensed text-4xl font-bold text-primary">
            Philosophie
          </h1>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map(pillar => (
              <LinkPhotoCard
                key={pillar.title}
                title={pillar.title}
                abstract={pillar.abstract}
                image={pillar.image}
                link={pillar.link}
              />
            ))}
          </div>

          <BackToTop />
        </section>

        <Divider />

        <section id="leitbild" className="space-y-8">
          <h1 className="font-condensed text-4xl font-bold text-primary">
            Leitbild
          </h1>

          <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
            <p>
              <span className="italic">
                Folgende Fragestellung hat zur Gründung der Walz geführt:
              </span>
              <br />
              Was sind die bestmöglichen organisatorischen und institutionellen
              Rahmenbedingungen, um die vielfältigen Potenziale und Fähigkeiten,
              die in jungen Menschen schlummern, optimal zur Entfaltung zu
              bringen?
            </p>
          </div>

          <article className="space-y-4">
            <h2 className="font-condensed text-2xl font-bold text-secondary">
              Fundamentaler Wandel
            </h2>

            <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
              <p>
                Bildung hat sich immer auf jene gesellschaftliche Realität zu
                beziehen, in der sich junge Menschen einmal bewähren müssen. Die
                gesellschaftliche Wirklichkeit, auf die Bildung heute
                vorbereiten soll, hat sich vor allem in zwei Bereichen
                fundamental verändert.
              </p>

              <ol className="space-y-4 sm:list-outside">
                <li>
                  <p>
                    <span className="font-bold">
                      Garantierter Wandel ist die einzige Konstante, die sicher
                      scheint
                    </span>
                    . Ein Großteil jener Berufe, in denen junge Menschen einmal
                    arbeiten werden, existiert heute noch nicht. Die Zeit, in
                    der ein junger Mensch einen Beruf erlernt, und diesen dann
                    ein Leben lang ausübt, ist mit Sicherheit vorbei.
                  </p>
                </li>

                <li>
                  <p>
                    <span className="font-bold">
                      Auch die grundlegenden Werte unserer Gesellschaft sind
                      unsicher geworden
                    </span>
                    : So sind zum Beispiel die Rolle der Geschlechter oder die
                    Frage der Identität verhandelbar geworden. Vor diesem
                    Hintergrund wollen wir in der Walz dem Lernen einen
                    optimalen Rahmen geben. Lernen heißt für uns, Wissen nicht
                    in einer vom wirklichen Leben getrennt geschaffenen
                    Institution (Schule) zu vermitteln.
                  </p>
                </li>
              </ol>
            </div>
          </article>

          <article className="space-y-4">
            <h2 className="font-condensed text-2xl font-bold text-secondary">
              Lernen ist zweifach Programm
            </h2>

            <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
              <p>
                Einerseits ist die Walz ein Ort des Lernens für junge Menschen,
                andererseits bezieht die Walz Lernen auch auf sich selbst, ihre
                Mitarbeiter:innen und ihre Struktur. Die Walz bemüht sich als
                gesamte Organisation um ein hohes Maß an Offenheit,
                Innovationskraft und Veränderungsbereitschaft.
              </p>
            </div>
          </article>

          <BackToTop />
        </section>

        <Divider />

        <section id="geschichte" className="space-y-8">
          <h1 className="font-condensed text-4xl font-bold text-primary">
            Geschichte
          </h1>
          <div className="max-w-prose space-y-4 hyphens-auto text-base md:text-xl">
            <p>
              Die Walz wurde im Jahr 2000 von Renate Chorherr gegründet und
              startete zunächst mit einem Jahrgang, den „Alphas“, auf dem
              Gelände des Wiener Kabelwerks im 12. Bezirk. Als im Jahr 2003 die
              Walz mit 5 Jahrgängen (9.-13. Schulstufe) komplett war, war es an
              der Zeit, sich nach einer neuen Bleibe mit ausreichend Platz
              umzusehen.
            </p>
            <p>
              Nach eineinhalb Jahren Suche, Sponsorenfinden, Planung und Umbau
              wurde die "neue" Walz feierlich im Herbst 2005 eröffnet. Die
              Räumlichkeiten wurden sukzessive erweitert und an den sich
              verändernden Bedarf angepasst. So schaffen gemütliche Sofas, viel
              Platz in der Aula, ein großzügiger Speisesaal, ein Atelier und
              eine Theaterhalle für verschiedenste Veranstaltungen eine
              Atmosphäre, die einer „normalen Schule“ nicht entspricht.
            </p>
            <p>
              Seit dem Schuljahr 2002/03 hat die Walz das Öffentlichkeitsrecht
              für die 9. Schulstufe, seit 2006/07 auch für die 10.-13.
              Schulstufe.
            </p>
            <p>
              Im Sommer 2020 wurde die neue Sporthalle fertiggestellt. Damit
              kann nun auch in der Walz Sport und Bewegung ein bedeutender Platz
              eingeräumt werden.
            </p>
          </div>

          <BackToTop />
        </section>
      </div>
    </div>
  )
}

function StaffCard({ person }: { person: Person }) {
  return (
    <figure
      id={slug(person.name)}
      key={person.name}
      className="flex w-60 flex-none flex-col space-y-4 overflow-hidden rounded-md bg-card p-6 shadow-md"
    >
      <div className="grid grid-cols-1 grid-rows-6">
        {person.portrait ? (
          <img
            src={
              urlFor(person.portrait)
                .quality(60)
                .width(256)
                .height(256)
                .auto('format')
                .url() || ''
            }
            width={256}
            height={256}
            alt={person.name}
            loading="lazy"
            className="relative col-start-1 row-span-6 row-start-1 flex aspect-square w-32 items-center justify-center rounded-full bg-secondary object-cover text-center text-xs text-white ring-4 ring-secondary"
          />
        ) : (
          <div className="relative col-start-1 row-span-6 row-start-1 flex aspect-square w-32 items-center justify-center rounded-full bg-secondary ring-4 ring-secondary">
            <SmileIcon size={96} className="w-10 stroke-white/20 md:w-16" />
          </div>
        )}
        <div
          role="presentation"
          className="to-secondary-30 order-secondary col-start-1 row-start-1 row-end-5 -mx-6 -mt-6 border-b bg-secondary/30 bg-gradient-to-t from-secondary/70"
        />
      </div>
      <figcaption className="flex flex-1 flex-col">
        <hgroup className="mb-2 flex-1">
          <h1 className="mb-1 text-lg font-bold leading-tight text-primary">
            {person.name}
          </h1>
          <h2 className="max-w-[18ch] font-condensed text-sm leading-tight text-muted-foreground">
            {person.description}
          </h2>
        </hgroup>
        <div>
          {person.email && (
            <a
              href={`mailto:${person.email}`}
              className="text-sm text-secondary"
            >
              {person.email}
            </a>
          )}
          {person.website && (
            <a
              href={person.website}
              className="inline-flex items-center gap-1 truncate whitespace-nowrap text-sm text-secondary"
            >
              Webseite <ExternalLinkIcon size={16} />
            </a>
          )}
          <p className="text-sm">{person.phone}</p>
        </div>
      </figcaption>
    </figure>
  )
}

function StaffRoll({ children }: { children: React.ReactNode }) {
  return (
    <ScrollArea.Root type="always">
      <ScrollArea.Viewport className="xl:-mx-24 -mx-4 rounded-md bg-stone-200/30 shadow-inner sm:-mx-8 md:-mx-12">
        <div className="xl:px-24 flex gap-4 px-4 py-8 sm:px-8 md:px-12">
          {children}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        orientation="horizontal"
        className="xl:-mx-24 -mx-4 flex h-[12px] items-center bg-card px-[3px] sm:-mx-8 sm:rounded-full md:-mx-12"
      >
        <ScrollArea.Thumb className="relative !h-[8px] cursor-grab rounded-full bg-primary/50 hover:bg-primary" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}
