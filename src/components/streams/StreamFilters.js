import * as MAPPING_TYPES from '../../constants/mapping_types'

// the export methods need to return an object like:
// { type: posts, ids: [1, 2, 3] }
export function postsFromLoves(loves) {
  const result = { type: MAPPING_TYPES.POSTS, ids: [] }
  loves.forEach((love) => {
    result.ids.push(`${love.postId}`)
  })
  return result
}

export function notificationsFromActivities(activities) {
  return { type: MAPPING_TYPES.NOTIFICATIONS, ids: activities }
}

export function settingsToggles(settings) {
  return { type: MAPPING_TYPES.SETTINGS, ids: settings }
}

export function userResults(users) {
  const result = { type: MAPPING_TYPES.USERS, ids: [] }
  users.forEach((user) => {
    result.ids.push(`${user.id}`)
  })
  return result
}

