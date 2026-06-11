import { createClient } from '@sanity/client'
import {
  createImageUrlBuilder,
  type SanityImageSource,
} from '@sanity/image-url'
import { projectDetails } from './project-details.ts'

export const client = createClient({
  ...projectDetails(),
  useCdn: false,
})

const builder = createImageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
