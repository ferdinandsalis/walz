import { expect, type Locator, type Page } from '@playwright/test'

// Fills section 1, "Ihre Angaben"; the country is already set.
export async function fillParent1(page: Page) {
  await page.locator('#parent1Name').fill('Anna Testfrau')
  await page.locator('#parent1Email').fill('delivered+anna@resend.dev')
  await page.locator('#parent1Phone').fill('+43 660 1234567')
  await page.locator('#parent1Street').fill('Teststraße 1/2/3')
  await page.locator('#parent1PostalCode').fill('1010')
  await page.locator('#parent1City').fill('Wien')
}

// The client-side checks and the submit guard need React on the page. React
// Router sets this global in createHydratedRouter (react-router/dom, verified
// against 7.18.4), so it marks that hydration has started, not that every
// event handler is committed yet.
export async function gotoHydratedForm(page: Page) {
  await page.goto('/aufnahme/formular')
  await page.waitForFunction(() => '__reactRouterDataRouter' in window)
}

// The left edge of an element's first visible text, not of its box: the box
// may start under a path marker. Hidden markers and screen-reader-only text
// are skipped.
export function textLeft(locator: Locator) {
  return locator.evaluate(element => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
    while (walker.nextNode()) {
      const text = walker.currentNode
      if (!text.textContent?.trim()) continue
      if (text.parentElement?.closest('[aria-hidden="true"], .sr-only'))
        continue
      const range = document.createRange()
      range.selectNodeContents(text)
      return range.getBoundingClientRect().left
    }
    throw new Error('expected visible text')
  })
}

// The colour a token resolves to, as the browser reports computed colours.
export function resolvedColor(page: Page, token: string) {
  return page.evaluate(token => {
    const probe = document.createElement('div')
    probe.style.backgroundColor = `var(${token})`
    document.body.append(probe)
    const color = getComputedStyle(probe).backgroundColor
    probe.remove()
    return color
  }, token)
}

// The one focus look of the Aufnahme pages, the fields' own: a solid 2px
// primary-700 outline at 2px offset, clear on the page and on the orange.
export async function expectFocusOutline(locator: Locator) {
  await expect(locator).toBeFocused()
  const primary700 = await resolvedColor(locator.page(), '--color-primary-700')
  // Polled, as a control may fade its outline colour in
  await expect
    .poll(() =>
      locator.evaluate(element => {
        const style = getComputedStyle(element)
        return {
          style: style.outlineStyle,
          width: style.outlineWidth,
          offset: style.outlineOffset,
          color: style.outlineColor,
        }
      }),
    )
    .toEqual({
      style: 'solid',
      width: '2px',
      offset: '2px',
      color: primary700,
    })
}
