import * as queryStore from '@sanity/react-loader'
import { client } from './instance.ts'

const clientWithToken = client.withConfig({
  token: process.env.SANITY_READ_TOKEN,
})

// We need to set the client used by `loadQuery` here, it only affects the server and ensures the browser bundle isn't bloated
async function setSanityServerClient() {
  try {
    // @ts-expect-error
    await queryStore.loadQuery()
  } catch (error) {
    // HACK: HMR causes this to fail when module is reloaded
    if (
      error instanceof Error &&
      error.message ==
        'You have to set the Sanity client with `setServerClient` before any data fetching is done'
    ) {
      queryStore.setServerClient(clientWithToken)
    }
  }
}

setSanityServerClient()

export const { loadQuery } = queryStore
