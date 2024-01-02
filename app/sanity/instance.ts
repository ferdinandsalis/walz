import { createClient } from '@sanity/client'
import { projectDetails } from './project-details.ts'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types.js'

export const client = createClient({
  ...projectDetails(),
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
