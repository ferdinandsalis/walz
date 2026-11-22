import { type ReactNode } from 'react'
import {
  type Cost,
  SEGMENT_LABEL_MIN_SHARE,
  annualFees,
} from '#app/utils/fees.ts'
import { cn } from '#app/utils/misc.tsx'

const euro = Intl.NumberFormat('de-AT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
  signDisplay: 'never',
})

/** One colour per recurring fee, shared by its bar segment and its row. */
const FEE_COLOURS = [
  'bg-primary',
  'bg-primary-800',
  'bg-secondary',
  'bg-secondary-800',
]

// Phones keep the title and the yearly amount in the row and set the amount
// and how often under the title; from sm every column has its own track.
const rowGrid =
  'grid grid-cols-[1fr_auto_1.25rem] items-baseline gap-x-3 sm:grid-cols-[1fr_5rem_4.5rem_5.5rem_1.25rem] sm:gap-x-4'

/**
 * What a school year of fees comes to: a bar of the recurring fees, each as
 * wide as its share, then a row per fee that opens for its description, the
 * year's sum and the one-off fees.
 */
export function FeeOverview({ list }: { list: Cost[] }) {
  const { recurring, once, total } = annualFees(list)

  return (
    <div className="max-w-prose space-y-4 md:text-xl">
      <p className="text-base md:text-xl">
        Was ein Walzjahr für die Eltern kostet:
      </p>
      {total > 0 ? (
        <div
          data-fee-bar
          aria-hidden="true"
          className="flex h-12 overflow-hidden rounded-lg"
        >
          {recurring.map((fee, index) => (
            <div
              key={fee.title}
              style={{ flexGrow: fee.perYear }}
              className={cn(
                'font-condensed text-body-sm flex min-w-0 basis-0 items-center overflow-hidden px-2 font-bold whitespace-nowrap text-white',
                FEE_COLOURS[index % FEE_COLOURS.length],
              )}
            >
              {fee.share >= SEGMENT_LABEL_MIN_SHARE
                ? euro.format(fee.perYear)
                : null}
            </div>
          ))}
        </div>
      ) : null}

      <div className="text-body-sm">
        <div
          aria-hidden="true"
          className={cn(
            rowGrid,
            'text-muted-foreground text-body-xs hidden pb-2 font-bold tracking-widest uppercase sm:grid',
          )}
        >
          <span>Beitrag</span>
          <span className="text-right">Betrag</span>
          <span className="text-right">wie oft</span>
          <span className="text-right">im Jahr</span>
        </div>
        {recurring.map((fee, index) => (
          <FeeRow
            key={fee.title}
            kind="recurring"
            fee={fee}
            swatch={FEE_COLOURS[index % FEE_COLOURS.length]!}
            often={`${fee.quantity} ×`}
            perYear={euro.format(fee.perYear)}
          />
        ))}
        {total > 0 ? (
          <div
            data-fee-sum
            className={cn(
              rowGrid,
              'border-foreground font-condensed text-body-md border-t-2 py-3 font-bold',
            )}
          >
            <span>Summe im Jahr</span>
            <span className="hidden sm:block" />
            <span className="hidden sm:block" />
            <span data-per-year className="text-primary text-right">
              {euro.format(total)}
            </span>
          </div>
        ) : null}
        {once.map(fee => (
          <FeeRow key={fee.title} kind="once" fee={fee} often="einmalig" />
        ))}
      </div>
    </div>
  )
}

function FeeRow({
  kind,
  fee,
  swatch,
  often,
  perYear,
}: {
  kind: 'recurring' | 'once'
  fee: Cost
  swatch?: string
  often: string
  perYear?: string
}) {
  const once = kind === 'once'
  const data = once ? { 'data-fee-once': true } : { 'data-fee': true }
  const line: ReactNode = (
    <>
      <span className="min-w-0">
        <span className="flex items-baseline gap-2.5">
          <span
            aria-hidden="true"
            className={cn(
              'size-2.5 shrink-0 rounded-xs',
              swatch ?? 'ring-muted-foreground ring-2 ring-inset',
            )}
          />
          <span className="font-condensed text-body-md font-bold">
            {fee.title}
          </span>
        </span>
        {/* Phones only: the amount and how often, under the title */}
        <span className="text-muted-foreground ml-5 block sm:hidden">
          {euro.format(fee.cost)} · {often}
        </span>
      </span>
      <span className="hidden text-right tabular-nums sm:block">
        {euro.format(fee.cost)}
      </span>
      <span className="hidden text-right sm:block">{often}</span>
      <span
        data-per-year={perYear ? true : undefined}
        className="font-condensed text-primary text-body-md text-right font-bold"
      >
        {perYear}
      </span>
    </>
  )
  const rowClassName = cn(
    'border-border border-t',
    once && 'text-muted-foreground',
  )

  if (!fee.description) {
    return (
      <div {...data} className={cn(rowClassName, rowGrid, 'py-3')}>
        {line}
      </div>
    )
  }

  return (
    <details {...data} className={cn(rowClassName, 'group')}>
      <summary
        className={cn(
          rowGrid,
          'focus-visible:ring-ring cursor-pointer list-none py-3 focus-visible:ring-2 focus-visible:outline-hidden [&::-webkit-details-marker]:hidden',
        )}
      >
        {line}
        <span
          aria-hidden="true"
          className="font-condensed text-primary text-right text-xl/none font-bold"
        >
          <span className="group-open:hidden">+</span>
          <span className="hidden group-open:inline">–</span>
        </span>
      </summary>
      <p
        data-fee-description
        className="text-muted-foreground mr-8 mb-3 ml-5 max-w-prose"
      >
        {fee.description}
      </p>
    </details>
  )
}
