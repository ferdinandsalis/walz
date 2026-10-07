import { describe, expect, it } from 'vitest'
import { cn } from './misc.tsx'

describe('cn', () => {
  it('keeps the inset field shadow next to a box shadow', () => {
    expect(cn('inset-shadow-field', 'shadow-md')).toBe(
      'inset-shadow-field shadow-md',
    )
  })

  it('lets a built-in radius replace the choice radius', () => {
    expect(cn('rounded-choice', 'rounded-lg')).toBe('rounded-lg')
  })

  it('lets a built-in padding replace the path indent', () => {
    expect(cn('pl-path', 'pl-4')).toBe('pl-4')
  })

  it('lets a later path indent replace an earlier one', () => {
    expect(cn('pl-path', 'sm:pl-path-wide')).toBe('pl-path sm:pl-path-wide')
    expect(cn('sm:pl-4', 'sm:pl-path-wide')).toBe('sm:pl-path-wide')
  })

  it('keeps a brand shade colour next to a font size', () => {
    expect(cn('text-primary-700', 'text-sm')).toBe('text-primary-700 text-sm')
  })

  it('lets a later text colour replace a brand shade', () => {
    expect(cn('text-primary-700', 'text-secondary-800')).toBe(
      'text-secondary-800',
    )
  })

  it('lets a later background replace the path colours', () => {
    expect(cn('bg-path', 'bg-path-done')).toBe('bg-path-done')
    expect(cn('bg-danger-50', 'bg-primary-50')).toBe('bg-primary-50')
  })

  it('lets a later animation replace the path draw animation', () => {
    expect(cn('animate-path-draw', 'animate-spin')).toBe('animate-spin')
  })
})
