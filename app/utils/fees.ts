/** A fee as the school year lists it in Sanity. */
export type Cost = {
  title: string
  quantity: number
  cost: number
  interval: string
  description?: string
}

/** A fee charged again and again, with what it comes to over a year. */
export type RecurringFee = Cost & {
  /** The amount times how often it is charged in a year */
  perYear: number
  /** Its part of the year's total, from 0 to 1 */
  share: number
}

/** A bar segment carries its amount only from this share of the total up. */
export const SEGMENT_LABEL_MIN_SHARE = 0.15

/**
 * What a year of fees comes to. One-off fees stay apart, since they are paid
 * once and not every year. The order stays the one set in the Studio.
 */
export function annualFees(list: Cost[]) {
  const once = list.filter(fee => fee.interval === 'ONCE')
  const withYear = list
    .filter(fee => fee.interval !== 'ONCE')
    .map(fee => ({ ...fee, perYear: fee.cost * fee.quantity }))
  const total = withYear.reduce((sum, fee) => sum + fee.perYear, 0)
  const recurring: RecurringFee[] = withYear.map(fee => ({
    ...fee,
    share: total > 0 ? fee.perYear / total : 0,
  }))
  return { recurring, once, total }
}
