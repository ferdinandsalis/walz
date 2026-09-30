import { type Config } from '@react-router/dev/config'

export default {
  ssr: true,
  future: {
    // Crawl every route for client dependencies when the dev server starts.
    // Otherwise Vite discovers them page by page and re-bundles mid-session,
    // breaking any page that is navigating at that moment (two React copies);
    // in e2e runs that shows up as flaky tests.
    unstable_optimizeDeps: true,
  },
} satisfies Config
