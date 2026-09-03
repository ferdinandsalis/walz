declare global {
  interface Window {
    /**
     * Plausible's tracking function. Optional because the script is loaded
     * with `defer` — until it executes, the queue stub in root.tsx stands in
     * for it, and if the script is blocked there is no function at all.
     */
    plausible?: {
      (
        event: string,
        options?: {
          props?: Record<string, string | number | boolean>
          callback?: () => void
        },
      ): void
      q?: IArguments[]
    }
  }
}

export {}
