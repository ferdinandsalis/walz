import { createClient } from '@sanity/client'
import { projectDetails } from '#app/sanity/project-details.ts'
import { client } from './client.client.ts'

export const previewClient = createClient({
  ...projectDetails(),
  useCdn: false,
  perspective: 'previewDrafts',
  token: process.env.SANITY_READ_TOKEN,
})

export const getClient = (previewMode = false) =>
  previewMode ? previewClient : client

export const writeClient = createClient({
  ...projectDetails(),
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})
