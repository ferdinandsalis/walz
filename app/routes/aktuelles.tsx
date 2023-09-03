import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { take } from 'ramda'
import { dates } from '#app/data/dates.ts'
import { news } from '#app/data/news.ts'
import { currentYears } from '#app/data/years.ts'
import { Newsletter } from './_index.tsx'
import { ArrowRight, BabyIcon } from 'lucide-react'
import { Divider } from '#app/components/ui/divider.tsx'
import { LoaderArgs, json } from '@remix-run/node'
import { loader as newsLoader } from './aktuelles_.beitraege+/_index.tsx'

export async function loader(loaderArgs: LoaderArgs) {
  const response = await newsLoader(loaderArgs)
  const data = await response.json()

  console.log({ news: data })
  return json({ news: data })
}

export default function Aktuelles() {
  const loaderData = useLoaderData()
  console.log(loaderData)
  const news = loaderData.news
  return (
    <div className="md:mt-12">
      <h1 className="absolute left-0 origin-top-left rotate-90 scale-[4] font-condensed text-xl font-bold text-stone-500 opacity-10">
        Aktuelles
      </h1>

      <nav className="mb-12 flex flex-col space-y-1 md:mb-16">
        <h2 className="mb-1 text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Inhalt
        </h2>
        <ol className="list-inside list-decimal space-y-1 md:list-outside">
          <li>
            <Link to="#meldungen" className="text-xl font-bold">
              Meldungen
            </Link>
          </li>
          <li>
            <Link to="#jahrgaenge" className="text-xl font-bold">
              Jahrgänge
            </Link>
          </li>
          <li>
            <Link to="#termine" className="text-xl font-bold">
              Termine
            </Link>
          </li>
        </ol>
      </nav>

      <div className="space-y-12 md:space-y-16">
        <Divider />

        <section id="meldungen" className="col-span-2">
          <h1 className="mb-8 font-condensed text-2xl font-bold text-primary md:text-4xl">
            Meldungen
          </h1>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news &&
              take(3, news).map(article => (
                <article
                  key={article.title}
                  className="flex flex-col rounded-md bg-card p-6 shadow"
                >
                  <div className="flex-1">
                    <h1 className="mb-4 text-xl font-bold text-secondary md:text-2xl">
                      {article.title}
                    </h1>
                    <p className="mb-4">{article.abstract}</p>
                  </div>
                  <footer>
                    <Link
                      to={article.to}
                      prefetch="intent"
                      className="group/more mt-4 flex items-center font-condensed text-lg tracking-wide"
                    >
                      <span className="underline-offset-2 group-hover/more:underline">
                        Zur Meldung
                      </span>
                      <ArrowRight
                        size="20"
                        className="stroke-primary transition-transform group-hover/more:translate-x-1"
                      />
                    </Link>
                  </footer>
                </article>
              ))}
          </div>
        </section>

        <Divider />

        <section id="jahrgaenge">
          <h1 className="mb-8 font-condensed text-2xl font-bold text-primary md:text-4xl">
            Jahrgänge
          </h1>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {currentYears
              .filter(year => !year.graduatedAt)
              .map(year => (
                <article
                  key={year.name}
                  className="flex rounded-md bg-card shadow-md"
                >
                  <div className="relative flex-1 overflow-hidden py-6 pl-6">
                    <div className="text-1xl absolute right-14 top-10 scale-[7] font-black text-primary opacity-10">
                      {year.symbol}
                    </div>
                    <h1 className="inline-flex gap-1 text-3xl font-bold">
                      <span>{year.name}</span>
                      <span className="text-lg font-bold text-primary">
                        {/* years till now from year.startedAt */}
                        {new Date().getFullYear() +
                          1 -
                          year.startedAt.getFullYear()}
                      </span>
                    </h1>
                    <div className="mb-2">
                      <Link
                        className="font-bold text-secondary hover:underline hover:underline-offset-2"
                        to={`/ueber-uns/#${year.mentor?.name}`}
                      >
                        {year.mentor?.name}
                      </Link>
                    </div>
                    <p className="text-muted-foreground">
                      {year.startedAt.toLocaleString('de-at', {
                        dateStyle: 'long',
                      })}
                    </p>
                  </div>
                  <div className="relative flex aspect-video w-32 rounded-r-md md:w-60 lg:w-60 xl:w-80">
                    {year.currentCover ? (
                      <img
                        src={year.currentCover}
                        alt={`${year.name} Foto`}
                        className="flex-1 rounded-r-md object-cover object-center"
                      />
                    ) : (
                      <div className="flex flex-1 items-center justify-center rounded-r-md  bg-gradient-to-t from-secondary/40 to-transparent ">
                        <BabyIcon
                          size={96}
                          className="w-12 stroke-secondary/20 md:w-24"
                        />
                      </div>
                    )}
                    <div
                      role="presentation"
                      className="absolute inset-0 rounded-r-md ring-2 ring-inset ring-card/30"
                    />
                  </div>
                </article>
              ))}
          </div>
        </section>

        <Divider />

        <section id="termine">
          <h1 className="mb-8 font-condensed text-2xl font-bold text-primary md:text-4xl">
            Termine
          </h1>
          <select>
            {currentYears.map(year => (
              <option key={year.name}>{year.name}</option>
            ))}
          </select>
          {take(3, dates).map(date => (
            <article key={date.date.toISOString()}>
              <h1>{date.title}</h1>
              <time dateTime={date.date.toISOString()}>
                {date.date.toLocaleDateString()}
              </time>
              <p>{date?.description}</p>
            </article>
          ))}
        </section>

        <section>
          <Newsletter />
        </section>
      </div>
    </div>
  )
}
