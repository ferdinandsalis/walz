import { cn } from '#app/utils/misc.tsx'

export function Divider({ className }: { className?: string }) {
  return (
    <hr className={cn('h-[3px] rounded border-none bg-muted', className)} />
  )
}
