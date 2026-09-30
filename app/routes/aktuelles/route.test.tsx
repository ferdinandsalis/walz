import { renderToStaticMarkup } from 'react-dom/server'
import { createRoutesStub } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { type z } from 'zod'
import { type EventSchema } from '#app/sanity/models/event.ts'
import Aktuelles from './route.tsx'

type Event = z.infer<typeof EventSchema>

const event = (_id: string, title: string, date: string): Event => ({
  _id,
  _type: 'event',
  title,
  slug: null,
  location: null,
  description: null,
  start: { date: new Date(date) },
  end: null,
  type: null,
})

const Stub = createRoutesStub([
  { id: 'aktuelles', path: '/aktuelles', Component: Aktuelles },
])

describe('Aktuelles', () => {
  it('gives every event in a year a key', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    const html = renderToStaticMarkup(
      <Stub
        initialEntries={['/aktuelles']}
        hydrationData={{
          loaderData: {
            aktuelles: {
              query: '',
              params: {},
              data: {
                posts: [],
                years: [],
                events: {
                  '2026': [
                    event('event-sommerfest', 'Sommerfest', '2026-06-26'),
                    event('event-theater', 'Theaterabend', '2026-07-03'),
                  ],
                },
              },
            },
          },
        }}
      />,
    )

    expect(html).toContain('Sommerfest')
    expect(html).toContain('Theaterabend')
    expect(consoleError.mock.calls).toEqual([])
  })
})
