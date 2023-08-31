import { cn } from '#app/utils/misc.tsx'

export function Divider({ className }: { className?: string }) {
  return (
    <hr
      className={cn('h-[4px] rounded border-none bg-stone-200/70', className)}
    />
  )
}
