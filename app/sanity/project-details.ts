type ProjectDetails = {
  projectId: string
  dataset: string
  apiVersion: string
}

export const projectDetails = (): ProjectDetails => {
  const {
    SANITY_PUBLIC_PROJECT_ID,
    SANITY_PUBLIC_DATASET,
    SANITY_PUBLIC_API_VERSION,
  } = typeof document === 'undefined' ? process.env : window.ENV

  return {
    projectId: SANITY_PUBLIC_PROJECT_ID ?? `iaejvb99`,
    dataset: SANITY_PUBLIC_DATASET ?? `production`,
    apiVersion: SANITY_PUBLIC_API_VERSION ?? `2023-10-01`,
  }
}
