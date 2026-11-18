import { vi } from 'vitest'

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

/**
 * The carousel (embla) needs browser APIs that jsdom lacks. Stub them so
 * components containing a carousel can mount in jsdom tests.
 */
export function stubCarouselBrowserApis() {
  vi.stubGlobal('ResizeObserver', NoopObserver)
  vi.stubGlobal('IntersectionObserver', NoopObserver)
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
  }))
}
