import { defineCliConfig } from 'sanity/cli'
import { projectDetails } from '#app/sanity/project-details.ts'

export default defineCliConfig({
  api: projectDetails(),
  typegen: {
    path: './app/**/*.{ts,tsx,js,jsx}',
    schema: './app/sanity/schema.json',
    generates: './app/sanity/types.ts',
    overloadClientMethods: true,
  },
})
