import { useId } from 'react'
import { cn } from '#app/utils/misc.tsx'
import { PathMarker, PathNode, PathRail } from './path.tsx'

/**
 * The steps of a process as an ordered list on a dashed rail, labelled by its
 * heading. `compact` shows the titles beside small dots: everything lies
 * ahead. `full` shows titles and descriptions, with step 1 done, step 2 next
 * and a solid stretch drawing in between them.
 */
export function StepsPath({
  steps,
  variant,
  heading,
  headingAs: Heading = 'h2',
  className,
}: {
  steps: ReadonlyArray<{ title: string; description: string }>
  variant: 'compact' | 'full'
  heading: string
  headingAs?: 'h2' | 'h3'
  className?: string
}) {
  const headingId = useId()
  const full = variant === 'full'

  return (
    <div className={className}>
      <Heading
        id={headingId}
        className={cn(
          'font-condensed font-bold',
          full ? 'text-h5' : 'text-body-sm',
        )}
      >
        {heading}
      </Heading>
      <PathRail dashed className={full ? 'mt-5' : 'mt-3'}>
        <ol
          aria-labelledby={headingId}
          className={cn('flex flex-col', full ? 'gap-6' : 'gap-3')}
        >
          {steps.map((step, index) => (
            <li
              key={step.title}
              // The text size sets the line height that centres the marker
              // on the first line (`lh`).
              className={cn(
                'relative',
                full ? 'text-body-md pl-2 sm:pl-0' : 'text-body-xs',
              )}
            >
              {full && index === 0 ? <DoneStretch /> : null}
              {index === steps.length - 1 ? <RailEnd /> : null}
              <PathMarker>
                {full && index < 2 ? (
                  <PathNode
                    state={index === 0 ? 'done' : 'open'}
                    number={index + 1}
                  />
                ) : (
                  <span className="bg-path size-3 rounded-full ring-4 ring-(color:--path-gap)" />
                )}
              </PathMarker>
              {full ? (
                <>
                  {index === 0 ? (
                    <span className="sr-only">Erledigt: </span>
                  ) : null}
                  <span className="font-condensed font-bold">{step.title}</span>
                  <span className="text-body-xs/relaxed text-muted-foreground mt-0.5 block">
                    {step.description}
                  </span>
                </>
              ) : (
                step.title
              )}
            </li>
          ))}
        </ol>
      </PathRail>
    </div>
  )
}

/*
  Both stretches below run along the rail from the centre of their item's
  marker (half a line down). They come before the marker, so it paints over
  them.
*/

/**
 * The solid stretch from step 1's node to step 2's, drawn over the dashed
 * rail. It reaches past the item by the list gap (`gap-6`) plus half of step
 * 2's first line, so it tracks the length of step 1's text.
 */
function DoneStretch() {
  return (
    <span
      aria-hidden="true"
      className="bg-path-done -left-path sm:-left-path-wide motion-safe:animate-path-draw absolute top-[0.5lh] -bottom-[calc(1.5rem+0.5lh)] ml-[15px] w-0.5 origin-top"
    />
  )
}

/** Covers the rail below the last marker, so the path ends at it. */
function RailEnd() {
  return (
    <span
      aria-hidden="true"
      className="-left-path sm:-left-path-wide absolute top-[0.5lh] bottom-0 ml-[15px] w-0.5 bg-(--path-gap)"
    />
  )
}
