import { useId } from 'react'
import { PathDot, PathMarker, PathNode, PathRail, RailEnd } from './path.tsx'

/**
 * The steps of a process as an ordered list on a dashed rail, labelled by its
 * heading: titles and descriptions, with step 1 done, step 2 next and a solid
 * stretch drawing in between them.
 */
export function StepsPath({
  steps,
  heading,
  headingAs: Heading = 'h2',
  hanging = false,
  className,
}: {
  steps: ReadonlyArray<{ title: string; description: string }>
  heading: string
  headingAs?: 'h2' | 'h3'
  /** From xl, hangs the rail in the left margin, as `PathRail` does. */
  hanging?: boolean
  className?: string
}) {
  const headingId = useId()

  return (
    <div className={className}>
      <Heading id={headingId} className="font-condensed text-h5 font-bold">
        {heading}
      </Heading>
      <PathRail dashed hanging={hanging} className="mt-5">
        {/* Safari drops the list role from a list without bullets. */}
        <ol
          role="list"
          aria-labelledby={headingId}
          className="flex flex-col gap-6"
        >
          {steps.map((step, index) => (
            <li
              key={step.title}
              // The text size sets the line height that centres the marker
              // on the first line (`lh`).
              className="text-body-md relative"
            >
              {index === 0 ? <DoneStretch /> : null}
              {index === steps.length - 1 ? <RailEnd /> : null}
              <PathMarker>
                {index < 2 ? (
                  <PathNode
                    state={index === 0 ? 'done' : 'open'}
                    number={index + 1}
                  />
                ) : (
                  <PathDot />
                )}
              </PathMarker>
              {index === 0 ? <span className="sr-only">Erledigt: </span> : null}
              <span className="font-condensed font-bold">{step.title}</span>
              <span className="text-body-xs/relaxed text-muted-foreground mt-0.5 block">
                {step.description}
              </span>
            </li>
          ))}
        </ol>
      </PathRail>
    </div>
  )
}

/**
 * The solid stretch from step 1's node to step 2's, drawn over the dashed
 * rail. It runs along the rail from the centre of step 1's marker (half a
 * line down) and comes before the marker, so the marker paints over it. It
 * reaches past the item by the list gap (`gap-6`) plus half of step 2's first
 * line, so it tracks the length of step 1's text.
 */
function DoneStretch() {
  return (
    <span
      aria-hidden="true"
      className="bg-path-done -left-path sm:-left-path-wide motion-safe:animate-path-draw absolute top-[0.5lh] -bottom-[calc(1.5rem+0.5lh)] ml-[15px] w-0.5 origin-top"
    />
  )
}
