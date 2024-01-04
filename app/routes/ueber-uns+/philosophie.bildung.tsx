import { MetaFunction } from '@remix-run/node'

export const handle = {
  title: 'Bildung',
  abstract: 'Zusammenhänge erkennen',
  image: '/images/bildung_anders.jpg',
  link: '/ueber-uns/philosophie/bildung',
}

export const meta: MetaFunction = () => {
  return [{ title: 'Philosophie: Bildung | Walz' }]
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
          ist es, dass die Jugendlichen lernen, komplexe gesellschaftliche
          Zusammenhänge zu verstehen, zu begreifen und zu erklären. Die Walz
          entwickelt als Antwort auf die ständig wechselnden Anforderungen der
          Gesellschaft immer wieder neue Erfahrungs- und Lernräume (über den
          klassischen Lehrplan einer AHS hinaus), so passen wir unser Programm
          laufend an und entwickeln es weiter.
        </p>
        <p>
          Wir legen größten Wert auf die Pflege des sprachlichen Ausdrucks und
          wollen einen Zugang zur Literatur legen, nicht zuletzt weil sie bei
          der Zentralmatura kaum mehr eine Rolle spielt. Wir sind der
          Überzeugung, dass Kunst einem tiefen humanen Bedürfnis entspricht, dem
          wir mit Bildhauerei, Malen, Kunstreisen und vor allem Theater Raum
          geben.
        </p>
      </div>

      <blockquote>
        <p className="mb-2 max-w-[30ch] font-condensed text-2xl font-bold leading-tight text-stone-700">
          Bildung ist die mächtigste Waffe, die du verwenden kannst, um die Welt
          zu verändern.
        </p>
        <p className="font-bold text-primary">Nelson Mandela</p>
      </blockquote>
    </div>
  )
}
