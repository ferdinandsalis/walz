import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { projectDetails } from '#app/sanity/project-details.ts'
import { schemaTypes } from '#app/sanity/schema/index.ts'

export default defineConfig({
  ...projectDetails(),
  name: 'walz',
  title: 'Walz',
  plugins: [deskTool(), visionTool()],
  basePath: `/studio`,
  schema: {
    types: schemaTypes,
  },
})
