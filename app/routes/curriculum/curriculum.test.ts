import { describe, it } from 'vitest'
import {
  photoRatio,
  photosOf,
  projectsOf,
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
  it('has nothing to show when Sanity has no description', async ({
    expect,
  }) => {
    expect(splitLead(null)).toEqual({ lead: '', rest: '' })
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

describe.concurrent('projects of a year', () => {
  it('has none when Sanity has no list', async ({ expect }) => {
    expect(projectsOf({ projects: null })).toEqual([])
  })
  it('skips references to projects that no longer exist', async ({
    expect,
  }) => {
    expect(
      projectsOf({ projects: [null, { _id: 'a', name: 'Forst' }] }),
    ).toEqual([{ _id: 'a', name: 'Forst' }])
  })
})
