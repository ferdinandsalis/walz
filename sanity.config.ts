import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from "sanity/structure";
import { media } from 'sanity-plugin-media'
import { projectDetails } from '#app/sanity/project-details.ts'
import { schemaTypes } from '#app/sanity/schema/index.ts'

export default defineConfig({
  ...projectDetails(),
  name: 'walz',
  title: 'Walz',
  plugins: [structureTool(), visionTool(), media()],
  basePath: `/studio`,
  schema: {
    types: schemaTypes,
  },
})
