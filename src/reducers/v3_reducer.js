import Immutable from 'immutable'
import { camelizeKeys } from 'humps'
import * as ACTION_TYPES from '../constants/action_types'

// Like .getIn but for regular JS objects
// Does not break if object is missing a key in the middle
// TODO: Immutable 4.x has a functional getIn that works on both Maps and objects.
function deepGet(object, [head, ...tail], fallback = null) {
  const val = object[head]
  if (val === undefined || val === null) { return fallback }
  if (tail.length === 0) { return val }
  return deepGet(val, tail, fallback)
}

// Merge two Immutable maps while preferring data over nulls and never returning undefined.
function smartMergeDeep(oldMap, newMap) {
  const filteredNewMap = newMap.filterNot(v => v === undefined || v === null)
  return oldMap.mergeDeepWith((oldVal, newVal) => {
    if (oldVal === undefined && newVal === undefined) { return null }
    if (oldVal === null || oldVal === undefined) { return newVal }
    return newVal
  }, filteredNewMap)
}

// Given state (immutable), a key path (array[string]), and map merge the map in.
// If a value on either side is null or undefined it "loses" the merge - we always prefer data.
function smartMergeDeepIn(state, keyPath, newMap) {
  const oldMap = state.getIn(keyPath, Immutable.Map())
  const mergedMap = smartMergeDeep(oldMap, newMap)
  return state.setIn(keyPath, mergedMap)
}

function parseList(state, list, parser) {
  if (!Array.isArray(list)) { return state }
  return list.reduce(parser, state)
}

function parsePagination(state, stream, pathname, query, variables) {
  const { posts: models, next, isLastPage } = stream
  const mergedState = state.mergeDeepIn(['pages', pathname], Immutable.fromJS({
    pagination: Immutable.fromJS({ next, query, variables, isLastPage }),
  }))
  return mergedState.updateIn(['pages', pathname, 'ids'], (existingPageIds) => {
    const newPageIds = Immutable.OrderedSet(models.map(m => m.id))
    // If we don't have any existingPageIds just return the new ids.
    if (!existingPageIds || existingPageIds.count() === 0) {
      return newPageIds
    }
    // If we have a before value in the query this is not the first page, so append to ordered set.
    if (variables.before || (variables.get && variables.get('before'))) {
      return existingPageIds.concat(newPageIds)
    }
    // If we don't have a before value this is either the first page or re-requesting the first
    // page. In that case we need to prepend to the ordered set.
    return newPageIds.concat(existingPageIds)
  })
}

function parseAsset(state, asset) {
  if (!asset) { return state }
  return smartMergeDeepIn(state, ['assets', asset.id], Immutable.fromJS({
    id: asset.id,
    attachment: asset.attachment,
  }))
}

function reduceAssets(assets) {
  return (assets || []).reduce((byId, asset) => (
      { ...byId, [asset.id]: asset }
    ), {})
}

function parseCategory(state, category) {
  if (!category) { return state }
  return smartMergeDeepIn(state, ['categories', category.id], Immutable.fromJS({
    id: category.id,
    slug: category.slug,
    name: category.name,
    level: category.level,
    order: category.order,
    allowInOnboarding: category.allowInOnboarding,
    isCreatorType: category.isCreatorType,
    tileImage: category.tileImage,
  }))
}

function parseArtistInviteSubmission(state, submission) {
  if (!submission || !submission.id) { return state }
  return smartMergeDeepIn(state, ['artistInviteSubmissions', submission.id], Immutable.fromJS({
    id: submission.id,
  }))
}

function parseUser(state, user) {
  if (!user) { return state }

  const state1 = smartMergeDeepIn(state, ['users', user.id], Immutable.fromJS({

    // Minumum properties
    id: user.id,
    username: user.username,
    name: user.name,
    avatar: user.avatar,

    // Extended properties
    coverImage: user.coverImage,
    badges: user.badges,
    externalLinksLink: user.externalLinksLink,
    formattedShortBio: user.formattedShortBio,
    location: user.location,

    // Settings
    isCollaboratable: deepGet(user, ['settings', 'isCollaboratable']),
    isHireable: deepGet(user, ['settings', 'isHireable']),
    hasCommentingEnabled: deepGet(user, ['settings', 'hasCommentingEnabled']),
    hasLovesEnabled: deepGet(user, ['settings', 'hasLovesEnabled']),
    hasRepostingEnabled: deepGet(user, ['settings', 'hasRepostingEnabled']),
    hasSharingEnabled: deepGet(user, ['settings', 'hasSharingEnabled']),
    postsAdultContent: deepGet(user, ['settings', 'postAdultContent']),

    // userStats
    followersCount: deepGet(user, ['userStats', 'followersCount']),
    followingCount: deepGet(user, ['userStats', 'followingCount']),
    postsCount: deepGet(user, ['userStats', 'postsCount']),
    lovesCount: deepGet(user, ['userStats', 'lovesCount']),
    totalViewsCount: deepGet(user, ['userStats', 'totalViewsCount']),

    // currentUserState
    relationshipPriority: deepGet(user, ['currentUserState', 'relationshipPriority']),
  }))
  const state2 = parseList(state1, user.categories, parseCategory)
  return state2
}

function parsePageHeader(state, pageHeader) {
  if (!pageHeader) { return state }
  const state1 = parseUser(state, pageHeader.user)
  const state2 = parseCategory(state1, pageHeader.category)
  return smartMergeDeepIn(state2, ['pageHeaders', pageHeader.id], Immutable.fromJS({
    id: pageHeader.id,
    kind: pageHeader.kind,
    slug: pageHeader.slug,
    postToken: pageHeader.postToken,
    header: pageHeader.header,
    subheader: pageHeader.subheader,
    ctaLink: pageHeader.ctaLink,
    image: pageHeader.image,
    userId: deepGet(pageHeader, ['user', 'id']),
    categoryId: deepGet(pageHeader, ['category', 'id']),
  }))
}

function postLinks(post) {
  const links = {}
  const authorId = deepGet(post, ['author', 'id'])
  if (authorId) { links.author = { id: authorId, type: 'user' } }

  const repostAuthorId = deepGet(post, ['repostedSource', 'author', 'id'])
  if (repostAuthorId) { links.repostAuthor = { id: repostAuthorId, type: 'user' } }

  const repostId = deepGet(post, ['repostedSource', 'id'])
  if (repostId) { links.repostedSource = { id: repostId, type: 'post' } }

  const categories = deepGet(post, ['categories'])
  if (categories && !!categories.length) {
    links.categories = categories.map(cat => cat.id)
  }

  return links
}

// Camelize data keys, inject assets objects into appropriate region
function parseRegion(post, type, assetsById) {
  return (post[type] || []).map((region, index) => {
    const id = `${post.id}-${index}`
    const assetId = deepGet(region, ['links', 'assets'])
    const asset = assetsById[assetId]
    let data = null
    if (typeof region.data === 'object') {
      data = camelizeKeys(region.data)
    } else {
      data = region.data
    }
    if (region.kind === 'image' && typeof assetId === 'string' && asset) {
      return { ...region, data, id, asset }
    }
    return { ...region, data, id }
  })
}

function parsePost(state, post) {
  if (!post) { return state }

  const state1 = parseUser(state, post.author)
  const state2 = parseList(state1, post.assets, parseAsset)
  const state3 = parsePost(state2, post.repostedSource)
  const state4 = parseArtistInviteSubmission(state3, post.artistInviteSubmission)
  const state5 = parseList(state4, post.categories, parseCategory)

  const assetsById = reduceAssets(post.assets)
  const repostAssetsById = post.repostedSource ? reduceAssets(post.repostedSource.assets) : null

  const state6 = smartMergeDeepIn(state5, ['posts', post.id], Immutable.fromJS({
    // ids
    id: post.id,
    authorId: deepGet(post, ['author', 'id']), // We don't use links for this

    // Properties
    token: post.token,
    createdAt: post.createdAt,
    artistInviteId: deepGet(post, ['artistInviteSubmission', 'artistInvite']),
    artistInviteSubmission: post.artistInviteSubmission,

    // Content
    summary: parseRegion(post, 'summary', assetsById),
    content: parseRegion(post, 'content', assetsById),
    repostContent: parseRegion(post, 'repostContent', repostAssetsById),

    // Stats
    lovesCount: deepGet(post, ['postStats', 'lovesCount']),
    commentsCount: deepGet(post, ['postStats', 'commentsCount']),
    viewsCount: deepGet(post, ['postStats', 'viewsCount']),
    repostsCount: deepGet(post, ['postStats', 'repostsCount']),

    // Current user state
    watching: deepGet(post, ['currentUserState', 'watching']),
    loved: deepGet(post, ['currentUserState', 'loved']),
    reposted: deepGet(post, ['currentUserState', 'reposted']),

    // Links
    links: postLinks(post),
  }))

  return state6
}

function parseQueryType(state, stream, pathname, query, variables) {
  const { posts } = stream
  const state1 = parseList(state, posts, parsePost)
  return parsePagination(state1, stream, pathname, query, variables)
}

function parseStream(state, { payload: { response: { data }, pathname, query, variables } }) {
  return Object.keys(data).reduce((s, key) =>
    parseQueryType(s, data[key], pathname, query, variables),
    state,
  )
}

function parseCategoryQueries(state, { payload: { response: { data } } }) {
  return parseList(state, data.categoryNav || data.allCategories, parseCategory)
}

function parsePageHeaders(state, { payload: { response: { data: { pageHeaders } } } }) {
  return parseList(state, pageHeaders, parsePageHeader)
}

// Dispatch different graphql response types for parsing (reducing)
export default function (state, action) {
  const { type } = action
  switch (type) {
    case ACTION_TYPES.V3.LOAD_STREAM_SUCCESS:
    case ACTION_TYPES.V3.LOAD_NEXT_CONTENT_SUCCESS:
      return parseStream(state, action)
    case ACTION_TYPES.V3.LOAD_CATEGORIES_SUCCESS:
      return parseCategoryQueries(state, action)
    case ACTION_TYPES.V3.LOAD_PAGE_HEADERS_SUCCESS:
      return parsePageHeaders(state, action)
    default:
      return state
  }
}
