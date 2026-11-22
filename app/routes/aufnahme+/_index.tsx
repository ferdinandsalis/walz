import { DownloadSimple, ArrowSquareOut, Info } from '@phosphor-icons/react'
import { loadQuery } from '@sanity/react-loader'
import { type ReactNode } from 'react'
import { Link, useLoaderData } from 'react-router'
import { type PageTitleHandle } from '#app/components/page-title.tsx'
import { PageHead, TocRail, type TocSection } from '#app/components/toc.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Divider } from '#app/components/ui/divider.tsx'
import { Notice } from '#app/components/ui/notice.tsx'
import {
  PathMarker,
  PathNode,
  PathRail,
  RailEnd,
} from '#app/components/ui/path.tsx'
import { alphabetMap } from '#app/sanity/models/year.ts'
import { trackEvent } from '#app/utils/analytics.ts'
import { AUFNAHME_STEPS } from '#app/utils/aufnahme-form.ts'
import { cn } from '#app/utils/misc.tsx'
import { FeeOverview } from './__fee-overview.tsx'
import {
  type AufnahmeQuery,
  AufnahmeQuerySchema,
  aufnahmeQuery,
} from './_index.query.ts'

export const handle: PageTitleHandle = { pageTitle: 'Aufnahme' }

export function meta() {
  return [{ title: 'Aufnahme | Walz' }]
}

export async function loader() {
  // en-CA locale produces YYYY-MM-DD format needed for Sanity date comparison
  const today = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Europe/Vienna',
  })
  const queryResult = await loadQuery<AufnahmeQuery>(aufnahmeQuery, { today })
  return AufnahmeQuerySchema.parse(queryResult.data)
}

const sections: TocSection[] = [
  { name: 'Vorgehensweise', id: 'vorgehensweise' },
  { name: 'Voraussetzungen', id: 'voraussetzungen' },
  { name: 'Kosten', id: 'kosten' },
  { name: 'Stipendien', id: 'stipendien' },
]

export default function Aufnahme() {
  const loaderData = useLoaderData<typeof loader>()
  const current = loaderData.currentSchoolYear

  return (
    <div className="relative grid grid-cols-subgrid items-start gap-8 lg:col-span-2">
      <PageHead sections={sections} />

      <TocRail
        sections={sections}
        className="hidden lg:sticky lg:top-4 lg:z-20 lg:col-start-2 lg:row-start-2 lg:grid"
      />

      <div className="col-start-1 grid grid-cols-12 gap-x-4 gap-y-16 sm:gap-x-6 lg:gap-x-8">
        <article id="vorgehensweise" className="col-span-12 space-y-8">
          <h1 className="font-condensed text-primary mb-8 text-4xl font-bold">
            Vorgehensweise
          </h1>
          <AdmissionSteps />
          {loaderData.testimonial ? (
            <TestimonialQuote testimonial={loaderData.testimonial} />
          ) : null}
        </article>

        <Divider className="col-span-12" />

        <article id="voraussetzungen" className="col-span-12 space-y-8">
          <ChapterOpener
            title="Voraussetzungen"
            image="/images/persoenlichkeit_theater.jpg"
            alt="Drei Jugendliche in Kostümen und mit Hüten spielen Theater auf einer Bühne"
            position="50% 35%"
          />
          <AdmissionFacts />
          <div className="max-w-prose space-y-4 text-base md:text-xl">
            <p>
              Der Besuch der Walz beginnt mit der 9. Schulstufe, d.h.
              Jugendliche, die auf die Walz kommen möchten, müssen zum Zeitpunkt
              der Anmeldung die 8. Schulstufe besuchen und sie im selben Jahr
              positiv abschließen (keine Aufstiegsklausel).
            </p>
            <p>
              Alle wichtigen Informationen und Rahmenbedingungen sind in unserem
              Schulvertrag zusammengefasst.{' '}
              <a
                download="Schulvertrag September 2027.pdf"
                href="/downloads/schulvertrag_september_2027.pdf"
                className="inline-flex items-center gap-1 underline underline-offset-2"
              >
                Hier herunterladen
                <DownloadSimple size={16} className="text-primary flex-none" />
              </a>
            </p>
          </div>

          <section>
            <h2 className="font-condensed text-h5 md:text-h4 mb-4 font-bold">
              Quereinstieg
            </h2>
            <div className="max-w-prose space-y-4 text-base md:text-xl">
              <p>
                Grundsätzlich ist ein Quereinstieg in den ersten 3 Walzjahren
                möglich (9., 10., 11. Schulstufe). Wenn du dich für einen
                Quereinstieg interessierst, fülle bitte das Anmeldeformular aus
                und wir melden uns für einen persönlichen Vorstellungstermin,
                bei dem auch deine Eltern dabei sein sollen.
              </p>
            </div>
          </section>
        </article>

        <Divider className="col-span-12" />

        <article id="kosten" className="col-span-12 space-y-8">
          <ChapterOpener
            title="Kosten und Finanzierung"
            image="/images/walz_paint.jpg"
            alt="Eine Jugendliche steht auf einer Leiter vor der Ziegelfassade der Walz und hält einen Pinsel in den Himmel"
            position="50% 40%"
          />
          <FigureRow figures={keyFigures} />
          <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
            <p>
              Die Walz ist ein gemeinnütziger Verein und finanziert sich zu
              einem großen Teil (über 90%) selbst. Wir müssen, um unsere Kosten
              decken zu können, Schulgeld einheben.
            </p>
            <p>
              Während bei konfessionellen Privatschulen die Personalkosten (also
              80&ndash;90% der Gesamtkosten) von der öffentlichen Hand
              übernommen werden, müssen Privatschulen (ohne kirchlichem Träger)
              für alle Kosten selbst aufkommen. Die einzige Förderung, welche
              die Walz, so wie alle anderen Privatschulen in freier
              Trägerschaft, im Moment vom Bildungsministerium erhält, hat eine
              Höhe von ca. € 700,&ndash; pro Jahr pro Schüler:in. Die Walz muss
              sich daher durch die Beiträge der Eltern finanzieren.
            </p>
            <p>
              Wir bemühen uns sehr, die Kosten so niedrig wie möglich zu halten.
              Zum Vergleich betragen laut{' '}
              <abbr title="Organisation for Economic Co-operation and Development">
                OECD
              </abbr>{' '}
              die Kosten der öffentlichen Schule für die Sekundarstufe €
              15.729,&ndash; pro Jahr (letzter verfügbarer Wert aus dem Jahr
              2019).
            </p>
          </div>
          <h2 className="font-condensed text-h5 md:text-h4 font-bold">
            Beiträge Schuljahr {current?.start.getFullYear()}/
            {current?.end.getFullYear().toString().slice(-2)}
          </h2>
          {current ? <FeeOverview list={current.costs.list} /> : null}
        </article>

        <Divider className="col-span-12" />

        <article id="stipendien" className="col-span-12 space-y-8">
          <ChapterOpener
            title="Stipendien"
            image="/images/praxis_uhrenwerkstatt.jpg"
            alt="Ein Jugendlicher setzt mit einer Pinzette ein Uhrwerk zusammen"
            position="50% 70%"
          />
          <div className="mb-8 max-w-prose space-y-4 text-base md:text-xl">
            <p>
              Durch private Sponsoren und der Initiative{' '}
              <Link
                to="/alumni#ehrensache"
                className="underline underline-offset-2"
              >
                „Ehrensache Walz"
              </Link>{' '}
              steht der Walz ein gewisser Betrag für Stipendien zur Verfügung.
              Dieser Betrag wird auf mehrere Jugendliche aufgeteilt. Im
              Bedarfsfall kann ein Antrag (inkl. Einkommensnachweise und
              Begründung) gestellt werden.
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
          </div>
        </article>
        <Divider className="col-span-12 bg-transparent" />
      </div>
    </div>
  )
}

/** What happens at each admission step, keyed by its title. */
const admissionStepTexts: Record<string, ReactNode> = {
  'Anmeldung absenden': (
    <>
      <p>
        Wenn du dich an der Walz bewerben willst, fülle bitte das
        Anmeldeformular aus.
      </p>
      <p>
        Nach Absenden des Formulars senden wir dir und deinen Eltern eine
        Bestätigung per Mail mit Details zum Aufnahmetermin zu.
      </p>
      <AdmissionDay />
    </>
  ),
  'Anruf von der Walz': (
    <p>
      Für den neuen Jahrgang beginnen wir ab Mitte November (nach dem Tag der
      offenen Tür) das Aufnahmeverfahren. Dafür melden wir uns telefonisch bei
      deinen Eltern, um einen Aufnahmetermin zu vereinbaren.
    </p>
  ),
  Aufnahmegespräch: (
    <p>
      Bei dem persönlichen Aufnahmegespräch mit der Schulleiterin und dem/der
      Mentor:in werden die gegenseitigen Erwartungen abgeklärt und bei kleinen
      Aufgaben bekommst du einen ersten Einblick in die Arbeitsweise der Walz.
      Wir bitten deine Eltern, zum Aufnahmetermin mitzukommen.
    </p>
  ),
  'Zu- oder Absage': (
    <p>
      Ab Jänner erhalten du und deine Eltern eine Zu- oder Absage. Wenn ihr euch
      für die Walz entscheidet, ist dein Platz fix reserviert, sobald der
      Schulvertrag unterschrieben und der Aufnahmebeitrag eingezahlt ist.
    </p>
  ),
}

/** When each admission step comes, keyed by its title. */
const admissionStepWhen: Record<string, string> = {
  'Anmeldung absenden': 'Jetzt',
  'Anruf von der Walz': 'ab Mitte November',
  Aufnahmegespräch: 'am Aufnahmetermin',
  'Zu- oder Absage': 'ab Jänner',
}

/**
 * The admission steps on the Lernpfad, each numbered and dated, with its title as a
 * heading and its text below. The titles are the ones the form and the
 * confirmation page show. From xl the path hangs in the left margin, as it
 * does there.
 */
function AdmissionSteps() {
  return (
    <PathRail dashed hanging>
      {/* Safari drops the list role from a list without bullets. */}
      <ol
        role="list"
        aria-label="Aufnahmeprozess"
        className="flex flex-col gap-12"
      >
        {AUFNAHME_STEPS.map((step, index) => (
          <li
            key={step.title}
            // The title's size sets the line height that centres the node on
            // the title (`lh`).
            className="text-h5 md:text-h4 relative"
          >
            {/* The date takes the first 1.5rem (a 1.25rem line and its
                margin), so the node and the rail's end sit level with the
                title below it. */}
            {index === AUFNAHME_STEPS.length - 1 ? (
              <RailEnd className="top-[calc(1.5rem+0.5lh)]" />
            ) : null}
            <PathMarker className="top-6">
              <PathNode
                state={index === 0 ? 'current' : 'open'}
                number={index + 1}
              />
            </PathMarker>
            <p
              data-step-when
              className="text-primary-700 text-body-xs mb-1 h-5 leading-5 font-bold tracking-widest uppercase"
            >
              {admissionStepWhen[step.title]}
            </p>
            <h2 className="font-condensed font-bold">{step.title}</h2>
            <div className="mt-3 max-w-prose space-y-4 text-base font-normal md:text-xl">
              {admissionStepTexts[step.title]}
            </div>
          </li>
        ))}
      </ol>
    </PathRail>
  )
}

function AdmissionDay() {
  return (
    <Notice icon={Info} className="max-w-lg">
      <div className="text-body-sm/normal space-y-4">
        <p>
          Für einen Aufnahmetermin für den Jahrgang Zeta (9. Schulstufe,
          Schulbeginn September 2027) fülle das Aufnahmeformular aus. Weitere
          Infos folgen per Mail.
        </p>
        <Button asChild>
          <Link
            to="/aufnahme/formular"
            onClick={() =>
              trackEvent('Aufnahme CTA', { position: 'aufnahme-box' })
            }
          >
            Zum Anmeldeformular
          </Link>
        </Button>
      </div>
    </Notice>
  )
}

/**
 * The photo a section opens with. From sm its title sits on the photo's lower
 * left edge in a tab of the page's background; phones set the title under the
 * photo, where a long title cannot cover it.
 */
function ChapterOpener({
  title,
  image,
  alt,
  position,
}: {
  title: string
  image: string
  alt: string
  /** Which part of the photo stays in view when it is cropped. */
  position?: string
}) {
  return (
    <figure className="relative">
      <img
        src={image}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-56 w-full rounded-lg object-cover md:h-[340px]"
        style={{ objectPosition: position }}
      />
      <h1 className="font-condensed text-primary sm:bg-background mt-4 text-4xl font-bold sm:absolute sm:bottom-0 sm:left-0 sm:mt-0 sm:rounded-tr-lg sm:pt-3 sm:pr-5 md:pt-4 md:pr-7">
        {title}
      </h1>
    </figure>
  )
}

type Figure = { figure: string; label: string }

type YearKind = 'entry' | 'side' | 'free' | 'plain'

/**
 * The five Walz years and where one can join: the 9th is the way in, the 10th
 * and 11th take side entrants and have places free this year.
 */
const schoolYears: { grade: string; label?: string; kind: YearKind }[] = [
  { grade: '9.', label: 'Einstieg in die Walz', kind: 'entry' },
  { grade: '10.', label: 'Restplätze Delta 2', kind: 'free' },
  { grade: '11.', label: 'Restplätze Gamma 3', kind: 'free' },
  { grade: '12.', kind: 'plain' },
  { grade: '13.', label: 'Matura', kind: 'plain' },
]

const yearKindStyles: Record<YearKind, string> = {
  // Dark text throughout: white is too faint on the brand orange at the
  // label's size (app.css)
  entry: 'bg-primary border-primary',
  side: 'bg-primary-200 border-primary-200',
  free: 'bg-primary-200 border-primary-200 ring-3 ring-secondary ring-inset',
  plain: 'bg-white border-border',
}

/** The legend's swatches, so the colours never carry the meaning alone. */
const yearLegend: { label: string; swatch: string }[] = [
  { label: 'Einstieg', swatch: 'bg-primary' },
  { label: 'Quereinstieg möglich', swatch: 'bg-primary-200' },
  { label: 'gerade Plätze frei', swatch: 'ring-2 ring-secondary ring-inset' },
]

function SchoolYearGrid() {
  return (
    // The text size makes `max-w-prose` as wide as the key figures and the
    // text column below.
    <div className="max-w-prose space-y-3 md:text-xl">
      <p
        id="walzjahre"
        className="text-muted-foreground text-body-xs font-bold tracking-widest uppercase"
      >
        Fünf Walzjahre · wo du einsteigen kannst
      </p>
      {/* Safari drops the list role from a list without bullets. */}
      <ol
        role="list"
        aria-labelledby="walzjahre"
        // Phones stack the years, each label beside its grade; from sm the
        // five sit side by side.
        className="grid gap-1.5 sm:grid-cols-5"
      >
        {schoolYears.map(({ grade, label, kind }) => (
          <li
            key={grade}
            data-year
            data-year-kind={kind}
            className={cn(
              'flex min-w-0 items-baseline gap-3 rounded-lg border px-3 py-2 sm:min-h-28 sm:flex-col sm:items-start sm:justify-between sm:gap-2 sm:p-3',
              yearKindStyles[kind],
            )}
          >
            <span className="font-condensed w-8 text-2xl/none font-black sm:w-auto sm:text-4xl/none">
              {grade}
            </span>
            {label ? (
              <span
                className={cn(
                  'text-body-xs/tight text-balance',
                  kind === 'plain' && 'text-muted-foreground',
                  kind === 'free' && 'font-semibold',
                )}
              >
                {label}
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <ul
        role="list"
        data-year-legend
        className="text-muted-foreground text-body-xs flex flex-wrap gap-x-5 gap-y-1"
      >
        {yearLegend.map(({ label, swatch }) => (
          <li key={label} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={cn('size-3 rounded-sm', swatch)}
            />
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}

function AdmissionFacts() {
  return (
    <div className="space-y-4">
      <SchoolYearGrid />
      <p className="text-body-sm max-w-prose">
        Weitere Infos & Vorstellungstermin bei Agnes Chorherr:{' '}
        <a
          href="mailto:agnes.chorherr@walz.at"
          className="inline-flex items-center gap-1 underline underline-offset-2"
        >
          agnes.chorherr@walz.at
          <ArrowSquareOut size={16} className="text-primary" />
        </a>
      </p>
    </div>
  )
}

/**
 * The figures the cost text argues with, set large above it: what the Walz
 * carries itself, what the state gives and what a public school costs.
 */
const keyFigures: Figure[] = [
  {
    figure: 'über 90 %',
    label: 'ihrer Kosten trägt die Walz als gemeinnütziger Verein selbst',
  },
  {
    figure: 'ca. € 700',
    label: 'Förderung vom Bildungsministerium pro Jahr und Schüler:in',
  },
  {
    figure: '€ 15.729',
    label:
      'kostete die öffentliche Schule pro Jahr in der Sekundarstufe (OECD, 2019)',
  },
]

/** Three figures set large in a row, each above its label. */
function FigureRow({ figures }: { figures: Figure[] }) {
  return (
    // The text size makes `max-w-prose` as wide as the text column below. The
    // column, not the screen, decides on three in a row.
    <div className="@container max-w-prose text-base md:text-xl">
      <div className="divide-border border-border grid divide-y border-y @xl:grid-cols-3 @xl:divide-x @xl:divide-y-0">
        {figures.map(({ figure, label }) => (
          <p
            key={figure}
            data-figure
            // A narrow column sets the figure beside its label, so the three
            // stay short.
            className="grid grid-cols-[7.5rem_1fr] items-baseline gap-x-4 py-4 @xl:block @xl:px-5 @xl:py-5 @xl:first:pl-0 @xl:last:pr-0"
          >
            <span className="font-condensed text-foreground block text-2xl/none font-bold whitespace-nowrap @xl:text-3xl/none">
              {figure}
            </span>
            <span className="text-muted-foreground text-body-sm block @xl:mt-2">
              {label}
            </span>
          </p>
        ))}
      </div>
    </div>
  )
}

/** A graduate telling what the Walz gave them, with their Jahrgang. */
function TestimonialQuote({
  testimonial,
}: {
  testimonial: NonNullable<AufnahmeQuery['testimonial']>
}) {
  const { name, quote, year } = testimonial
  return (
    <figure className="border-secondary mt-16 max-w-3xl border-l-4 pl-6 md:pl-10">
      <blockquote className="font-condensed text-h5 text-secondary-800 font-medium text-pretty">
        „{quote.trim()}“
      </blockquote>
      <figcaption className="text-body-sm text-muted-foreground mt-4">
        <span className="text-foreground font-bold">{name}</span>
        {year ? (
          <>
            {' '}
            <span className="font-greek text-secondary font-bold">
              {alphabetMap[year.letter]}
            </span>
            {year.graduatedAt ? (
              <>, Maturajahr {year.graduatedAt.getFullYear()}</>
            ) : null}
          </>
        ) : null}
      </figcaption>
    </figure>
  )
}
