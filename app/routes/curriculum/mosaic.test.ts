import { describe, it } from 'vitest'
import { type GridArea, gridArea, mosaicLayout } from './mosaic.ts'

// The first photo's width over height of each project with photos, per year,
// as they were in Sanity on 2026-11-24.
const years: Record<number, number[]> = {
  1: [1.5, 1.33, 1.52, 1.5, 0.75, 1.33, 0.67],
  2: [1.5, 1.33, 0.75, 1.78, 1.33, 1.33, 0.75],
  3: [1.33, 1.5, 0.75],
  4: [0.75, 2.12, 1.33, 0.67, 0.75],
  5: [1.33],
}

function cellsOf(area: GridArea) {
  const cells: string[] = []
  for (let r = area.row; r < area.row + area.rowSpan; r++) {
    for (let c = area.col; c < area.col + area.colSpan; c++) {
      cells.push(`${r}/${c}`)
    }
  }
  return cells
}

/** Empty cells in any row above the last one that holds something. */
function holes(
  layout: { corner: GridArea; tiles: GridArea[] },
  columns: number,
) {
  const taken = new Set(
    [layout.corner, ...layout.tiles].flatMap(area => cellsOf(area)),
  )
  const lastRow = Math.max(
    ...[layout.corner, ...layout.tiles].map(a => a.row + a.rowSpan - 1),
  )
  const empty: string[] = []
  for (let r = 1; r < lastRow; r++) {
    for (let c = 1; c <= columns; c++) {
      if (!taken.has(`${r}/${c}`)) empty.push(`${r}/${c}`)
    }
  }
  return empty
}

/** Cells claimed twice, and areas that run past the last column. */
function clashes(
  layout: { corner: GridArea; tiles: GridArea[] },
  columns: number,
) {
  const areas = [layout.corner, ...layout.tiles]
  const cells = areas.flatMap(area => cellsOf(area))
  const twice = cells.filter((cell, i) => cells.indexOf(cell) !== i)
  const outside = areas.filter(a => a.col + a.colSpan - 1 > columns)
  return [...twice, ...outside.map(a => `outside ${gridArea(a)}`)]
}

describe.concurrent('mosaic of a year', () => {
  for (const [year, ratios] of Object.entries(years)) {
    const n = Number(year)
    for (const columns of [4, 2] as const) {
      it(`leaves no holes in year ${n} with ${columns} columns`, async ({
        expect,
      }) => {
        const layout = mosaicLayout(ratios, {
          columns,
          corner: n % 2 ? 'left' : 'right',
        })
        expect(layout.tiles).toHaveLength(ratios.length)
        expect(holes(layout, columns)).toEqual([])
        expect(clashes(layout, columns)).toEqual([])
      })
    }
  }

  it('puts the opening on the right in even years and lets the last portrait stick out', async ({
    expect,
  }) => {
    const layout = mosaicLayout(years[2]!, { columns: 4, corner: 'right' })
    expect(layout.corner).toEqual({ row: 1, col: 3, rowSpan: 2, colSpan: 2 })
    expect(layout.tiles[0]).toEqual({ row: 1, col: 1, rowSpan: 2, colSpan: 2 })
    expect(layout.tiles[6]).toEqual({ row: 4, col: 4, rowSpan: 2, colSpan: 1 })
  })

  it('gives up a portrait only where it would leave a hole', async ({
    expect,
  }) => {
    const layout = mosaicLayout(years[1]!, { columns: 4, corner: 'left' })
    expect(layout.corner.col).toBe(1)
    expect(layout.tiles[4]).toEqual({ row: 3, col: 4, rowSpan: 2, colSpan: 1 })
    expect(layout.tiles[6]).toMatchObject({ rowSpan: 1, colSpan: 1 })
  })

  it('lets a single photo fill the half beside the opening', async ({
    expect,
  }) => {
    const layout = mosaicLayout(years[5]!, { columns: 4, corner: 'right' })
    expect(layout.tiles[0]).toEqual({ row: 1, col: 1, rowSpan: 2, colSpan: 2 })
  })

  it('sets the opening above the photos on a phone', async ({ expect }) => {
    for (const corner of ['left', 'right'] as const) {
      const layout = mosaicLayout(years[2]!, { columns: 2, corner })
      expect(layout.corner).toEqual({ row: 1, col: 1, rowSpan: 2, colSpan: 2 })
      expect(layout.tiles[0]!.row).toBe(3)
    }
  })

  it('shows only the opening when a year has no photos', async ({ expect }) => {
    expect(mosaicLayout([], { columns: 4, corner: 'left' }).tiles).toEqual([])
  })
})

describe.concurrent('grid area', () => {
  it('writes the area as CSS grid-area', async ({ expect }) => {
    expect(gridArea({ row: 3, col: 2, rowSpan: 2, colSpan: 1 })).toBe(
      '3 / 2 / span 2 / span 1',
    )
  })
})
