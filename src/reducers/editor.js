import {
  AUTHENTICATION,
  EDITOR,
  EMOJI,
  POST,
  PROFILE,
} from '../constants/action_types'
import { suggestEmoji } from '../components/completers/EmojiSuggester'

const initialState = {
  completions: {},
  editors: {},
}

function imageBlockObject(state = {}, action) {
  switch (action.type) {
    case POST.TMP_IMAGE_CREATED:
    case POST.IMAGE_BLOCK_CREATED:
      return {
        ...state,
        type: action.type,
        ...action.payload,
      }
    case POST.POST_PREVIEW_SUCCESS:
    case POST.SAVE_IMAGE_SUCCESS:
      return {
        ...state,
        type: action.type,
        ...action.payload.response,
      }
    default:
      return state
  }
}

function editorObject(state = { loadedContent: {} }, action) {
  const newState = { ...state }
  let obj = null
  let index = null
  switch (action.type) {
    case EDITOR.APPEND_TEXT:
      return {
        ...state,
        type: action.type,
        appendText: action.payload.text,
      }
    case EDITOR.CLEAR_APPENDED_TEXT:
      return {
        ...state,
        type: action.type,
        appendText: null,
      }
    case POST.TMP_IMAGE_CREATED:
    case POST.IMAGE_BLOCK_CREATED:
    case POST.POST_PREVIEW_SUCCESS:
    case POST.SAVE_IMAGE_SUCCESS:
      index = action.payload ? action.payload.index : null
      if (typeof index !== 'undefined') {
        if (!newState.loadedContent) { newState.loadedContent = {} }
        newState.loadedContent[index] = imageBlockObject(newState.loadedContent[index], action)
        newState.index = index
        newState.type = action.type
        return newState
      }
      return state
    case POST.PERSIST:
      obj = {
        ...state,
        type: action.type,
      }
      if (action.payload) {
        obj.editorState = action.payload
      }
      return obj
    case POST.CREATE_SUCCESS:
      return {}
    default:
      return state
  }
}

export function editor(state = initialState, action) {
  const newState = { ...state }
  let editorId = null
  let obj = null
  switch (action.type) {
    case EDITOR.APPEND_TEXT:
    case EDITOR.CLEAR_APPENDED_TEXT:
    case POST.CREATE_SUCCESS:
    case POST.IMAGE_BLOCK_CREATED:
    case POST.PERSIST:
    case POST.POST_PREVIEW_SUCCESS:
    case POST.SAVE_IMAGE_SUCCESS:
    case POST.TMP_IMAGE_CREATED:
      editorId = action.payload ? action.payload.editorId : null
      if (editorId) {
        newState.editors[editorId] = editorObject(newState.editors[editorId], action)
        return newState
      }
      return state
    case POST.AUTO_COMPLETE_CLEAR:
      obj = {
        ...state,
        type: action.type,
      }
      delete obj.completions
      return obj
    case EMOJI.LOAD_SUCCESS:
    case POST.AUTO_COMPLETE_SUCCESS:
      obj = {
        ...state,
        type: action.type,
      }
      if (action.payload && action.payload.response) {
        const { type = 'user', word } = action.payload
        if (type === 'user') {
          obj.completions = { data: action.payload.response.autocompleteResults, type }
        } else if (type === 'emoji') {
          obj.completions = { data: suggestEmoji(word, action.payload.response.emojis), type }
        }
      }
      return obj
    case AUTHENTICATION.LOGOUT:
    case PROFILE.DELETE_SUCCESS:
      return { ...initialState }
    default:
      return state
  }
}

