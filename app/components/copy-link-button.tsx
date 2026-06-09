import { LinkSimple } from '@phosphor-icons/react'
import { useState } from 'react'
import { cn } from '#app/utils/misc.tsx'

/**
 * Copies an absolute URL (origin + path) to the clipboard, with brief
 * "Kopiert!" feedback. Resolves the origin on click, so it works without
 * the server knowing the public host.
 */
export function CopyLinkButton({
  path,
  label = 'Link kopieren',
  className,
}: {
  path: string
  label?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.origin + path)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch {
          /* clipboard unavailable (e.g. insecure context) — ignore */
        }
      }}
      className={cn(
        'inline-flex items-center gap-1 text-body-xs text-muted-foreground underline-offset-2 hover:text-primary hover:underline',
        className,
      )}
    >
      <LinkSimple size={16} className="text-primary" />
      <span>{copied ? 'Kopiert!' : label}</span>
    </button>
  )
}
