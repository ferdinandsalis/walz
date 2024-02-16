import clsx, { type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'
import { curry } from 'ramda'
import { extendedTheme } from './extended-theme.ts'

export function getErrorMessage(error: unknown) {
  if (typeof error === 'string') return error
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message
  }
  console.error('Unable to get error message for error', error)
  return 'Unknown Error'
}

function formatColors() {
  const colors = []
  for (const [key, color] of Object.entries(extendedTheme.colors)) {
    if (typeof color === 'string') {
      colors.push(key)
    } else {
      const colorGroup = Object.keys(color).map(subKey =>
        subKey === 'DEFAULT' ? '' : subKey,
      )
      colors.push({ [key]: colorGroup })
    }
  }
  return colors
}

const customTwMerge = extendTailwindMerge<string, string>({
  extend: {
    theme: {
      colors: formatColors(),
      borderRadius: Object.keys(extendedTheme.borderRadius),
    },
    classGroups: {
      'font-size': [
        {
          text: Object.keys(extendedTheme.fontSize),
        },
      ],
      animate: [
        {
          animate: Object.keys(extendedTheme.animation),
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs))
}

export function getDomainUrl(request: Request) {
  const host =
    request.headers.get('X-Forwarded-Host') ??
    request.headers.get('host') ??
    new URL(request.url).host
  const protocol = host.includes('localhost') ? 'http' : 'https'
  return `${protocol}://${host}`
}

export function getReferrerRoute(request: Request) {
  const referrer =
    request.headers.get('referer') ??
    request.headers.get('referrer') ??
    request.referrer
  const domain = getDomainUrl(request)
  if (referrer?.startsWith(domain)) {
    return referrer.slice(domain.length)
  } else {
    return '/'
  }
}

const shuffler = curry(function (random, list) {
  const len = list.length
  let idx = -1
  let position
  const result: any[] = []
  while (++idx < len) {
    position = Math.floor((idx + 1) * random())
    result[idx] = result[position]
    result[position] = list[idx]
  }
  return result
})

export const shuffle = shuffler(Math.random)
