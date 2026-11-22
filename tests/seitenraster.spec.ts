import { test, expect } from '@playwright/test'

// From lg the page grid gains a right column (table of contents, section
// map, address), from xl the navigation column too. The text column takes
// the room first, so it stays readable just after those breakpoints.
for (const width of [896, 1160]) {
  for (const path of ['/aufnahme', '/ueber-uns']) {
    test(`gives the text column room beside the right column at ${width}px on ${path}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(path)
      await page.evaluate(() => document.fonts.ready)

      const layout = await page
        .locator('body header')
        .first()
        .evaluate(header => {
          const tracks = getComputedStyle(header.parentElement!)
            .gridTemplateColumns.split(' ')
            .map(parseFloat)
          return {
            // The text column sits before the right column and the margin
            textColumn: tracks[tracks.length - 3]!,
            scrollWidth: document.documentElement.scrollWidth,
          }
        })
      expect(layout.textColumn).toBeGreaterThanOrEqual(540)
      expect(layout.scrollWidth).toBeLessThanOrEqual(width)
    })
  }

  // The map takes the left column of /kontakt; the right column grows to the
  // address, which keeps its lines whole
  test(`keeps every address line whole at ${width}px on /kontakt`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/kontakt')
    await page.evaluate(() => document.fonts.ready)

    const lines = page
      .getByRole('heading', { name: 'Kontakt', level: 2 })
      .locator('xpath=following-sibling::div[1]/p')
    await expect(lines).toHaveCount(6)
    for (const line of await lines.all()) {
      const lineCount = await line.evaluate(element => {
        const range = document.createRange()
        range.selectNodeContents(element)
        return new Set(
          Array.from(range.getClientRects()).map(rect => Math.round(rect.top)),
        ).size
      })
      expect(lineCount, await line.textContent()).toBe(1)
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width)
  })
}
