/**
 * Sends a custom event to Plausible. Safe to call during server rendering and
 * before the deferred Plausible script has loaded — see the queue stub in
 * `app/root.tsx`.
 *
 * Event names are typed into the Plausible dashboard by hand when setting up a
 * goal, so keep them short and ASCII.
 */
export function trackEvent(
  name: string,
  props?: Record<string, string | number | boolean>,
) {
  if (typeof window === 'undefined') return

  window.plausible?.(name, props ? { props } : undefined)
}
