/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { createRoutesStub, Outlet } from 'react-router'
import { expect, test } from 'vitest'
import { PageTitle, PageTitleSpine } from './page-title.tsx'

/** The root shows the spine like the site header does; pages show the title. */
function Root() {
  return (
    <>
      <PageTitleSpine />
      <Outlet />
    </>
  )
}

test('shows the title the route names as the page heading', async () => {
  const Stub = createRoutesStub([
    {
      Component: Root,
      children: [
        {
          path: '/kontakt',
          Component: PageTitle,
          handle: { pageTitle: 'Kontakt' },
        },
      ],
    },
  ])
  render(<Stub initialEntries={['/kontakt']} />)

  const heading = await screen.findByRole('heading', { level: 1 })
  expect(heading.textContent).toBe('Kontakt')
})

test('repeats the title as a vertical copy hidden from assistive tech', async () => {
  const Stub = createRoutesStub([
    {
      Component: Root,
      children: [
        {
          path: '/kontakt',
          Component: PageTitle,
          handle: { pageTitle: 'Kontakt' },
        },
      ],
    },
  ])
  render(<Stub initialEntries={['/kontakt']} />)

  await screen.findByRole('heading', { level: 1 })
  const copies = screen.getAllByText('Kontakt')
  const spine = copies.find(element => element.tagName !== 'H1')!
  expect(spine.getAttribute('aria-hidden')).toBe('true')
})

test('shows no vertical title on a page that names none', async () => {
  const Stub = createRoutesStub([
    {
      Component: Root,
      children: [{ path: '/', Component: () => <p>Startseite</p> }],
    },
  ])
  const { container } = render(<Stub initialEntries={['/']} />)

  await screen.findByText('Startseite')
  expect(container.querySelector('[aria-hidden]')).toBeNull()
})

test('uses the parent route title on a sub-page without its own', async () => {
  const Stub = createRoutesStub([
    {
      Component: Root,
      children: [
        {
          path: '/ueber-uns/philosophie',
          Component: Outlet,
          handle: { pageTitle: 'Über uns' },
          children: [{ path: 'bildung', Component: () => <p>Bildung</p> }],
        },
      ],
    },
  ])
  render(<Stub initialEntries={['/ueber-uns/philosophie/bildung']} />)

  await screen.findByText('Bildung')
  expect(screen.getByText('Über uns').getAttribute('aria-hidden')).toBe('true')
})

test('lets a sub-page title win over its parent', async () => {
  const Stub = createRoutesStub([
    {
      Component: Root,
      children: [
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
      ],
    },
  ])
  render(<Stub initialEntries={['/eltern/kind']} />)

  const heading = await screen.findByRole('heading', { level: 1 })
  expect(heading.textContent).toBe('Kind')
  expect(screen.queryByText('Eltern')).toBeNull()
})
