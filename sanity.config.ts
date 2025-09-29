import { visionTool } from '@sanity/vision'
import { BookCheckIcon } from 'lucide-react'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { projectDetails } from './app/sanity/project-details.ts'
import { schemaTypes } from './app/sanity/schema/index.ts'

const singletonActions = new Set(['publish', 'discardChanges', 'restore'])
const singletonTypes = new Set(['curriculum'])

export default defineConfig({
  ...projectDetails(),
  name: 'walz',
  title: 'Walz',
  basePath: `/studio`,
  plugins: [
    structureTool({
      structure: S =>
        S.list()
          .title('Content')
          .items([
            S.documentTypeListItem('post').title('Posts'),
            S.documentTypeListItem('event').title('Ereignisse'),
            S.divider(),
            S.documentTypeListItem('costs').title('Kosten'),
            S.documentTypeListItem('person').title('Personen'),
            S.documentTypeListItem('year').title('Jahrgang'),
            S.documentTypeListItem('schoolYear').title('Schuljahr'),
            S.documentTypeListItem('testimonial').title('Erfahrungsberichte'),
            S.divider(),
            S.documentTypeListItem('home-hero').title('Home Hero'),
            S.documentTypeListItem('home-shoutout').title('Home Shoutout'),
            S.divider(),
            S.listItem()
              .title('Curriculum')
              .icon(BookCheckIcon)
              .id('curriculum')
              .child(
                S.document().schemaType('curriculum').documentId('curriculum'),
              ),
            S.documentTypeListItem('project').title('Projekte'),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,

    // Filter out singleton types from the global “New document” menu options
    templates: templates =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    // For singleton types, filter out actions that are not explicitly included
    // in the `singletonActions` list defined above
    actions: (input, context) => {
      if (singletonTypes.has(context.schemaType)) {
        return input.filter(
          ({ action }) => action && singletonActions.has(action),
        )
      }

      return input
    },
  },
})
