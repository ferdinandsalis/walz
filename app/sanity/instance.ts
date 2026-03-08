import { createClient } from '@sanity/client'
import imageUrlBuilder, { type SanityImageSource } from '@sanity/image-url'
import { projectDetails } from './project-details.ts'

export const client = createClient({
  ...projectDetails(),
  useCdn: false,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
