import { visibleFocusOutline } from '#app/components/visible-focus.ts'
import { cn } from '#app/utils/misc.tsx'

// An address a parent on a phone can tap to write to it.
export function MailLink({ address }: { address: string }) {
  return (
    <a
      href={`mailto:${address}`}
      className={cn('underline underline-offset-2', visibleFocusOutline)}
    >
      {address}
    </a>
  )
}
