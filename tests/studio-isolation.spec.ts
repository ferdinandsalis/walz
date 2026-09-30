import { test, expect, type Page } from '@playwright/test'

// Public pages parse Sanity query results with zod read-models. When those
// read-models lived next to Studio schema code, every visitor downloaded the
// whole `sanity` package (4.5 MB), and on sanity 6 its global CSS reset in
// `@layer sui.global` too, which outranks Tailwind's utilities layer.
const publicPaths = [
  '/',
  '/aktuelles',
  '/aktuelles/beitraege',
  '/jahrgaenge',
  '/alumni',
  '/ueber-uns',
  '/ueber-uns/philosophie/bildung',
]

// the pre-bundled `sanity` dependency in dev, or its sources; deliberately not
// `@sanity/client` or `@sanity/image-url`, which public pages do use
const sanityPackageRequest =
  /\/node_modules\/(\.vite\/deps\/sanity(_[^/?]*)?\.js|sanity\/)/

async function sanityCascadeLayers(page: Page) {
  return page.evaluate(() => {
    const names: string[] = []
    const collect = (rules: CSSRuleList) => {
      for (const rule of Array.from(rules)) {
        if (rule instanceof CSSLayerStatementRule) names.push(...rule.nameList)
        if (rule instanceof CSSLayerBlockRule) names.push(rule.name)
        if (rule instanceof CSSGroupingRule) collect(rule.cssRules)
      }
    }
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        collect(sheet.cssRules)
      } catch {
        // cross-origin stylesheets are unreadable, and never Sanity's
      }
    }
    return names.filter(name => name === 'sui' || name.startsWith('sui.'))
  })
}

for (const path of publicPaths) {
  test(`${path} loads neither Sanity Studio code nor styles`, async ({
    page,
  }) => {
    const sanityRequests: string[] = []
    page.on('request', request => {
      if (sanityPackageRequest.test(request.url())) {
        sanityRequests.push(request.url())
      }
    })

    await page.goto(path)
    await page.waitForLoadState('networkidle')
    // on a cold dev server (always in CI) Vite discovers and pre-bundles
    // dependencies during the first visit, so that visit can finish before
    // the page ever requests them; the second load sees the real module graph
    await page.reload()
    await page.waitForLoadState('networkidle')

    expect(sanityRequests).toEqual([])
    expect(await sanityCascadeLayers(page)).toEqual([])
  })
}
