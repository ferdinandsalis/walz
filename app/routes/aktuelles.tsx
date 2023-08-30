import { Link } from '@remix-run/react'
import { dates } from 'app/data/dates'
import { take } from 'ramda'
import { news } from '~/data/news'
import { currentYears } from '~/data/years'
import { Newsletter } from './_index'

export default function Aktuelles() {
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
            <Link to="#beiträge" className="text-xl font-bold">
              Beiträge
            </Link>
          </li>
          <li>
            <Link to="#termine" className="text-xl font-bold">
              Termine
            </Link>
          </li>
          <li>
            <Link to="#jahrgaenge" className="text-xl font-bold">
              Jahrgänge
            </Link>
          </li>
        </ol>
      </nav>

      <div className="space-y-12 md:space-y-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <section id="beitraege" className="col-span-2">
            <h1 className="mb-8 font-condensed text-2xl font-bold text-secondary md:text-4xl">
              Beiträge
            </h1>
            <div className="flex flex-col gap-6">
              {news.map(article => (
                <article
                  key={article.title}
                  className="rounded-md border p-6 shadow"
                >
                  <h1 className="mb-4 text-xl font-bold">{article.title}</h1>
                  <p className="mb-4">{article.abstract}</p>
                  <Link
                    to={article.to}
                    prefetch="intent"
                    className="inline-block font-bold text-primary"
                  >
                    Weiterlesen
                  </Link>
                </article>
              ))}
            </div>
          </section>
          <section>
            <Newsletter />
          </section>
        </div>

        <hr className="h-[4px] border-none bg-stone-200/70" />

        <section id="jahrgaenge">
          <h1 className="mb-8 font-condensed text-2xl font-bold text-secondary md:text-4xl">
            Jahrgänge
          </h1>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {currentYears.map(year => (
              <article
                key={year.name}
                className="flex rounded-md bg-card shadow-md"
              >
                <div className="relative flex-1 overflow-hidden py-6 pl-6">
                  <div className="text-1xl absolute right-10 top-10 scale-[7] font-black text-primary opacity-20">
                    {year.symbol}
                  </div>
                  <h1 className="inline-flex gap-1 text-3xl font-bold">
                    <span>{year.name}</span>
                    <span className="text-lg font-bold text-secondary">
                      {/* years till now from year.startedAt */}
                      {new Date().getFullYear() - year.startedAt.getFullYear()}
                    </span>
                  </h1>
                  <p>{year.mentor?.name}</p>
                  <p className="text-muted-foreground">
                    {year.startedAt.toLocaleString('de-at', {
                      dateStyle: 'long',
                    })}
                  </p>
                </div>
                <img
                  src={year.currentCover}
                  alt={`${year.name} Foto`}
                  className="aspect-video w-32 flex-1 rounded-r-md object-cover object-center md:w-48 lg:w-60 xl:w-80"
                />
              </article>
            ))}
          </div>
        </section>

        <hr className="h-[4px] border-none bg-stone-200/70" />

        <section id="termine">
          <h1 className="mb-8 font-condensed text-2xl font-bold text-secondary md:text-4xl">
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
              <p>{date.description}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}
