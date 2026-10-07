import { type ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

/**
 * Renders an element to the markup the server sends and parses it, so a test
 * can query the server HTML. Needs the jsdom environment.
 */
export function renderStatic(element: ReactElement) {
  const container = document.createElement('div')
  container.innerHTML = renderToStaticMarkup(element)
  return container
}
