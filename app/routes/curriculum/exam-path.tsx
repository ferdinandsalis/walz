import { examProgress, realExams } from './curriculum.ts'

/**
 * The five years as steps to the Matura: each bar shows the exams taken
 * before the year (dotted) and in it (filled), as a share of all of them.
 */
export function ExamPath({
  years,
}: {
  years: { _id: string; title: string; externalExams: string[] | null }[]
}) {
  const counts = years.map(year => realExams(year.externalExams).length)
  const total = counts.reduce((sum, count) => sum + count, 0)
  const progress = examProgress(counts)
  const percent = (share: number) => `${share * 100}%`

  return (
    <section className="space-y-3" aria-labelledby="weg-zur-matura">
      <h2
        id="weg-zur-matura"
        className="text-body-xs font-bold tracking-widest uppercase"
      >
        Der Weg zur Matura · {total} externe Prüfungen
      </h2>
      <ol className="grid gap-1.5 sm:grid-cols-5">
        {years.map((year, i) => (
          <li key={year._id}>
            <a
              href={`#jahr-${i + 1}`}
              className="border-border flex h-full flex-col gap-3 rounded-lg border bg-white p-3 transition hover:-translate-y-0.5"
            >
              <span className="font-condensed text-primary text-5xl/none font-black">
                {i + 1}
              </span>
              <span className="font-condensed text-body-sm/tight font-bold text-balance hyphens-auto">
                {year.title}
              </span>
              <span className="mt-auto space-y-1">
                <span className="bg-secondary-50 flex h-2 overflow-hidden rounded-full">
                  <span
                    className="bg-secondary pattern-dots"
                    style={{ width: percent(progress[i]!.before) }}
                  />
                  <span
                    className="bg-secondary"
                    style={{ width: percent(progress[i]!.current) }}
                  />
                </span>
                <span className="text-body-xs block">
                  {counts[i] === 0
                    ? 'keine Prüfungen'
                    : `+${counts[i]} Prüfungen`}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}
