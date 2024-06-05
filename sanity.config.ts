import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { media as mediaTool } from 'sanity-plugin-media'
import { projectDetails } from '#app/sanity/project-details.ts'
import { schemaTypes } from '#app/sanity/schema/index.ts'

export default defineConfig({
  ...projectDetails(),
  name: 'walz',
  title: 'Walz',
  basePath: `/studio`,
  plugins: [structureTool(), visionTool(), mediaTool()],
  schema: {
    types: schemaTypes,
  },
})
