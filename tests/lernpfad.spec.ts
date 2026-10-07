import { test, expect } from '@playwright/test'

test('the newsletter field keeps 16px and shows a visible focus outline', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  const field = page.locator('input[name="email"]')
  await field.scrollIntoViewIfNeeded()

  await expect(field).toHaveCSS('font-size', '16px')
  const before = await field.boundingBox()

  // Reach the field by keyboard so :focus-visible applies.
  const isFocused = () =>
    field.evaluate(element => element === document.activeElement)
  for (let presses = 0; presses < 100 && !(await isFocused()); presses++) {
    await page.keyboard.press('Tab')
  }

  await expect(field).toBeFocused()
  await expect(field).toHaveCSS('outline-style', 'solid')
  await expect(field).toHaveCSS('outline-width', '2px')
  const after = await field.boundingBox()
  expect(after?.height).toBe(before?.height)
})
