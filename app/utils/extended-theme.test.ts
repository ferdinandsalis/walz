import { describe, expect, it } from 'vitest'
import { extendedTheme } from './extended-theme.ts'

describe('extendedTheme', () => {
  // tailwind-merge reads only the keys; the values live once, in app.css.
  it('points the Lernpfad tokens at their CSS variables', () => {
    expect(extendedTheme.borderRadius.choice).toBe('var(--radius-choice)')
    expect(extendedTheme.spacing).toEqual({
      path: 'var(--spacing-path)',
      'path-wide': 'var(--spacing-path-wide)',
    })
    expect(extendedTheme.insetShadow).toEqual({
      field: 'var(--inset-shadow-field)',
    })
    expect(extendedTheme.colors.primary).toMatchObject({
      50: 'var(--color-primary-50)',
      100: 'var(--color-primary-100)',
      200: 'var(--color-primary-200)',
      700: 'var(--color-primary-700)',
      800: 'var(--color-primary-800)',
    })
    expect(extendedTheme.colors.secondary).toMatchObject({
      50: 'var(--color-secondary-50)',
      200: 'var(--color-secondary-200)',
      700: 'var(--color-secondary-700)',
      800: 'var(--color-secondary-800)',
    })
    expect(extendedTheme.colors.danger).toEqual({
      50: 'var(--color-danger-50)',
    })
    expect(extendedTheme.colors.path).toBe('var(--color-path)')
    expect(extendedTheme.colors['path-done']).toBe('var(--color-path-done)')
    expect(extendedTheme.animation['path-draw']).toBe(
      'var(--animate-path-draw)',
    )
  })
})
