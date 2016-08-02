import React from 'react'
import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as api from '../networking/api'
import * as StreamRenderables from '../components/streams/StreamRenderables'
import * as StreamFilters from '../components/streams/StreamFilters'
import { ErrorState } from '../components/errors/Errors'

export function flagUser(username, kind) {
  return {
    type: ACTION_TYPES.USER.FLAG,
    payload: {
      endpoint: api.flagUser(`~${username}`, kind),
      method: 'POST',
    },
    meta: {},
  }
}

export function loadUserDetail(username) {
  return {
    type: ACTION_TYPES.PROFILE.DETAIL,
    payload: { endpoint: api.userDetail(username) },
    meta: {
      mappingType: MAPPING_TYPES.USERS,
      updateResult: false,
    },
  }
}

export function loadUserPosts(username, type) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.userResources(username, type) },
    meta: {
      mappingType: MAPPING_TYPES.POSTS,
      renderStream: {
        asList: StreamRenderables.postsAsList,
        asGrid: StreamRenderables.postsAsGrid,
      },
    },
  }
}

export function loadUserLoves(username, type) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.userResources(username, type) },
    meta: {
      mappingType: MAPPING_TYPES.LOVES,
      renderStream: {
        asList: StreamRenderables.postsAsList,
        asGrid: StreamRenderables.postsAsGrid,
      },
      resultFilter: StreamFilters.postsFromLoves,
    },
  }
}

export function loadUserFollowing(username, priority) {
  const endpoint = api.userFollowing(username, priority)
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint },
    meta: {
      mappingType: MAPPING_TYPES.USERS,
      renderStream: {
        asList: StreamRenderables.usersAsList,
        asGrid: StreamRenderables.usersAsGrid,
      },
      resultKey: `/${username}/following?per_page=10&priority=${priority}`,
    },
  }
}
export function loadUserUsers(username, type) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.userResources(username, type) },
    meta: {
      mappingType: MAPPING_TYPES.USERS,
      renderStream: {
        asList: StreamRenderables.usersAsList,
        asGrid: StreamRenderables.usersAsGrid,
      },
    },
  }
}

export function loadUserAvatars(endpoint, post, resultType) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint },
    meta: {
      mappingType: MAPPING_TYPES.USERS,
      renderStream: {
        asList: StreamRenderables.userAvatars,
        asGrid: StreamRenderables.userAvatars,
        asError: <ErrorState />,
      },
      resultKey: `/posts/${post.id}/${resultType}`,
      updateKey: `/posts/${post.id}/`,
    },
  }
}

export function sendMessage(id, subject, message) {
  return {
    type: ACTION_TYPES.USER.HIRE_ME,
    payload: {
      body: { subject, body: message },
      endpoint: api.hireUser(id),
    },
  }
}
