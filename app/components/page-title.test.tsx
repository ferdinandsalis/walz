/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { createRoutesStub, Outlet } from 'react-router'
import { expect, test } from 'vitest'
import { PageTitle } from './page-title.tsx'

test('shows the title the route names as the page heading', async () => {
  const Stub = createRoutesStub([
    {
      path: '/kontakt',
      Component: PageTitle,
      handle: { pageTitle: 'Kontakt' },
    },
  ])
  render(<Stub initialEntries={['/kontakt']} />)

  const heading = await screen.findByRole('heading', { level: 1 })
  expect(heading.textContent).toBe('Kontakt')
})

test('uses the parent route title on a sub-page without its own', async () => {
  const Stub = createRoutesStub([
    {
      path: '/eltern',
      Component: Outlet,
      handle: { pageTitle: 'Eltern' },
      children: [{ path: 'kind', Component: PageTitle }],
    },
  ])
  render(<Stub initialEntries={['/eltern/kind']} />)

  const heading = await screen.findByRole('heading', { level: 1 })
  expect(heading.textContent).toBe('Eltern')
})

test('lets a sub-page title win over its parent', async () => {
  const Stub = createRoutesStub([
    {
      path: '/eltern',
      Component: Outlet,
      handle: { pageTitle: 'Eltern' },
      children: [
        {
          path: 'kind',
          Component: PageTitle,
          handle: { pageTitle: 'Kind' },
        },
      ],
    },
  ])
  render(<Stub initialEntries={['/eltern/kind']} />)

  const heading = await screen.findByRole('heading', { level: 1 })
  expect(heading.textContent).toBe('Kind')
  expect(screen.queryByText('Eltern')).toBeNull()
})
