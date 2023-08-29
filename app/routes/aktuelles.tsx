import { dates } from 'app/data/dates'
import { take } from 'ramda'

export default function News() {
  return (
    <div className="md:mt-12">
      <h1 className="absolute left-0 origin-top-left rotate-90 scale-[4] font-condensed text-xl font-bold text-stone-500 opacity-10">
        Aktuelles
      </h1>

      <div className="space-y-12 md:space-y-16">
        <section>
          <h1 className="mb-8 font-condensed text-2xl font-bold text-secondary md:text-4xl">
            Beiträge
          </h1>
          <p>Platzhalter. Hier fehlen die letzen drei Nachrichten</p>
        </section>

        <section>
          <h1 className="mb-8 font-condensed text-2xl font-bold text-secondary md:text-4xl">
            Jahrespläne
          </h1>
          <select>
            <option>Alle</option>
            <option>Psi</option>
            <option>Alpha</option>
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
