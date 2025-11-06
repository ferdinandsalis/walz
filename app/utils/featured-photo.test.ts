import { describe, expect, it } from 'vitest'
import { selectFeaturedPhoto } from './featured-photo.ts'
import type { Photo } from '#app/sanity/schema/year.ts'

describe('selectFeaturedPhoto', () => {
  const mockPhotos: Photo[] = [
    {
      takenAt: new Date('2020-09-01'),
      asset: { _ref: 'photo-1', _type: 'reference' },
    },
    {
      takenAt: new Date('2021-09-01'),
      asset: { _ref: 'photo-2', _type: 'reference' },
    },
    {
      takenAt: new Date('2022-09-01'),
      asset: { _ref: 'photo-3', _type: 'reference' },
    },
  ] as Photo[]

  it('returns most recent photo when no featured photo is set', () => {
    const result = selectFeaturedPhoto(mockPhotos)
    expect(result.asset._ref).toBe('photo-3')
  })

  it('returns featured photo when it exists in array', () => {
    const featuredRef = 'photo-1'
    const result = selectFeaturedPhoto(mockPhotos, featuredRef)
    expect(result.asset._ref).toBe('photo-1')
  })

  it('falls back to most recent when featured photo not found', () => {
    const featuredRef = 'photo-999'
    const result = selectFeaturedPhoto(mockPhotos, featuredRef)
    expect(result.asset._ref).toBe('photo-3')
  })

  it('returns first photo when all have same date', () => {
    const sameDate = new Date('2020-09-01')
    const sameDatePhotos = mockPhotos.map(p => ({ ...p, takenAt: sameDate }))
    const result = selectFeaturedPhoto(sameDatePhotos)
    expect(result.asset._ref).toBe('photo-1')
  })

  it('throws error when photos array is empty', () => {
    expect(() => selectFeaturedPhoto([])).toThrow('Cannot select featured photo from empty photos array')
  })
})
