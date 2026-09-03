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
 * Answers must not say anything the rest of the site does not already say, and
 * must link to the page that owns a detail rather than repeating it — figures,
 * dates and free places change without this file being touched.
 */
export const faqs: Faq[] = [
  {
    slug: 'wie-kann-ich-die-walz-kennenlernen',
    question: 'Wie kann ich die Walz kennenlernen?',
    featured: true,
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
    slug: 'wie-laeuft-das-aufnahmeverfahren-ab',
    question: 'Wie läuft das Aufnahmeverfahren ab?',
    featured: true,
    teaser:
      'Du füllst das Anmeldeformular aus und bekommst gemeinsam mit deinen Eltern eine Bestätigung per Mail. Ab Mitte November, nach dem Tag der offenen Tür, beginnt das Aufnahmeverfahren mit einem persönlichen Aufnahmegespräch.',
    answer: (
      <>
        <p>
          Wenn du dich an der Walz bewerben willst, fülle bitte das{' '}
          <Link
            to="/aufnahme/formular"
            className="underline underline-offset-2"
          >
            Anmeldeformular
          </Link>{' '}
          aus. Nach Absenden des Formulars senden wir dir und deinen Eltern eine
          Bestätigung per Mail mit Details zum Aufnahmetermin zu.
        </p>
        <p>
          Für den neuen Jahrgang beginnen wir ab Mitte November (nach dem Tag
          der offenen Tür) das Aufnahmeverfahren. Dafür melden wir uns
          telefonisch bei deinen Eltern, um einen Aufnahmetermin zu vereinbaren.
        </p>
        <p>
          Bei dem persönlichen Aufnahmegespräch mit der Schulleiterin und
          dem/der Mentor:in werden die gegenseitigen Erwartungen abgeklärt und
          bei kleinen Aufgaben bekommst du einen ersten Einblick in die
          Arbeitsweise der Walz. Wir bitten deine Eltern, zum Aufnahmetermin
          mitzukommen.
        </p>
        <p>
          Ab Jänner erhalten du und deine Eltern eine Zu- oder Absage. Wenn ihr
          euch für die Walz entscheidet, ist dein Platz fix reserviert, sobald
          der Schulvertrag unterschrieben und der Aufnahmebeitrag eingezahlt
          ist. Den aktuellen Stand der Aufnahme findest du{' '}
          <Link
            to="/aufnahme#vorgehensweise"
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
    slug: 'wer-kann-sich-bewerben',
    question: 'Wer kann sich für die Walz bewerben?',
    featured: true,
    teaser:
      'Der Besuch der Walz beginnt mit der 9. Schulstufe. Du kannst dich bewerben, wenn du zum Zeitpunkt der Anmeldung die 8. Schulstufe besuchst und sie im selben Jahr positiv abschließt – ohne Aufstiegsklausel.',
    answer: (
      <>
        <p>
          Der Besuch der Walz beginnt mit der 9. Schulstufe, d.h. Jugendliche,
          die auf die Walz kommen möchten, müssen zum Zeitpunkt der Anmeldung
          die 8. Schulstufe besuchen und sie im selben Jahr positiv abschließen
          (keine Aufstiegsklausel).
        </p>
        <p>
          Alle wichtigen Informationen und Rahmenbedingungen sind in unserem
          Schulvertrag zusammengefasst, den du bei den{' '}
          <Link
            to="/aufnahme#voraussetzungen"
            className="underline underline-offset-2"
          >
            Voraussetzungen
          </Link>{' '}
          herunterladen kannst.
        </p>
      </>
    ),
  },
  {
    slug: 'ist-ein-quereinstieg-moeglich',
    question: 'Ist ein Quereinstieg möglich?',
    teaser:
      'Grundsätzlich ist ein Quereinstieg in den ersten 3 Walzjahren möglich (9., 10., 11. Schulstufe). Fülle dafür das Anmeldeformular aus – wir melden uns für einen persönlichen Vorstellungstermin.',
    answer: (
      <>
        <p>
          Grundsätzlich ist ein Quereinstieg in den ersten 3 Walzjahren möglich
          (9., 10., 11. Schulstufe). Wenn du dich für einen Quereinstieg
          interessierst, fülle bitte das Anmeldeformular aus und wir melden uns
          für einen persönlichen Vorstellungstermin, bei dem auch deine Eltern
          dabei sein sollen.
        </p>
        <p>
          Ob es derzeit freie Plätze gibt, steht bei den{' '}
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
      'Die Walz finanziert sich zu einem großen Teil selbst, daher heben wir Schulgeld ein. Im Bedarfsfall kannst du ein Stipendium beantragen.',
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
      'Durch private Sponsoren und die Initiative „Ehrensache Walz“ steht der Walz ein Betrag für Stipendien zur Verfügung, der auf mehrere Jugendliche aufgeteilt wird. Im Bedarfsfall kann ein Antrag gestellt werden.',
    answer: (
      <>
        <p>
          Durch private Sponsoren und der Initiative{' '}
          <Link
            to="/alumni#ehrensache"
            className="underline underline-offset-2"
          >
            „Ehrensache Walz“
          </Link>{' '}
          steht der Walz ein gewisser Betrag für Stipendien zur Verfügung.
          Dieser Betrag wird auf mehrere Jugendliche aufgeteilt. Im Bedarfsfall
          kann ein Antrag (inkl. Einkommensnachweise und Begründung) gestellt
          werden.
        </p>
        <p>
          Ziel der Initiative ist es, Jugendlichen den Besuch der Walz zu
          ermöglichen, auch wenn ihre Familien die dafür notwendigen
          finanziellen Mittel nicht vollständig aufbringen können.
        </p>
        <p>
          Hierfür melde dich mit deiner Anfrage bitte an{' '}
          <a
            href="mailto:office@walz.at"
            className="underline underline-offset-2"
          >
            office@walz.at
          </a>
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
      'Die Walz ist eine private Bildungseinrichtung mit Öffentlichkeitsrecht für Jugendliche von 14 bis 19 Jahren (9.–13. Schulstufe) und schließt mit Matura (Externistenreifeprüfung) ab.',
    answer: (
      <>
        <p>
          Die Walz ist eine private Bildungseinrichtung mit Öffentlichkeitsrecht
          für Jugendliche im Alter von 14 bis 19 Jahren (9.–13. Schulstufe). Die
          Walz schließt mit Matura (Externistenreifeprüfung) ab.
        </p>
        <p>
          Der Unterricht orientiert sich am Lehrplan eines
          Oberstufenrealgymnasiums mit Bildnerischem Gestalten und
          Werkerziehung. Welche Prüfungen in welchem Jahr anstehen, findest du
          im{' '}
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
    slug: 'wie-viele-jugendliche-sind-in-einem-jahrgang',
    question: 'Wie viele Jugendliche sind in einem Jahrgang?',
    teaser:
      'Die Walz bietet fünf Jahrgängen von jeweils ca. 30 Jugendlichen verschiedenste Lernwelten an. Jeder Jahrgang wird von Mentor:innen begleitet.',
    answer: (
      <>
        <p>
          Die Walz bietet fünf Jahrgängen von jeweils ca. 30 Jugendlichen
          verschiedenste Lernwelten an, die sie auf ein selbstbestimmtes Leben
          in einer sich verändernden Welt vorbereiten sollen.
        </p>
        <p>
          <Link to="/ueber-uns#mentor" className="underline underline-offset-2">
            Mentor:innen
          </Link>{' '}
          sind für ihren Jahrgang verantwortlich. Ihre Kernfunktion ist die
          Entwicklungsbegleitung der Jugendlichen, wobei sie deren Stärken
          fördern, Begabungen unterstützen und sie in individuellen
          Lernsituationen begleiten.
        </p>
      </>
    ),
  },
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
    slug: 'warum-ist-die-walz-smartphone-freie-zone',
    question: 'Warum ist die Walz Smartphone-freie Zone?',
    featured: true,
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
