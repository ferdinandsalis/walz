export const handle = {
  title: 'Praxis',
  abstract: 'Erfahrungen sammeln',
  image: '/images/praxis_uhrenwerkstatt.jpg',
  link: '/ueber-uns/philosophie/praxis',
}

export function meta() {
  return [{ title: 'Philosophie: Praxis | Walz' }]
}

export default function Praxis() {
  return (
    <div className="space-y-8 text-pretty hyphens-auto">
      <h1 className="font-condensed text-secondary mb-8 text-4xl font-bold">
        Praxiserfahrung
      </h1>
      <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
        <p>
          Learning by Doing – Ziel der Projekte in der Walz ist es, das
          erworbene Wissen in der Praxis anzuwenden und sich in der realen Welt
          außerhalb der Schule zu bewähren. Auf dem Programm stehen neben
          Praktika in der Landwirtschaft, im Forst und in Handwerksbetrieben
          auch die Gründung eines Unternehmens im Rahmen der Junior Company
          sowie zahlreiche Projekte im Ausland. Dadurch können die Jugendlichen
          nicht nur ihre Sprachkenntnisse verbessern, sondern auch fachliche
          Kompetenzen erwerben und soziale Fähigkeiten ausbauen.
        </p>
      </div>
      <blockquote>
        <p className="font-condensed mb-2 max-w-[30ch] text-2xl leading-tight font-bold text-stone-700">
          Who I am—and what I need—is something I have to find out myself.
        </p>
        <p className="text-primary font-bold">Chinua Achebe</p>
      </blockquote>
    </div>
  )
}
