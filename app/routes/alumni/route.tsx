import { loadQuery } from '@sanity/react-loader'
import { HeartHandshakeIcon } from 'lucide-react'
import { useLoaderData } from 'react-router'
import { z } from 'zod'
import { Toc } from '#app/components/toc.tsx'
import { Divider } from '#app/components/ui/divider.tsx'
import { YearCard } from '../aktuelles/route.tsx'
import { alumniQuery, type AlumniQueryResult, YearSchema } from './query.ts'

export function meta() {
  return [{ title: 'Alumni | Walz' }]
}

export async function loader() {
  const queryResult = await loadQuery<AlumniQueryResult>(alumniQuery)

  return {
    query: alumniQuery,
    data: {
      alumniYears: z.array(YearSchema).parse(queryResult.data.alumniYears),
    },
  }
}

export default function Alumni() {
  const loaderData = useLoaderData<typeof loader>()
  const { alumniYears } = loaderData.data

  return (
    <div className="relative grid grid-cols-subgrid items-start gap-8 lg:col-span-2">
      <h1 className="font-condensed text-h1 font-bold text-muted-foreground opacity-20">
        Alumni
      </h1>

      <div className="row-start-1 rounded-md bg-muted/30 p-6 lg:sticky lg:top-4 lg:z-20 lg:col-start-2 lg:row-start-2">
        <Toc
          links={[
            { name: 'Ehrensache Walz', to: '#ehrensache' },
            { name: 'Ehemalige Jahrgänge', to: '#jahrgaenge' },
          ]}
        />
      </div>

      <div className="col-start-1 grid grid-cols-1 gap-16 hyphens-auto text-balance">
        <section id="ehrensache" className="space-y-8">
          <h1 className="font-condensed text-h2 font-bold text-primary">
            Ehrensache Walz
          </h1>

          <div className="max-w-2xl space-y-4 text-base md:text-xl">
            <p>
              „Ehrensache Walz" wurde vom Vater eines Ex-Walzisten ins Leben
              gerufen. Ziel der Initiative ist es, Jugendlichen den Besuch der
              Walz zu ermöglichen, auch wenn ihre Familien die dafür notwendigen
              finanziellen Mittel nicht vollständig aufbringen können.
            </p>
          </div>

          <article className="space-y-4">
            <h2 className="font-condensed text-2xl font-bold text-secondary">
              Der Gedanke
            </h2>
            <div className="max-w-2xl space-y-4 text-base md:text-xl">
              <p>
                Eltern und ehemalige Jugendliche wissen: Der Besuch der Walz
                verändert. In einem turbulenten Lebensalter — oft nach Jahren der
                Unlust — hat die Walz vielen geholfen, wieder arbeitsfähig zu
                werden. Und die eigene Persönlichkeit zu entfalten. Die
                Betreuung durch Projektleiter:innen und Mentor:innen geht weit
                über den ohnehin hohen Level der Walz hinaus.
              </p>
              <p>
                Aus Dankbarkeit und Verbundenheit entstand die Initiative
                „Ehrensache Walz". Heute tragen sie Eltern (ehemaliger)
                Walzist:innen und ehemalige Walzist:innen selbst weiter.
              </p>
            </div>
          </article>

          <article className="space-y-4">
            <h2 className="font-condensed text-2xl font-bold text-secondary">
              Ziel
            </h2>
            <div className="max-w-2xl space-y-4 text-base md:text-xl">
              <p>
                Die Initiative ermöglicht Jugendlichen den Besuch der Walz —
                unabhängig von der finanziellen Situation ihrer Familien.
              </p>
            </div>
          </article>

          <article className="space-y-4">
            <h2 className="font-condensed text-2xl font-bold text-secondary">
              Erfolg
            </h2>
            <div className="max-w-2xl space-y-4 text-base md:text-xl">
              <p>
                Im Schuljahr 24/25 vergab die Initiative vier Teilstipendien.
                Der Bedarf ist viel höher.
              </p>
            </div>
          </article>

          <div className="max-w-2xl space-y-4 text-base md:text-xl">
            <p className="font-bold">
              Unterstütze „Ehrensache Walz" — mit einer einmaligen oder
              regelmäßigen Spende.
            </p>
          </div>

          <div className="max-w-2xl rounded-lg border border-secondary/30 bg-secondary/20 p-6 ring-8 ring-muted/20 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <HeartHandshakeIcon size={28} className="stroke-secondary" />
              <h2 className="font-condensed text-h4 font-bold text-primary">
                Spendenkonto
              </h2>
            </div>

            <dl className="space-y-2 text-base md:text-body-md">
              <div>
                <dt className="text-body-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Bankverbindung
                </dt>
                <dd>UniCredit Bank Austria</dd>
              </div>
              <div>
                <dt className="text-body-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Name
                </dt>
                <dd>W@lz Wiener Lernzentrum</dd>
              </div>
              <div>
                <dt className="text-body-xs font-bold uppercase tracking-widest text-muted-foreground">
                  IBAN
                </dt>
                <dd className="font-bold text-primary">
                  AT47 1200 0094 3508 9999
                </dd>
              </div>
              <div>
                <dt className="text-body-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Verwendungszweck
                </dt>
                <dd>Ehrensache Walz</dd>
              </div>
            </dl>

            <div className="mt-6 space-y-3 border-t border-secondary/20 pt-4 text-body-sm">
              <p>
                Spenden an die Walz sind steuerlich absetzbar. Dafür benötigen
                wir Name und Geburtsdatum.
              </p>
              <p>
                Für Fragen zu der Initiative, Spenden und der steuerlichen
                Absetzbarkeit steht{' '}
                <strong className="text-primary">Mateja Ostrogonac</strong>{' '}
                gerne zur Verfügung.
              </p>
            </div>
          </div>
        </section>

        <Divider />

        <section id="jahrgaenge" className="space-y-8">
          <h1 className="font-condensed text-h2 font-bold text-primary">
            Ehemalige Jahrgänge
          </h1>
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns:
                'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
            }}
          >
            {alumniYears.map(year => (
              <YearCard key={year._id} {...year} />
            ))}
          </div>
        </section>

        <Divider className="bg-transparent" />
      </div>
    </div>
  )
}
