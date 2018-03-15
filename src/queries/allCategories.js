import { tshirtImageVersions, imageVersionProps } from './fragments'

export default `
  ${imageVersionProps}
  ${tshirtImageVersions}
  {
    allCategories {
      id
      name
      slug
      level
      order
      allowInOnboarding
      isCreatorType
      tileImage { ...tshirtImageVersions }
    }
  }
`
