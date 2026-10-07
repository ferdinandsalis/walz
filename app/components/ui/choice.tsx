import { type ReactNode } from 'react'
import { fieldIds } from '#app/components/form-field.tsx'
import { cn } from '#app/utils/misc.tsx'

/*
  Choices keep their native controls (no `appearance: none`), so the browser
  draws and announces them as usual. Each label fills a row of 48px or more,
  which makes the whole row the hit target. The tints come from `:has()`, so
  they follow the control without JavaScript.
*/

const control = 'accent-primary size-5 shrink-0'

/**
 * One checkbox as a card. The hint sits outside the label and is linked by
 * `aria-describedby`, so a screen reader does not read it twice.
 */
export function ChoiceCard({
  name,
  label,
  hint,
  defaultChecked,
  className,
}: {
  name: string
  label: ReactNode
  hint?: ReactNode
  defaultChecked?: boolean
  className?: string
}) {
  const { hintId } = fieldIds(name)

  return (
    <div
      className={cn(
        'border-border bg-card rounded-choice has-[:checked]:border-primary has-[:checked]:bg-primary-50 has-[:focus-visible]:outline-primary-700 border transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2',
        className,
      )}
    >
      <label className="text-body-sm flex min-h-12 cursor-pointer items-center gap-3 px-3.5 py-2 font-medium">
        <input
          type="checkbox"
          id={name}
          name={name}
          defaultChecked={defaultChecked}
          aria-describedby={hint ? hintId : undefined}
          // The card draws the focus outline instead.
          className={cn(control, 'focus-visible:outline-hidden')}
        />
        {label}
      </label>
      {hint ? (
        // Indented past the checkbox and its gap, under the label text. It
        // starts below the label, so the label's full height takes a tap.
        <p
          id={hintId}
          className="text-body-xs text-muted-foreground pr-3.5 pb-3 pl-[2.875rem]"
        >
          {hint}
        </p>
      ) : null}
    </div>
  )
}

/**
 * A group of radio rows with dividers. An option's `after` content renders
 * directly under its row, inside the same divided item: content that CSS
 * hides leaves no stray divider, and the checked tint covers both. The item of
 * the radio with keyboard focus gets the card's outline; the list does not
 * clip, so the outline shows whole, and the end items round their own corners
 * instead.
 */
export function ChoiceList({
  name,
  options,
  defaultValue,
  className,
}: {
  name: string
  options: ReadonlyArray<{
    value: string
    label: ReactNode
    after?: ReactNode
  }>
  defaultValue?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'border-border bg-card rounded-choice divide-border divide-y border',
        className,
      )}
    >
      {options.map(option => (
        <div
          key={option.value}
          className="has-[:checked]:bg-primary-50 has-[[type=radio]:focus-visible]:outline-primary-700 transition-colors first:rounded-t-[calc(var(--radius-choice)-1px)] last:rounded-b-[calc(var(--radius-choice)-1px)] has-[[type=radio]:focus-visible]:outline-2 has-[[type=radio]:focus-visible]:outline-offset-2"
        >
          <label className="text-body-sm flex min-h-12 cursor-pointer items-center gap-3 px-3.5 py-2">
            <input
              type="radio"
              name={name}
              value={option.value}
              defaultChecked={option.value === defaultValue}
              // The item draws the focus outline instead.
              className={cn(control, 'focus-visible:outline-hidden')}
            />
            {option.label}
          </label>
          {option.after}
        </div>
      ))}
    </div>
  )
}
