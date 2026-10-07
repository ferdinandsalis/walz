import { WarningCircle } from '@phosphor-icons/react'
import { type ReactNode } from 'react'
import { Label } from '#app/components/ui/label.tsx'
import { cn } from '#app/utils/misc.tsx'

export function fieldIds(name: string) {
  return { hintId: `${name}-hint`, errorId: `${name}-error` }
}

export type ControlProps = {
  id: string
  name: string
  'aria-describedby'?: string
  'aria-invalid'?: true
}

export function describedByIds(name: string, hint: ReactNode, error?: string) {
  const { hintId, errorId } = fieldIds(name)
  const ids = [hint ? hintId : null, error ? errorId : null].filter(Boolean)
  return ids.length > 0 ? ids.join(' ') : undefined
}

function FieldHint({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="text-body-xs text-muted-foreground">
      {children}
    </p>
  )
}

export function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p
      id={id}
      className="text-body-sm text-foreground-danger flex items-start gap-1.5 font-medium"
    >
      <WarningCircle
        aria-hidden
        weight="fill"
        className="mt-0.5 size-4 shrink-0"
      />
      {children}
    </p>
  )
}

export function Field({
  name,
  label,
  hint,
  error,
  className,
  children,
}: {
  name: string
  label: ReactNode
  hint?: ReactNode
  error?: string
  className?: string
  children: (control: ControlProps) => ReactNode
}) {
  const { hintId, errorId } = fieldIds(name)

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label
        htmlFor={name}
        className="text-body-sm text-foreground scroll-mt-4 leading-normal font-medium"
      >
        {label}
      </Label>
      {hint ? <FieldHint id={hintId}>{hint}</FieldHint> : null}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
      {children({
        id: name,
        name,
        'aria-describedby': describedByIds(name, hint, error),
        'aria-invalid': error ? true : undefined,
      })}
    </div>
  )
}

export function FieldGroup({
  name,
  legend,
  hint,
  error,
  className,
  descriptionOnInputs = false,
  children,
}: {
  name: string
  legend: ReactNode
  hint?: ReactNode
  error?: string
  className?: string
  /**
   * Set when every input in the group references the hint and error itself
   * (see `describedByIds`), so a screen reader does not read them twice.
   */
  descriptionOnInputs?: boolean
  children: ReactNode
}) {
  const { hintId, errorId } = fieldIds(name)

  return (
    <fieldset
      aria-describedby={
        descriptionOnInputs ? undefined : describedByIds(name, hint, error)
      }
      className={cn('flex flex-col gap-1.5', className)}
    >
      <legend className="text-body-sm text-foreground mb-1.5 scroll-mt-4 font-medium">
        {legend}
      </legend>
      {hint ? <FieldHint id={hintId}>{hint}</FieldHint> : null}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
      {children}
    </fieldset>
  )
}
