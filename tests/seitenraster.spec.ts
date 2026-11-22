import { test, expect } from '@playwright/test'

// From lg the page grid gains a right column (table of contents, section
// map, address), from xl the navigation column too. The text column takes
// the room first, so it stays readable just after those breakpoints.
for (const width of [896, 1160]) {
  for (const path of ['/aufnahme', '/ueber-uns', '/kontakt']) {
    test(`gives the text column room beside the right column at ${width}px on ${path}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(path)
      await page.evaluate(() => document.fonts.ready)

      const layout = await page.locator('body header').first().evaluate(
        header => {
          const tracks = getComputedStyle(header.parentElement!)
            .gridTemplateColumns.split(' ')
            .map(parseFloat)
          return {
            // The text column sits before the right column and the margin
            textColumn: tracks[tracks.length - 3]!,
            scrollWidth: document.documentElement.scrollWidth,
          }
        },
      )
      expect(layout.textColumn).toBeGreaterThanOrEqual(540)
      expect(layout.scrollWidth).toBeLessThanOrEqual(width)
    })
  }
}
