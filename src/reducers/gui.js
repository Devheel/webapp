import { REHYDRATE } from 'redux-persist/constants'
import _ from 'lodash'

import { LOCATION_CHANGE } from 'react-router-redux'
import {
  AUTHENTICATION,
  GUI,
  HEAD_FAILURE,
  HEAD_SUCCESS,
  LOAD_STREAM_SUCCESS,
  PROFILE,
  SET_LAYOUT_MODE,
} from '../constants/action_types'


let location = {}
const oldDate = new Date()
oldDate.setFullYear(oldDate.getFullYear() - 2)

const AUTHENTICATION_WHITELIST = [
  /^\/enter\b/,
  /^\/forgot-password\b/,
  /^\/join\b/,
  /^\/signup\b/,
]

const ONBOARDING_WHITELIST = [
  /^\/onboarding\b/,
]

const STREAMS_WHITELIST = [
  /^\/discover/,
  /^\/following$/,
  /^\/starred$/,
]

const NO_LAYOUT_TOOLS = [
  /^\/[\w\-]+\/post\/.+/,
  /^\/notifications\b/,
  /^\/settings\b/,
  /^\/onboarding\b/,
]

export const findLayoutMode = (modes) => {
  for (const mode of modes) {
    const regex = new RegExp(mode.regex)
    if (regex.test(location.pathname)) {
      return mode
    }
  }
  return null
}

const getIsGridMode = (modes) => {
  const mode = findLayoutMode(modes)
  if (!mode) { return null }
  return mode.mode === 'grid'
}

const initialSizeState = {
  columnCount: 2,
  columnWidth: 0,
  contentWidth: 0,
  coverDPI: 'xhdpi',
  coverOffset: 0,
  deviceSize: 'tablet',
  innerHeight: 0,
  innerWidth: 0,
}

const initialScrollState = {
  isCoverHidden: false,
  isNavbarFixed: false,
  isNavbarHidden: false,
  isNavbarSkippingTransition: false,
}

export const initialState = {
  ...initialSizeState,
  ...initialScrollState,
  activeNotificationsType: 'all',
  activeUserFollowingType: 'friend',
  currentStream: '/discover',
  discoverKeyType: null,
  history: {},
  isAuthenticationView: false,
  isGridMode: true,
  isLayoutToolHidden: false,
  isNotificationsUnread: false,
  isOffsetLayout: false,
  isOnboardingView: false,
  lastDiscoverBeaconVersion: '0',
  lastFollowingBeaconVersion: '0',
  lastNotificationCheck: oldDate.toUTCString(),
  lastStarredBeaconVersion: '0',
  // order matters for matching routes
  modes: [
    { label: 'root', mode: 'grid', regex: '^/$' },
    { label: 'discover', mode: 'grid', regex: '/discover|/explore' },
    { label: 'following', mode: 'grid', regex: '/following' },
    { label: 'invitations', mode: 'list', regex: '/invitations' },
    { label: 'onboarding', mode: 'grid', regex: '/onboarding' },
    { label: 'notifications', mode: 'list', regex: '/notifications' },
    { label: 'search', mode: 'grid', regex: '/search|/find' },
    { label: 'settings', mode: 'list', regex: '/settings' },
    { label: 'starred', mode: 'list', regex: '/starred' },
    { label: 'staff', mode: 'list', regex: '/staff' },
    { label: 'posts', mode: 'list', regex: '/[\\w\\-]+/post/.+' },
    { label: 'users/following', mode: 'grid', regex: '/[\\w\\-]+/following' },
    { label: 'users/followers', mode: 'grid', regex: '/[\\w\\-]+/followers' },
    { label: 'users/loves', mode: 'grid', regex: '/[\\w\\-]+/loves' },
    { label: 'users', mode: 'grid', regex: '/[\\w\\-]+' },
  ],
}

export const gui = (state = initialState, action = { type: '' }) => {
  const newState = { ...state }
  let mode = null
  let pathname = null
  let isLayoutToolHidden = null
  let isAuthenticationView = null
  let isOnboardingView = null
  switch (action.type) {
    case AUTHENTICATION.LOGOUT:
      return { ...state, discoverKeyType: null }
    case GUI.BIND_DISCOVER_KEY:
      return { ...state, discoverKeyType: action.payload.type }
    case GUI.NOTIFICATIONS_TAB:
      return { ...state, activeNotificationsType: action.payload.activeTabType }
    case GUI.SET_ACTIVE_USER_FOLLOWING_TYPE:
      return { ...state, activeUserFollowingType: action.payload.tab }
    case GUI.SET_IS_OFFSET_LAYOUT:
      return { ...state, isOffsetLayout: action.payload.isOffsetLayout }
    case GUI.SET_LAST_DISCOVER_BEACON_VERSION:
      return { ...state, lastDiscoverBeaconVersion: action.payload.version }
    case GUI.SET_LAST_FOLLOWING_BEACON_VERSION:
      return { ...state, lastFollowingBeaconVersion: action.payload.version }
    case GUI.SET_LAST_STARRED_BEACON_VERSION:
      return { ...state, lastStarredBeaconVersion: action.payload.version }
    case GUI.SET_SCROLL:
      newState.history[action.payload.key] = { ...action.payload }
      return newState
    case GUI.SET_SCROLL_STATE:
      return {
        ...state,
        isCoverHidden: _.get(action.payload, 'isCoverHidden', state.isCoverHidden),
        isNavbarFixed: _.get(action.payload, 'isNavbarFixed', state.isNavbarFixed),
        isNavbarHidden: _.get(action.payload, 'isNavbarHidden', state.isNavbarHidden),
        isNavbarSkippingTransition:
          _.get(action.payload, 'isNavbarSkippingTransition', state.isNavbarSkippingTransition),
      }
    case GUI.SET_VIEWPORT_SIZE_ATTRIBUTES:
      return { ...state, ...action.payload }
    case HEAD_FAILURE:
      return { ...state, isNotificationsUnread: false }
    case HEAD_SUCCESS:
      if (action.payload.serverResponse.status === 204) {
        return { ...state, isNotificationsUnread: true }
      }
      return state
    case LOAD_STREAM_SUCCESS:
      if (action.meta && /\/notifications/.test(action.meta.resultKey)) {
        return {
          ...state,
          isNotificationsUnread: false,
          lastNotificationCheck: new Date().toUTCString(),
        }
      }
      return state
    case LOCATION_CHANGE:
      location = action.payload
      pathname = location.pathname
      isAuthenticationView = _.some(AUTHENTICATION_WHITELIST, pagex => pagex.test(pathname))
      isLayoutToolHidden = _.some(NO_LAYOUT_TOOLS, pagex => pagex.test(pathname))
      isOnboardingView = _.some(ONBOARDING_WHITELIST, pagex => pagex.test(pathname))
      if (_.some(STREAMS_WHITELIST, re => re.test(pathname))) {
        return {
          ...state,
          ...initialScrollState,
          currentStream: pathname,
          isAuthenticationView,
          isLayoutToolHidden,
          isGridMode: getIsGridMode(state.modes),
          isOnboardingView,
        }
      }
      return {
        ...state,
        ...initialScrollState,
        isAuthenticationView,
        isLayoutToolHidden,
        isGridMode: getIsGridMode(state.modes),
        isOnboardingView,
      }
    case PROFILE.DELETE_SUCCESS:
      return { ...initialState }
    case REHYDRATE:
      if (action.payload.gui) {
        return {
          ...state,
          ...action.payload.gui,
          isLayoutToolHidden: state.isLayoutToolHidden,
        }
      }
      return {
        ...state,
        isLayoutToolHidden: state.isLayoutToolHidden,
      }
    case SET_LAYOUT_MODE:
      mode = findLayoutMode(newState.modes)
      if (!mode) { return state }
      mode.mode = action.payload.mode
      return { ...state, isGridMode: action.payload.mode === 'grid' }
    default:
      return state
  }
}

// this is used for testing in StreamComponent_test
export const setLocation = (loc) => {
  location = loc
}

