import Immutable from 'immutable'
import { createSelector } from 'reselect'
import { selectPathname } from '../selectors/routing'

const allPageHeaders = state => state.json.get('pageHeaders', Immutable.Map())
const allPageHeadersAsArray = createSelector([allPageHeaders],
  pageHeaders => pageHeaders.valueSeq())

export const selectPageHeaderKind = createSelector([selectPathname], (pathname) => {
  if (pathname === '/') {
    return 'EDITORIAL'
  } else if (pathname === '/artist-invites') {
    return 'ARTIST_INVITE'
  } else if (pathname === '/discover/all') {
    return null
  } else if (pathname === '/discover') {
    return 'GENERIC'
  } else if (/\/discover\/(subscribed|featured|trending|recent).*/i.test(pathname)) {
    return 'GENERIC'
  } else if (/\/discover\/.*/i.test(pathname)) {
    return 'CATEGORY'
  } else if (/\/(enter|join|forgot-password|auth\/reset-my-password).*/i.test(pathname)) {
    return 'AUTHENTICATION'
  }
  return null
})

export const selectPageHeaderSlug = createSelector([selectPathname], (pathname) => {
  if (!/\/discover\/.*/i.test(pathname)) { return null }
  if (/\/discover\/(all|subscribed|featured|trending|recent).*/i.test(pathname)) { return null }
  return /\/discover\/([a-z0-9\-_]*)(\/.*)?/i.exec(pathname)[1]
})

export const selectPageHeaders = createSelector(
  [allPageHeadersAsArray, selectPageHeaderSlug, selectPageHeaderKind],
  (pageHeaders, slug, kind) => (
    pageHeaders.filter(header =>
      (header.get('kind') === kind && (!slug || slug === header.get('slug'))))))

export const selectAuthPageHeaders = createSelector(
  [allPageHeadersAsArray], pageHeaders => (
    pageHeaders.filter(header =>
      (header.get('kind') === 'AUTHENTICATION'))))


export const selectRandomPageHeader = createSelector([selectPageHeaders], pageHeaders =>
  pageHeaders.get(Math.floor(Math.random() * pageHeaders.count())))

export const selectRandomAuthPageHeader = createSelector([selectAuthPageHeaders], pageHeaders =>
  pageHeaders.get(Math.floor(Math.random() * pageHeaders.count())))
