import React from 'react'
import { Link } from 'react-router'

export type Faq = {
  /**
   * Anchor id of the answer on /haeufige-fragen. Also the deep-link target
   * used by the teasers on the landing page, so it must not change casually.
   */
  slug: string
  question: string
  /** Two or three sentences, shown inline on the landing page. */
  teaser: string
  /** The full answer, as one or more paragraphs. */
  answer: React.ReactNode
}

/**
 * Single source of truth for the frequently asked questions: the full answers
 * on /haeufige-fragen, the teasers on the landing page and the FAQPage
 * structured data all read from here.
 */
export const faqs: Faq[] = [
  {
    slug: 'was-heisst-eigentlich-walz',
    question: 'Was heißt eigentlich Walz?',
    teaser:
      'Walz ist das mittelalterliche Gesellenwandern: einige Jahre in die Fremde reisen, dort arbeiten und dabei die eigenen Kenntnisse und Fähigkeiten erweitern. Dieses Lernen und Arbeiten wollen wir ins 21. Jahrhundert holen.',
    answer: (
      <p>
        Walz ist das mittelalterliche Gesellenwandern, die Tradition, einige
        Jahre in die Fremde zu reisen, dort zu arbeiten, um die eigenen
        Kenntnisse und Fähigkeiten zu erweitern. Vom 16. bis zum 19. Jahrhundert
        war die Wanderpflicht eine Vorbedingung für die Zulassung zur
        Meisterprüfung. Dieses Lernen und Arbeiten wollen wir ins 21.
        Jahrhundert holen.
      </p>
    ),
  },
  {
    slug: 'wieso-gibt-es-externistenpruefungen',
    question: 'Wieso gibt es Externistenprüfungen?',
    teaser:
      'Bei uns sind Vorbereitende und Prüfende nicht dieselben Personen – wie im Sport, wo Trainer:in und Schiedsrichter:in getrennt sind. Das macht die Beurteilung objektiv und bereitet zugleich auf eine mögliche Uni-Karriere vor.',
    answer: (
      <>
        <p>
          Die Walz hat ein Öffentlichkeitsrecht, warum den Aufwand betreiben,
          die Leistungsbeurteilung extern durchzuführen?
        </p>
        <p>
          Ein wichtiges Prinzip der Walz ist es, dass die Personalunion von
          Vorbereitenden und Prüfenden aufgehoben ist. In keiner Sportart ist
          bei einem Turnier der/die Trainer:in auch der/die Schiedsrichter:in,
          oder?
        </p>
        <p>
          Die Externistenprüfungen erfüllen darüber hinaus auch einen anderen
          Zweck. Vordergründig geht es bei Prüfungen um die Beherrschung des
          Stoffs; die Überprüfung soll möglichst objektiv ablaufen – das
          Argument „Der/die mag mich nicht“ wird entkräftet. Zusätzlich bereitet
          dieser Modus auf eine mögliche Uni-Karriere vor. Um sich das
          umfangreiche Wissen eines Gegenstandes aneignen zu können, steht ein
          Fach geblockt auf dem Stundenplan. In einer intensiven
          Unterrichtsphase werden verschiedene Themengebiete durchgenommen,
          wobei je nach Fach der Stoff von zwei bis vier Jahren behandelt und
          erarbeitet wird. Bei der externen Prüfung müssen die Jugendlichen dann
          beweisen, dass sie den Stoff im gesamten Umfang beherrschen.
        </p>
      </>
    ),
  },
  {
    slug: 'warum-ist-die-walz-smartphone-freie-zone',
    question: 'Warum ist die Walz Smartphone-freie Zone?',
    teaser:
      'Seit 2017 ist die Walz eine Smartphone-freie Zone. Das nimmt den Druck von FOMO, verbessert die Aufmerksamkeitsspanne und lässt in der Peer-Group echte Gespräche entstehen.',
    answer: (
      <p>
        Jonathan Haidt beschreibt in seinem Buch Generation Angst, dass
        übermäßiger Smartphone-Gebrauch besonders bei jungen Menschen zu
        Einsamkeit, sozialer Isolation und erhöhter Angst führen kann (
        <Link
          to="https://www.theatlantic.com/technology/archive/2024/03/teen-childhood-smartphone-use-mental-health-effects/677722/"
          target="_blank"
          className="underline underline-offset-2"
        >
          The Atlantic Artikel zum Buch
        </Link>
        ). Die Weltgesundheitsorganisation (WHO) warnt sogar, dass mehr als 10
        Prozent der Jugendlichen an Smartphone-Sucht leiden. Um dem
        entgegenzuwirken, ist die Walz seit 2017 eine Smartphone-freie Zone.
        Dies hilft, das Gefühl von FOMO (Fear of Missing Out) zu vermeiden, da
        niemand während der Pausen sein Handy nutzt. Ein weiteres Ziel ist es,
        die Aufmerksamkeitsspanne der Schüler:innen zu verbessern, da sie sich
        ohne ständige Ablenkung besser konzentrieren können – eine wesentliche
        Fähigkeit, um die Matura erfolgreich zu bestehen. Besonders im
        Jugendalter ist die Peer-Group von großer Bedeutung. In einer
        Smartphone-freien Umgebung lernen die Schüler:innen, sozial zu sein und
        echte, zwischenmenschliche Kommunikation zu pflegen, was für ihre
        soziale und emotionale Entwicklung entscheidend ist.
      </p>
    ),
  },
  {
    slug: 'wie-kann-ich-die-walz-kennenlernen',
    question: 'Wie kann ich die Walz kennenlernen?',
    teaser:
      'Beim Tag der offenen Tür, bei den Informationsabenden für Eltern und Jugendliche und bei den öffentlichen Theateraufführungen der Jahrgänge. Alle Termine findest du unter Aktuelles.',
    answer: (
      <>
        <p>
          Einmal im Jahr findet unser Tag der offenen Tür statt. Hier werden
          Projekte vorgestellt, es gibt Mitmach-Stationen und man kann sich von
          Walzist:innen durch die Schule führen lassen.
        </p>
        <p>
          Bei den Informationsabenden gibt es für interessierte Eltern und
          Jugendliche die Möglichkeit, sich über die Walz, das Programm und die
          Kosten zu informieren und sich für den Aufnahmetag anzumelden.
        </p>
        <p>
          Jeder Jahrgang bereitet mindestens einmal pro Jahr ein Theaterstück
          vor. Die Aufführungen sind öffentlich und eine wunderbare Gelegenheit,
          die Walz von einer anderen Seite kennenzulernen!
        </p>
        <p>
          Alle Termine findest du{' '}
          <Link
            to="/aktuelles#termine"
            className="underline underline-offset-2"
          >
            hier
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    slug: 'was-kostet-die-walz',
    question: 'Was kostet die Walz?',
    teaser:
      'Die Walz finanziert sich zu einem großen Teil selbst, daher heben wir Schulgeld ein. Für den Bedarfsfall stehen aus privaten Sponsorengeldern Stipendien zur Verfügung.',
    answer: (
      <p>
        Die Walz finanziert sich zu einem großen Teil selbst. Daher müssen wir
        Schulgeld einheben. Eine Aufschlüsselung findest du{' '}
        <Link to="/aufnahme#kosten" className="underline underline-offset-2">
          hier
        </Link>
        . Durch private Sponsoren steht der Walz ein gewisser Betrag für
        Stipendien zur Verfügung. Dieser Betrag wird auf mehrere Jugendliche
        aufgeteilt. Im Bedarfsfall kann ein Antrag (inkl. Einkommensnachweise
        und Begründung) gestellt werden.
      </p>
    ),
  },
]

/** Path of the full answer, for deep links from anywhere else on the site. */
export function faqPath(faq: Faq) {
  return `/haeufige-fragen#${faq.slug}`
}

function toPlainText(node: React.ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) {
    return node.map(child => toPlainText(child as React.ReactNode)).join('')
  }
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    const text = toPlainText(node.props.children)
    // Paragraphs read as separate sentences, so keep them apart.
    return node.type === 'p' ? `${text} ` : text
  }
  return ''
}

/** The full answer as plain text, for structured data. */
export function faqAnswerText(faq: Faq) {
  return toPlainText(faq.answer).replace(/\s+/g, ' ').trim()
}
