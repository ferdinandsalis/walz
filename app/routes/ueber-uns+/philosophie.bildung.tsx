export const handle = {
  title: 'Bildung',
  abstract: 'Zusammenhänge erkennen',
  image: '/images/bildung_anders.jpg',
  link: '/ueber-uns/philosophie/bildung',
}

export default function Bildung() {
  return (
    <div className="space-y-8">
      <h1 className="mb-8 font-condensed text-4xl font-bold text-secondary">
        Bildung
      </h1>

      <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
        <p>
          Anders als Ausbildung verändert Bildung Menschen. Wesentliches Ziel
          ist es, dass die Jugendlichen komplexe gesellschaftliche Zusammenhänge
          verstehen, begreifen, erklären und klären lernen. Die Walz entwickelt
          als Antwort auf die ständig wechselnden Anforderungen der Gesellschaft
          immer wieder neue Erfahrungs- und Lernräume (über den klassischen
          Lehrplan einer AHS hinaus), so passen wir unser Programm laufend an
          und entwickeln es weiter.
        </p>
        <p>
          Wir legen größten Wert auf die Pflege des sprachlichen Ausdrucks und
          wollen einen Zugang zur Literatur legen, nicht zuletzt, weil es bei
          der Zentralmatura kaum mehr eine Rolle spielt. Neben kognitiven
          Leistungen sind wir der Überzeugung, dass der Zugang zu Kunst einem
          tiefen humanen Bedürfnis entspricht, dem wir mit Bildhauerei, Malen,
          Kunstreisen und vor allem Theater Raum geben.
        </p>
      </div>
    </div>
  )
}
