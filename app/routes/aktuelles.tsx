import { dates } from 'app/data/dates'
import { take } from 'ramda'

export default function News() {
  return (
    <div className="mt-12 lg:mt-24">
      <h1 className="font-condensed text-xl font-bold text-primary md:text-4xl lg:text-5xl xl:text-6xl">
        Aktuelles
      </h1>
      <section>
        <h1>Beiträge</h1>
      </section>
      <section>
        <h2 className="text-secondary">Nächste Termine</h2>
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
  )
}
