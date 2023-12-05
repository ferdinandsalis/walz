import { defineCliConfig } from 'sanity/cli'
import { projectDetails } from '#app/sanity/project-details.ts'

export default defineCliConfig({
  api: projectDetails(),
})
