export const imageVersionProps = `
  fragment imageVersionProps on Image {
    url
    metadata { height width type size }
  }
`

export const tshirtImageVersions = `
  fragment tshirtImageVersions on TshirtImageVersions {
    small { ...imageVersionProps }
    regular { ...imageVersionProps }
    large { ...imageVersionProps }
    original { ...imageVersionProps }
  }
`

export const responsiveImageVersions = `
  fragment responsiveImageVersions on ResponsiveImageVersions {
    xhdpi { ...imageVersionProps }
    hdpi { ...imageVersionProps }
    mdpi { ...imageVersionProps }
    ldpi { ...imageVersionProps }
    optimized { ...imageVersionProps }
    original { ...imageVersionProps }
    video { ...imageVersionProps }
  }
`

export const pageHeaderImageVersions = `
  fragment pageHeaderImageVersions on ResponsiveImageVersions {
    xhdpi { ...imageVersionProps }
    hdpi { ...imageVersionProps }
    optimized { ...imageVersionProps }
    video { ...imageVersionProps }
  }
`

export const authorSummary = `
  fragment authorSummary on User {
    id
    username
    name
    avatar { ...tshirtImageVersions }
    currentUserState { relationshipPriority }
    settings {
      hasLovesEnabled
      hasSharingEnabled
      hasRepostingEnabled
      hasCommentingEnabled
      postsAdultContent
    }
  }
`

export const contentProps = `
  fragment contentProps on ContentBlocks {
    linkUrl
    kind
    data
    links { assets }
  }
`

export const artistInviteSubmissionSummary = `
  fragment artistInviteSubmissionSummary on ArtistInviteSubmission {
    id
    status
    artistInvite { id slug title }
  }
`

export const postSummary = `
  fragment postSummary on Post {
    id
    token
    createdAt
    artistInviteSubmission { ...artistInviteSubmissionSummary }
    summary { ...contentProps }
    content { ...contentProps }
    repostContent { ...contentProps }
    author { ...authorSummary }
    categories { ...categorySummary }
    assets { id attachment { ...responsiveImageVersions } }
    postStats { lovesCount commentsCount viewsCount repostsCount }
    currentUserState { watching loved reposted }
  }
`

export const categorySummary = `
  fragment categorySummary on Category {
    id
    slug
    name
  }
`

export const postStream = `
  fragment postStream on PostStream {
    next
    isLastPage
    posts { ...postSummary repostedSource { ...postSummary } }
  }
`

export const postStreamAllFragments = `
  ${imageVersionProps}
  ${responsiveImageVersions}
  ${tshirtImageVersions}
  ${contentProps}
  ${authorSummary}
  ${categorySummary}
  ${artistInviteSubmissionSummary}
  ${postSummary}
  ${postStream}
`
