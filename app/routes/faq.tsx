import { json } from '@remix-run/node'
import fs from 'fs/promises'
import path from 'path'

function postFromModule(module: any) {
  return {
    slug: module.filename.replace(/\.mdx?$/, ''),
    ...module.attributes,
  }
}

const POSTS_DIR = path.join(process.cwd(), 'app/routes/questions')

export async function loader() {
  const questionFiles = await fs.readdir(POSTS_DIR)

  const questions = await Promise.all(
    questionFiles.map(async filename => {
      const source = await fs.readFile(path.join(POSTS_DIR, filename), 'utf8')
      return { filename, source }
    }),
  )

  return json(questions.map(postFromModule))
}

export default function Faq() {
  return (
    <div className="">
      <h1 className="absolute left-0 origin-top-left rotate-90 scale-[4] font-condensed text-xl font-bold text-stone-500 opacity-10">
        Häufige Fragen
      </h1>

      <div className="space-y-8">
        <article>
          <h2 className="mb-2 text-2xl font-bold text-secondary">
            Was heißt eigentlich Walz?
          </h2>
          <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
            <p>
              Walz ist das mittelalterliche Gesellenwandern, die Tradition,
              einige Jahre in die Fremde zu reisen, dort zu arbeiten, um die
              eigenen Kenntnisse und Fähigkeiten zu erweitern. Vom 16. Bis zum
              19. Jahrhundert war die Wanderpflicht eine Vorbedingung für die
              Zulassung zum Handwerksmeisterprüfung. Dieses Lernen und Arbeiten
              wollen wir mit der Walz ins 21. Jahrhundert holen.
            </p>
          </div>
        </article>
        <article>
          <h2 className="mb-2 text-2xl font-bold text-secondary">
            Wieso gibt es Externistenprüfungen?
          </h2>
          <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
            <p>
              Die Walz hat doch ein Öffentlichkeitsrecht, warum der Aufwand, die
              Leistungsbeurteilung extern durchzuführen? Ein wichtiges Prinzip
              der Walz ist es, dass die Personalunion von Vorbereitenden und
              Prüfenden aufgehoben ist. In keiner Sportart ist bei einem Turnier
              der/die Trainer:in auch der/die Schiedrichter:in, oder? Die
              Externistenprüfungen erfüllen aber auch mehrere Zwecke.
              Vordergründig sollte es bei Prüfungen um die Beherrschung des
              Stoffs gehen, die Überprüfung soll möglichst objektiv ablaufen-
              das Argument „Der/die mag mich nicht“ wird entkräftet. Zusätzlich
              bereitet dieser Modus auf eine mögliche Uni-Karriere vor. Um sich
              das umfangreiche Wissen eines Gegenstandes aneignen zu können,
              steht ein Fach geblockt auf dem Stundenplan. In einer intensiven
              Unterrichtzeit wird Themengebiet um Themengebiet durchgenommen, je
              nach Fach der Stoff von zwei bis vier Jahren behandelt und
              erarbeitet. Bei der externen Prüfung müssen die Jugendlichen dann
              beweisen, dass sie den Stoff im gesamten Umfang beherrschen.
            </p>
          </div>
        </article>
        <article>
          <h2 className="mb-2 text-2xl font-bold text-secondary">
            Wie kann ich die Walz kennenlernen?
          </h2>
          <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
            <p>
              Jeder Jahrgang bereitet mindestens einmal pro Jahr ein
              Theaterstück vor. Die Aufführungen sind eine wunderbare
              Gelegenheit, die Walz kennenzulernen! Bei den Informationsabenden
              (Link zu ?) gibt es für alle Jugendlichen und Eltern Gelegenheit,
              sich über die Walz, das Programm und die Kosten zu informieren und
              sich auch für den Aufnahmetag anzumelden. Einmal pro Jahr findet
              unser Tag der offenen Tür statt. Hier werden Projekte vorgestellt,
              es gibt Mitmach-Stationen und man kann sich von Walzist:innen
              durch die Schule führen lassen. (Link Ankündigung TATÜ) Jedes Jahr
              entsteht das Book oft he Year- mit Erfahrungsberichten,
              ausgewählten Fotos etc. (LINK letztes BOTY) Für einen Beitrag von
              XX € schicken wir dir auch gerne das eine oder andere Book oft he
              Year per Post. Schick uns einfach eine E-Mail an info@walz.at
            </p>
          </div>
        </article>
        <article>
          <h2 className="mb-2 text-2xl font-bold text-secondary">
            Was kostet die Walz?
          </h2>
          <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
            <p>
              Die Walz finanziert sich zu einem großen Teil selbst. Daher müssen
              wir Schulgeld einheben. Durch private Sponsoren steht der Walz ein
              gewisser Betrag für Stipendien zur Verfügung. Dieser Betrag wird
              auf mehrere Jugendliche aufgeteilt. Im Bedarfsfall kann ein Antrag
              (inkl. Einkommensnachweise und Begründung) gestellt werden.
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}
