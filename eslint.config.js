import { default as defaultConfig } from '@epic-web/config/eslint'

/** @type {import("eslint").Linter.Config} */
export default [
  ...defaultConfig,
  // add custom config objects here:
  {
    projectService: {
      maximumDefaultProjectFileMatchCount: 20, // Increase this value as needed
    },
  },
]
