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
  /**
   * Shown in the accordion on the landing page. Every question, featured or
   * not, appears on /haeufige-fragen and in its structured data.
   */
  featured?: boolean
}

/**
 * Single source of truth for the frequently asked questions: the full answers
 * on /haeufige-fragen, the teasers on the landing page and the FAQPage
 * structured data all read from here.
 *
 * The order below is the order both pages render in, so it leads with the
 * questions someone weighing up the school actually asks first.
 *
 * Two rules for an answer. It must be true: check every claim against what the
 * school actually says, and never infer one. And it must be ours: link to the
 * page that owns a detail instead of repeating that page's wording, so figures,
 * dates and free places stay in one place and this file cannot go stale behind
 * them. A test enforces the second rule; only reading enforces the first.
 *
 * A fact the school has confirmed belongs here even when no page carries it
 * yet. Silence on the website is not evidence that something is untrue.
 */
export const faqs: Faq[] = [
  {
    slug: 'wie-kann-ich-die-walz-kennenlernen',
    question: 'Wie kann ich die Walz kennenlernen?',
    featured: true,
    teaser:
      'Beim Tag der offenen Tür, bei den Informationsabenden und bei den öffentlichen Theateraufführungen der Jahrgänge. Alle Termine findest du unter Aktuelles. Jährlich erscheint unser Magazin mit Einblicken in unser Schuljahr und was uns pädagogisch bewegt.',
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
        <p>
          Jährlich erscheint unser{' '}
          <Link to="/magazin" className="underline underline-offset-2">
            Magazin
          </Link>{' '}
          mit Einblicken in unser Schuljahr und was uns pädagogisch bewegt.
        </p>
      </>
    ),
  },
  {
    slug: 'wie-laeuft-das-aufnahmeverfahren-ab',
    question: 'Wie läuft das Aufnahmeverfahren ab?',
    featured: true,
    teaser:
      'Am Anfang steht das Anmeldeformular. Ab Mitte November folgt das persönliche Aufnahmegespräch, ab Jänner die Zu- oder Absage.',
    answer: (
      <>
        <p>
          Am Anfang steht das{' '}
          <Link
            to="/aufnahme/formular"
            className="underline underline-offset-2"
          >
            Anmeldeformular
          </Link>
          . Ab Mitte November vereinbaren wir für den neuen Jahrgang telefonisch
          das persönliche Aufnahmegespräch, zu dem wir auch deine Eltern bitten.
          Ab Jänner folgt die Zu- oder Absage.
        </p>
        <p>
          Die einzelnen Schritte und den aktuellen Stand findest du unter{' '}
          <Link
            to="/aufnahme#vorgehensweise"
            className="underline underline-offset-2"
          >
            Aufnahme
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    slug: 'wer-kann-sich-bewerben',
    question: 'Wer kann sich für die Walz bewerben?',
    featured: true,
    teaser:
      'Die Walz beginnt mit der 9. Schulstufe. Du bewirbst dich, während du die 8. besuchst, und schließt sie im selben Jahr positiv ab.',
    answer: (
      <>
        <p>
          Die Walz beginnt mit der 9. Schulstufe. Du bewirbst dich, während du
          die 8. Schulstufe besuchst, und musst sie im selben Jahr positiv
          abschließen (keine Aufstiegsklausel). Später ist ein{' '}
          <Link
            to="/haeufige-fragen#ist-ein-quereinstieg-moeglich"
            className="underline underline-offset-2"
          >
            Quereinstieg
          </Link>{' '}
          möglich.
        </p>
        <p>
          Den Schulvertrag mit allen Rahmenbedingungen findest du unter{' '}
          <Link
            to="/aufnahme#voraussetzungen"
            className="underline underline-offset-2"
          >
            Voraussetzungen
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    slug: 'ist-ein-quereinstieg-moeglich',
    question: 'Ist ein Quereinstieg möglich?',
    teaser:
      'Grundsätzlich ja, in den ersten drei Walzjahren: 9., 10. und 11. Schulstufe.',
    answer: (
      <>
        <p>
          Grundsätzlich ja, in den ersten drei Walzjahren: 9., 10. und 11.
          Schulstufe. Nach dem{' '}
          <Link
            to="/aufnahme/formular"
            className="underline underline-offset-2"
          >
            Anmeldeformular
          </Link>{' '}
          melden wir uns für einen persönlichen Vorstellungstermin, zu dem auch
          deine Eltern kommen sollen.
        </p>
        <p>
          Ob gerade Plätze frei sind, steht unter{' '}
          <Link
            to="/aufnahme#voraussetzungen"
            className="underline underline-offset-2"
          >
            Voraussetzungen
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    slug: 'was-kostet-die-walz',
    question: 'Was kostet die Walz?',
    featured: true,
    teaser:
      'Die Walz finanziert sich zu einem großen Teil selbst und hebt daher Schulgeld ein. Dank privater Spenden gibt es ein Kontingent an Teilstipendien.',
    answer: (
      <>
        <p>
          Die Walz finanziert sich zu einem großen Teil selbst. Daher müssen wir
          Schulgeld einheben. Eine Aufschlüsselung findest du{' '}
          <Link to="/aufnahme#kosten" className="underline underline-offset-2">
            hier
          </Link>
          .
        </p>
        <p>
          Im Bedarfsfall stehen{' '}
          <Link
            to="/haeufige-fragen#gibt-es-stipendien"
            className="underline underline-offset-2"
          >
            Stipendien
          </Link>{' '}
          zur Verfügung.
        </p>
      </>
    ),
  },
  {
    slug: 'gibt-es-stipendien',
    question: 'Gibt es Stipendien?',
    featured: true,
    teaser:
      'Ja. Dank privater Spenden und der Initiative „Ehrensache Walz“ gibt es ein Kontingent an Teilstipendien.',
    answer: (
      <>
        <p>
          Ja. Dank privater Spenden und der Initiative{' '}
          <Link
            to="/alumni#ehrensache"
            className="underline underline-offset-2"
          >
            „Ehrensache Walz“
          </Link>{' '}
          gibt es ein Kontingent an Teilstipendien, das auf mehrere Jugendliche
          aufgeteilt wird. Im Bedarfsfall kannst du einen Antrag mit
          Einkommensnachweisen und Begründung stellen. Melde dich dafür bei{' '}
          <a
            href="mailto:office@walz.at"
            className="underline underline-offset-2"
          >
            office@walz.at
          </a>
          .
        </p>
        <p>
          Mehr dazu unter{' '}
          <Link
            to="/aufnahme#stipendien"
            className="underline underline-offset-2"
          >
            Stipendien
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    slug: 'mit-welchem-abschluss-endet-die-walz',
    question: 'Mit welchem Abschluss endet die Walz?',
    featured: true,
    teaser:
      'Mit der Matura, abgelegt als Externistenreifeprüfung. Die Walz hat Öffentlichkeitsrecht und begleitet Jugendliche von der 9. bis zur 13. Schulstufe.',
    answer: (
      <>
        <p>
          Mit der Matura, abgelegt als{' '}
          <Link
            to="/haeufige-fragen#wieso-gibt-es-externistenpruefungen"
            className="underline underline-offset-2"
          >
            Externistenreifeprüfung
          </Link>
          . Die Walz hat Öffentlichkeitsrecht und orientiert sich am Lehrplan
          eines Oberstufenrealgymnasiums mit Bildnerischem Gestalten und
          Werkerziehung.
        </p>
        <p>
          Welche Prüfungen wann anstehen, steht im{' '}
          <Link to="/curriculum" className="underline underline-offset-2">
            Curriculum
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    slug: 'wieso-gibt-es-externistenpruefungen',
    question: 'Wieso gibt es Externistenprüfungen?',
    teaser:
      'Bei uns sind Vorbereitende und Prüfende nicht dieselben Personen. Wie im Sport: Die Trainer:innen unterstützen, die Schiedsrichter:innen beurteilen unabhängig. Das verändert das Verhältnis zwischen Lehrenden und Lernenden und bereitet zugleich auf eine mögliche Uni-Karriere vor.',
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
    slug: 'wie-viele-jugendliche-sind-in-einem-jahrgang',
    question: 'Wie viele Jugendliche sind in einem Jahrgang?',
    teaser:
      'Rund 30 Jugendliche. Die Walz hat fünf Jahrgänge dieser Größe, jeden begleitet ein:e Mentor:in über die gesamte Walzzeit.',
    answer: (
      <p>
        Rund 30 Jugendliche. Die Walz hat fünf Jahrgänge dieser Größe. Jeden
        Jahrgang begleitet ein:e{' '}
        <Link to="/ueber-uns#mentor" className="underline underline-offset-2">
          Mentor:in
        </Link>{' '}
        über die gesamte Walzzeit, fördert Stärken und unterstützt die
        Entwicklung der Jugendlichen.
      </p>
    ),
  },
  {
    slug: 'was-heisst-eigentlich-walz',
    question: 'Was heißt eigentlich Walz?',
    teaser:
      'Der Begriff Walz hat seinen Ursprung im mittelalterlichen Gesellenwandern. Durch Reisen, Arbeiten und Lernen wurden die eigenen Kenntnisse und Fähigkeiten erweitert. Dieses Prinzip holen wir ins 21. Jahrhundert.',
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
    slug: 'warum-ist-die-walz-smartphone-freie-zone',
    question: 'Warum ist die Walz Smartphone-freie Zone?',
    featured: true,
    teaser:
      'Seit 2017 ist die Walz eine Smartphone-freie Zone. Das verbessert die Aufmerksamkeitsspanne, fördert den sozialen Austausch und ermöglicht soziales Lernen, auch in der Peer-Group.',
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
]

/** The questions the landing page shows, in the same order as the full list. */
export const featuredFaqs = faqs.filter(faq => faq.featured)

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
