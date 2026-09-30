import { describe, expect, it } from 'vitest'
import { tType } from './event.ts'

describe('tType', () => {
  it.each([
    { type: 'general', label: 'Allgemein' },
    { type: 'talk', label: 'Präsentation' },
    { type: 'holiday', label: 'Ferien' },
    { type: 'theater', label: 'Theater' },
    { type: 'exam', label: 'Prüfung' },
    { type: 'project', label: 'Projekt' },
    { type: 'orientation', label: 'Kennenlernen' },
  ] as const)('labels $type as $label', ({ type, label }) => {
    expect(tType(type)).toBe(label)
  })

  it('passes null through', () => {
    expect(tType(null)).toBeNull()
  })

  it('passes a string that is not an event type through', () => {
    // @ts-expect-error only event types from EventSchema are accepted
    expect(tType('lecture')).toBe('lecture')
  })
})
