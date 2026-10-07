import { Check } from '@phosphor-icons/react'
import { type ReactNode } from 'react'
import { cn } from '#app/utils/misc.tsx'

/*
  The Lernpfad: a rail down the left edge of some content, with markers on it.
  The rail's centre sits 16px from the left edge, the centre of a 32px node, so
  every marker lines up on it. Rail and markers are decoration and hidden from
  screen readers; the content beside them carries the meaning.
*/

/** The same states as a form section's `SectionStatus`, so they pass through. */
export type PathNodeState = 'open' | 'done' | 'attention' | 'optional'

export function PathRail({
  children,
  dashed = false,
  className,
}: {
  children: ReactNode
  /** Draws the line dashed, for a stretch that still lies ahead. */
  dashed?: boolean
  className?: string
}) {
  return (
    <div className={cn('pl-path sm:pl-path-wide relative', className)}>
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-y-0 left-[15px]',
          dashed ? 'border-path border-l-2 border-dashed' : 'bg-path w-0.5',
        )}
      />
      {children}
    </div>
  )
}

const nodeStateStyles: Record<PathNodeState, string> = {
  open: 'border-primary bg-(--path-gap) text-primary-800',
  done: 'border-path-done bg-path-done text-white',
  attention: 'border-foreground-danger bg-danger-50 text-foreground-danger',
  optional: 'border-primary bg-(--path-gap) text-primary-800 border-dashed',
}

/**
 * A 32px node on the rail. Its ring takes the colour of the surface behind it
 * (`--path-gap`), so the rail seems to pass behind the node. `done` and
 * `attention` show a glyph, so the state never rests on colour alone.
 */
export function PathNode({
  state,
  number,
  className,
}: {
  state: PathNodeState
  number?: number
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      data-node-state={state}
      className={cn(
        'font-condensed text-body-sm relative grid size-8 shrink-0 place-items-center rounded-full border-2 font-bold ring-4 ring-(color:--path-gap)',
        nodeStateStyles[state],
        className,
      )}
    >
      {state === 'done' ? (
        <Check weight="bold" className="size-4" />
      ) : state === 'attention' ? (
        '!'
      ) : (
        number
      )}
    </span>
  )
}

/**
 * Places a marker on the rail, level with the first line of text of its
 * parent. The parent must be `relative` and start at the rail's content indent.
 */
export function PathMarker({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        '-left-path sm:-left-path-wide absolute top-0 flex h-lh w-8 items-center justify-center',
        className,
      )}
    >
      {children}
    </span>
  )
}

/** A 10px dot on the rail beside a sub-heading, such as "Wohnadresse". */
export function Waypoint({ className }: { className?: string }) {
  return (
    <PathMarker className={className}>
      <span className="bg-path size-2.5 rounded-full ring-4 ring-(color:--path-gap)" />
    </PathMarker>
  )
}
