import { describe, it } from 'vitest'
import {
  examProgress,
  photoRatio,
  photosOf,
  realExams,
  splitLead,
} from './curriculum.ts'

describe.concurrent('external exams', () => {
  it('counts none when Sanity has no list', async ({ expect }) => {
    expect(realExams(null)).toEqual([])
  })
  it('does not count "keine" as an exam', async ({ expect }) => {
    expect(realExams(['keine'])).toEqual([])
  })
  it('drops empty entries and "keine" in any spelling', async ({ expect }) => {
    expect(realExams(['Englisch', '', ' Keine ', 'Matura'])).toEqual([
      'Englisch',
      'Matura',
    ])
  })
})

describe.concurrent('progress towards the Matura', () => {
  it('gives each year its share and the share of the years before', async ({
    expect,
  }) => {
    const progress = examProgress([0, 5, 4, 5, 3])
    expect(progress[1]).toEqual({ before: 0, current: 5 / 17 })
    expect(progress[4]).toEqual({ before: 14 / 17, current: 3 / 17 })
  })
  it('stays empty when there are no exams at all', async ({ expect }) => {
    expect(examProgress([0, 0])).toEqual([
      { before: 0, current: 0 },
      { before: 0, current: 0 },
    ])
  })
})

describe.concurrent('lead sentence', () => {
  it('splits off the first sentence', async ({ expect }) => {
    expect(splitLead('Gute Nachrichten für alle! Die Walz beginnt.')).toEqual({
      lead: 'Gute Nachrichten für alle!',
      rest: 'Die Walz beginnt.',
    })
  })
  it('takes the whole text when it has no sentence end', async ({ expect }) => {
    expect(splitLead('Ohne Punkt')).toEqual({ lead: 'Ohne Punkt', rest: '' })
  })
  it('leaves no rest after a single sentence', async ({ expect }) => {
    expect(splitLead('Ein Satz.')).toEqual({ lead: 'Ein Satz.', rest: '' })
  })
})

describe.concurrent('photos', () => {
  it('reads the shape from the asset name', async ({ expect }) => {
    expect(photoRatio({ asset: { _ref: 'image-abc-1200x900-jpg' } })).toBe(
      1200 / 900,
    )
  })
  it('treats a photo of unknown shape as square', async ({ expect }) => {
    expect(photoRatio(null)).toBe(1)
  })
  it('keeps only photos that have an image', async ({ expect }) => {
    expect(
      photosOf({
        photos: [{ asset: { _ref: 'image-a-10x10-jpg' } }, {}, null],
      }),
    ).toHaveLength(1)
  })
  it('has no photos when Sanity has no list', async ({ expect }) => {
    expect(photosOf({ photos: null })).toEqual([])
  })
})
