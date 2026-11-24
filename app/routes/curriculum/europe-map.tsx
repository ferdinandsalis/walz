import { useId } from 'react'

// The places the Walz travels to, named in the project titles, with where
// their labels sit next to the dot
const places = [
  { name: 'Wien', lon: 16.37, lat: 48.21, home: true, dx: 14, dy: 8 },
  { name: 'Kamp', lon: 15.6, lat: 48.55, year: 2, dx: -70, dy: -18 },
  { name: 'Irland', lon: -7.5, lat: 53.2, year: 2, dx: 12, dy: -12 },
  { name: 'Kühtai', lon: 11.0, lat: 47.21, year: 2, dx: -80, dy: 24 },
  { name: 'Palfau', lon: 14.8, lat: 47.7, year: 3, dx: -24, dy: 34 },
  { name: 'Toskana', lon: 11.25, lat: 43.4, year: 4, dx: 12, dy: -12 },
  { name: 'Paris', lon: 2.35, lat: 48.86, year: 5, dx: 12, dy: -12 },
] as const

const home = places[0]
/** The label size the offsets above were set for. */
const LABEL_PX = 22
/** The year line's size relative to the name, as in its text-[0.65em]. */
const YEAR_SCALE = 0.65
const width = 800
const height = 460
// A plain projection of the part of Europe from Ireland to Vienna, with room
// for the label beside Vienna
const x = (lon: number) => ((lon + 12) / 34) * width
const y = (lat: number) => ((56 - lat) / 14) * height

/** The Walz's journeys as arcs from Vienna, each place with its year. */
export function EuropeMap() {
  const gridId = useId()
  return (
    <figure className="bg-secondary-50 overflow-hidden rounded-lg">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img">
        <title>
          Reisen der Walz von Wien aus: Kamp, Kühtai und Irland im 2. Jahr,
          Palfau im 3., Toskana im 4. und Paris im 5. Jahr
        </title>
        <defs>
          <pattern
            id={gridId}
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.2" className="fill-secondary-200" />
          </pattern>
        </defs>
        <rect width={width} height={height} fill={`url(#${gridId})`} />
        {places.map(place =>
          'home' in place ? null : (
            <path
              key={place.name}
              d={`M${x(home.lon)},${y(home.lat)} Q${(x(home.lon) + x(place.lon)) / 2},${Math.min(y(home.lat), y(place.lat)) - 60} ${x(place.lon)},${y(place.lat)}`}
              className="stroke-primary fill-none"
              strokeWidth={2.5}
              strokeDasharray="6 6"
            />
          ),
        )}
        {places.map(place => (
          <g
            key={place.name}
            transform={`translate(${x(place.lon)},${y(place.lat)})`}
          >
            <circle
              r={'home' in place ? 10 : 8}
              className={'home' in place ? 'fill-foreground' : 'fill-primary'}
              stroke="white"
              strokeWidth={3}
            />
            {/* Offsets in em, so the labels move with their size; phones get
                larger names and leave the year to the sections below */}
            <text
              x={`${place.dx / LABEL_PX}em`}
              y={`${place.dy / LABEL_PX}em`}
              className="font-condensed fill-foreground text-[32px] font-bold sm:text-[22px]"
            >
              {place.name}
              {'year' in place ? (
                <tspan
                  x={`${place.dx / LABEL_PX / YEAR_SCALE}em`}
                  dy="1.3em"
                  className="font-sans text-[0.65em] font-normal max-sm:hidden"
                >
                  {place.year}. Jahr
                </tspan>
              ) : null}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  )
}
