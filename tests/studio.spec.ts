import { test, expect } from '@playwright/test'

// The Studio chunk (@sanity/ui and friends) once crashed the whole server
// process on import in production (missing react-is, PR #122). This smoke
// test catches studio-route breakage early: a failed SSR import, a broken
// sanity config, or a schema error all surface here. Note: CI runs e2e
// against the dev server, so prune-dependent failures (devDependency
// masking a missing prod dep) still need the production image to reproduce.
test.describe('Sanity Studio', () => {
  test('studio route serves and the server survives it', async ({ page }) => {
    // the studio bundle is huge; first compile in dev can exceed the
    // default 15s test timeout
    test.slow()

    const studio = await page.goto('/studio')
    expect(studio?.status()).toBe(200)

    // the historical failure killed the server process itself — verify the
    // app still answers after the studio chunk has been loaded
    const followUp = await page.goto('/')
    expect(followUp?.status()).toBe(200)
  })
})
