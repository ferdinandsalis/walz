import { visionTool } from '@sanity/vision'
import { BookCheckIcon } from 'lucide-react'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { media as mediaTool } from 'sanity-plugin-media'
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
            S.divider(),
            S.documentTypeListItem('schoolYear').title('Schuljahr'),
            S.documentTypeListItem('costs').title('Kosten'),
            S.documentTypeListItem('person').title('Personen'),
            S.documentTypeListItem('year').title('Jahrgang'),
            S.documentTypeListItem('testimonial').title('Erfahrungsberichte'),

            S.divider(),
            S.documentTypeListItem('home-hero').title('Home Hero'),
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
    // @ts-ignore it says its sanity v3 but typing suggest otherwise 🤷
    mediaTool(),
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
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
})
