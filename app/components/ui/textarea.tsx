import * as React from 'react'
import { cn } from '#app/utils/misc.tsx'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'border-input bg-card placeholder:text-muted-foreground aria-invalid:bg-danger-50 aria-invalid:border-input-invalid inset-shadow-field focus-visible:outline-primary-700 flex min-h-[80px] w-full rounded-md border px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-2',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
