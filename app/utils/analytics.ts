/**
 * Thin wrapper around the Plausible tracker.
 *
 * The tracking script is loaded with `defer`, so `window.plausible` does not
 * exist yet while the page hydrates. `root.tsx` installs Plausible's queue stub
 * ahead of the script tag, which buffers events fired before the script has
 * loaded and replays them once it is ready.
 *
 * Goal names must match the goals configured in the Plausible dashboard
 * character for character — see docs/analytics-messplan.md.
 */

type PlausibleProps = Record<string, string | number | boolean>

declare global {
  interface Window {
    plausible?: (
      goal: string,
      options?: { props?: PlausibleProps; callback?: () => void },
    ) => void
  }
}

export const goals = {
  /** Click on a call to action leading into the admissions form. */
  aufnahmeCta: 'Aufnahme: CTA geklickt',
  /** First actual input in the admissions form, once per page view. */
  aufnahmeFormStarted: 'Aufnahme: Formular gestartet',
  /** The admissions form came back with an error instead of a confirmation. */
  aufnahmeFormError: 'Aufnahme: Formular Fehler',
} as const

export function trackEvent(goal: string, props?: PlausibleProps) {
  if (typeof window === 'undefined') return
  window.plausible?.(goal, props ? { props } : undefined)
}
