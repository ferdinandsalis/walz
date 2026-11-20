import { type RefObject, useEffect } from 'react'

/**
 * While `open`, closes a popup on a tap outside `container` and on Escape;
 * Escape also gives focus back to `button`, the control that opened it.
 */
export function useDismiss({
  open,
  close,
  container,
  button,
}: {
  open: boolean
  close: () => void
  container: RefObject<HTMLElement | null>
  button: RefObject<HTMLElement | null>
}) {
  useEffect(() => {
    if (!open) return

    // pointerdown, because iOS sends no click to the document for taps on
    // plain content
    function closeOnOutsideTap(event: PointerEvent) {
      if (!container.current?.contains(event.target as Node)) close()
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      close()
      button.current?.focus()
    }

    document.addEventListener('pointerdown', closeOnOutsideTap)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideTap)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open, close, container, button])
}
