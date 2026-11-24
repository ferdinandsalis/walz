/** A place in the grid, with 1-based lines as CSS counts them. */
export type GridArea = {
  row: number
  col: number
  rowSpan: number
  colSpan: number
}

type Size = { rowSpan: number; colSpan: number }

const FEATURE: Size = { rowSpan: 2, colSpan: 2 }
const TALL: Size = { rowSpan: 2, colSpan: 1 }
const WIDE: Size = { rowSpan: 1, colSpan: 2 }
const SINGLE: Size = { rowSpan: 1, colSpan: 1 }

/** Photos narrower than this are portraits and get two rows. */
const PORTRAIT_BELOW = 0.95

export function gridArea({ row, col, rowSpan, colSpan }: GridArea) {
  return `${row} / ${col} / span ${rowSpan} / span ${colSpan}`
}

/**
 * Where the year's opening and its photo tiles sit in the mosaic.
 *
 * The opening takes a 2×2 corner, the first photo is large, portraits run two
 * rows, and every fifth tile is wide. The outline stays open: the corner and
 * the last row are the only ragged edges. When a size would leave a hole above
 * the last row, it gives way: first the wide tiles, then portraits, from the
 * last one back. The large first photo always stays.
 */
export function mosaicLayout(
  ratios: number[],
  { columns, corner }: { columns: 2 | 4; corner: 'left' | 'right' },
): { corner: GridArea; tiles: GridArea[] } {
  const cornerArea: GridArea = {
    row: 1,
    col: columns === 4 && corner === 'right' ? 3 : 1,
    ...FEATURE,
  }
  if (ratios.length === 0) return { corner: cornerArea, tiles: [] }

  const preferred = ratios.map((ratio, i) =>
    i === 0
      ? FEATURE
      : ratio < PORTRAIT_BELOW
        ? TALL
        : i % 5 === 3
          ? WIDE
          : SINGLE,
  )
  for (const sizes of fallbacks(preferred)) {
    const tiles = place(sizes, columns, cornerArea)
    if (!hasHoles([cornerArea, ...tiles], columns)) {
      return { corner: cornerArea, tiles }
    }
  }
  // All single tiles after the large one always close up, so this is unreached
  throw new Error('No mosaic without holes')
}

/** The preferred sizes, then each step of giving way, ending all single. */
function* fallbacks(preferred: Size[]) {
  yield preferred
  let sizes = preferred.map(size => (size === WIDE ? SINGLE : size))
  yield sizes
  for (let i = sizes.length - 1; i > 0; i--) {
    if (sizes[i] !== TALL) continue
    sizes = sizes.map((size, j) => (j === i ? SINGLE : size))
    yield sizes
  }
}

/** Each tile in the first free spot, row by row, as CSS dense flow does. */
function place(sizes: Size[], columns: number, corner: GridArea) {
  const taken = new Set(cellsOf(corner))
  const fits = (area: GridArea) =>
    area.col + area.colSpan - 1 <= columns &&
    cellsOf(area).every(cell => !taken.has(cell))

  return sizes.map(size => {
    for (let row = 1; ; row++) {
      for (let col = 1; col <= columns; col++) {
        const area = { row, col, ...size }
        if (fits(area)) {
          cellsOf(area).forEach(cell => taken.add(cell))
          return area
        }
      }
    }
  })
}

function hasHoles(areas: GridArea[], columns: number) {
  const taken = new Set(areas.flatMap(cellsOf))
  const lastRow = Math.max(...areas.map(a => a.row + a.rowSpan - 1))
  for (let row = 1; row < lastRow; row++) {
    for (let col = 1; col <= columns; col++) {
      if (!taken.has(`${row}/${col}`)) return true
    }
  }
  return false
}

function cellsOf({ row, col, rowSpan, colSpan }: GridArea) {
  const cells: string[] = []
  for (let r = row; r < row + rowSpan; r++) {
    for (let c = col; c < col + colSpan; c++) cells.push(`${r}/${c}`)
  }
  return cells
}
