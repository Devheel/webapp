/* eslint-disable no-param-reassign */
import * as ACTION_TYPES from '../../constants/action_types'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import * as jsonReducer from '../../reducers/json'
import { emptyPagination } from '../../components/streams/Paginator'

const methods = {}

function _updatePostLoves(state, newState, action) {
  const { method, model } = action.payload

  const newPost = {
    id: model ? model.id : '',
  }

  let delta = 0
  let idAdded = false
  switch (action.type) {
    case ACTION_TYPES.POST.LOVE_REQUEST:
      if (method === 'POST') {
        delta = 1
        newPost.loved = true
        idAdded = true
      } else {
        delta = -1
        newPost.loved = false
        newPost.showLovers = false
      }
      break
    case ACTION_TYPES.POST.LOVE_FAILURE:
      if (method === 'POST') {
        delta = -1
        newPost.loved = false
      } else {
        delta = 1
        newPost.loved = true
        idAdded = true
      }
      break
    case ACTION_TYPES.POST.LOVE_SUCCESS:
      if (method === 'POST') {
        newPost.showLovers = true
        idAdded = true
      } else {
        newPost.showLovers = false
      }
      break
    default:
      return state
  }

  // since we pull `model` out of payload, not state, we don't want to set
  // or update the lovesCount during a LOVE_SUCCESS.
  //
  // During LOVE_REQUEST, model.lovesCount is incremented.
  // In LOVE_SUCCESS, model.lovesCount is the *old* value, so just ignore it.
  if (delta !== 0) {
    newPost.lovesCount = Number(model.lovesCount) + delta
  }

  const resultPath = jsonReducer.methods.pagesKey(action)
  const existingResult = newState.pages[resultPath] ||
    { type: 'users', ids: [], pagination: emptyPagination() }
  const existingIds = existingResult.ids

  const currentUser = jsonReducer.methods.getCurrentUser(newState)
  if (idAdded) {
    existingIds.unshift(currentUser.id)
  } else {
    const index = existingIds.indexOf(currentUser.id)
    if (index !== -1) {
      existingIds.splice(index, 1)
    }
  }
  newState.pages[resultPath] = existingResult

  jsonReducer.methods.updateUserCount(newState, model.authorId, 'lovesCount', delta)
  jsonReducer.methods.mergeModel(
    newState,
    MAPPING_TYPES.POSTS,
    newPost
  )

  return newState
}
methods.updatePostLoves = (state, newState, action) =>
  _updatePostLoves(state, newState, action)

function _addOrUpdatePost(newState, action) {
  const { model, response } = action.payload
  const user = model ?
    newState[MAPPING_TYPES.USERS][model.authorId] :
    jsonReducer.methods.getCurrentUser(newState)
  let index = null
  switch (action.type) {
    case ACTION_TYPES.POST.CREATE_SUCCESS:
      newState[MAPPING_TYPES.POSTS][response.id] = response
      if (newState.pages['/following']) {
        newState.pages['/following'].ids.unshift(response.id)
      }
      if (action.meta.repostId) {
        const repostId = action.meta.repostId
        const post = newState[MAPPING_TYPES.POSTS][repostId]
        if (post) {
          newState[MAPPING_TYPES.POSTS][repostId] = {
            ...post,
            repostsCount: (post.repostsCount || 0) + 1,
          }
        }
      }
      if (action.meta.repostedFromId) {
        const repostId = action.meta.repostedFromId
        const post = newState[MAPPING_TYPES.POSTS][repostId]
        if (post) {
          newState[MAPPING_TYPES.POSTS][repostId] = {
            ...post,
            repostsCount: (post.repostsCount || 0) + 1,
          }
        }
      }
      if (user) {
        jsonReducer.methods.updateUserCount(newState, user.id, 'postsCount', 1)
        if (newState.pages[`/${user.username}`]) {
          newState.pages[`/${user.username}`].ids.unshift(response.id)
        }
      }
      return newState
    case ACTION_TYPES.POST.DELETE_SUCCESS:
      if (user) {
        if (newState.pages['/following']) {
          index = newState.pages['/following'].ids.indexOf(user.id)
          if (index > -1) {
            newState.pages['/following'].ids.splice(index, 1)
          }
        }
        jsonReducer.methods.updateUserCount(newState, user.id, 'postsCount', -1)
        if (newState.pages[`/${user.username}`]) {
          index = newState.pages[`/${user.username}`].ids.indexOf(model.id)
          if (index > -1) {
            newState.pages[`/${user.username}`].ids.splice(index, 1)
          }
        }
      }
      return newState
    case ACTION_TYPES.POST.CREATE_FAILURE:
      if (user) {
        jsonReducer.methods.updateUserCount(newState, user.id, 'postsCount', -1)
      }
      return newState
    case ACTION_TYPES.POST.UPDATE_SUCCESS:
      newState[MAPPING_TYPES.POSTS][response.id] = response
      return newState
    default:
      return newState
  }
}
methods.addOrUpdatePost = (newState, action) =>
  _addOrUpdatePost(newState, action)

function _toggleComments(newState, action) {
  const { model, showComments } = action.payload
  newState[MAPPING_TYPES.POSTS][model.id].showComments = showComments
  return newState
}
methods.toggleComments = (newState, action) =>
  _toggleComments(newState, action)

function _toggleEditing(newState, action) {
  const { model, isEditing } = action.payload
  newState[MAPPING_TYPES.POSTS][model.id].isEditing = isEditing
  return newState
}
methods.toggleEditing = (newState, action) =>
  _toggleEditing(newState, action)

function _toggleLovers(newState, action) {
  const { model, showLovers } = action.payload
  newState[MAPPING_TYPES.POSTS][model.id].showLovers = showLovers
  return newState
}
methods.toggleLovers = (newState, action) =>
  _toggleLovers(newState, action)

function _toggleReposting(newState, action) {
  const { model, isReposting } = action.payload
  newState[MAPPING_TYPES.POSTS][model.id].isReposting = isReposting
  return newState
}
methods.toggleReposting = (newState, action) =>
  _toggleReposting(newState, action)

function _toggleReposters(newState, action) {
  const { model, showReposters } = action.payload
  newState[MAPPING_TYPES.POSTS][model.id].showReposters = showReposters
  return newState
}
methods.toggleReposters = (newState, action) =>
  _toggleReposters(newState, action)

export default methods

