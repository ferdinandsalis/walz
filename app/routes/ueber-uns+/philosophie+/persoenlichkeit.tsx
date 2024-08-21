export const handle = {
  id: 'persoenlichkeit',
  title: 'Persönlichkeit',
  abstract: 'Potenziale entfalten',
  image: '/images/persoenlichkeit_theater.jpg',
  link: '/ueber-uns/philosophie/persoenlichkeit',
}

export function meta() {
  return [{ title: 'Philosophie: Persönlichkeit | Walz' }]
}

export default function Persoenlichkeit() {
  return (
    <div className="space-y-8 hyphens-auto text-pretty">
      <h1 className="mb-8 font-condensed text-4xl font-bold text-secondary">
        Persönlichkeit
      </h1>
      <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
        <p>
          Auch wenn sich die Gesellschaft rapide ändert, bleibt für Jugendliche
          die alles bestimmende Frage ihres Alters: „Wer bin ich?“ Diesen
          Suchprozess wollen wir bewusst unterstützen und fördern. Wir sehen es
          als unsere Aufgabe, unterschiedlichste Erfahrungsräume zu schaffen,
          damit die Jugendlichen dieser Frage nachgehen zu können.
        </p>
        <p>
          Wöchentliche Reflexionen spielen eine selbstverständliche Rolle,
          ebenso wie Mentoring. Eine Potentialanalyse, individuelle
          Lernvereinbarungen, gezielte Entwicklungsbegleitung und -förderung
          sowie therapeutische Unterstützung sind wichtige Bausteine des
          Walz-Programms.
        </p>
        <p>
          Die vielen Theaterprojekte sind Eckpfeiler der Walz: Sie ermöglichen
          einerseits Bildung zu erfahren, und bieten andererseits auch
          vielfältige Möglichkeiten, Emotionen Ausdruck zu verleihen und sich
          auszuprobieren. Theater ermöglicht den Jugendlichen, sich selbst neu
          kennenzulernen und ihr einzigartiges Potenzial an Begabungen und
          Fähigkeiten zu erkunden und zu aktivieren. Sich in eine andere Rolle
          hineinzuversetzen und so neue Perspektiven kennenzulernen, ist ein
          Weg, um Empathie und Toleranz zu entwickeln. Vielleicht werden sogar
          bisher unbekannte Teile der eigenen Persönlichkeit entdeckt?
          Zusätzlich wird ein Bewusstsein dafür entwickelt, wie man auf andere
          wirkt – oder was man der Umwelt zeigt. Nebenbei werden selbstbewusstes
          Auftreten und Präsentationsfähigkeiten geschult.
        </p>
      </div>
      <blockquote>
        <p className="mb-2 max-w-[30ch] font-condensed text-2xl font-bold leading-tight text-stone-700">
          Who is it who can tell me who I am?
        </p>
        <p className="font-bold text-primary">William Shakespeare</p>
      </blockquote>
    </div>
  )
}
