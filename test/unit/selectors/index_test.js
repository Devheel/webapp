import { get } from 'lodash'
import { stubJSONStore } from '../../support/stubs'
import {
  selectCategoryPageTitle,
  selectCategories,
  selectPagination,
  selectParamsToken,
  selectParamsType,
  selectParamsUsername,
  selectPost,
  selectHasSaidHelloTo,
  selectUser,
  sortCategories,
} from '../../../src/selectors'

describe('selectors', () => {
  let json
  let params
  let location
  beforeEach(() => {
    json = stubJSONStore()
    params = { token: 'paramsToken', type: 'paramsType' }
    location = { pathname: '/discover' }
  })

  afterEach(() => {
    json = {}
    params = {}
    location = {}
  })

  context('#selectParamsToken', () => {
    it('returns the params token as lower case', () => {
      const state = { json }
      const props = { params, location }
      expect(selectParamsToken(state, props)).to.equal('paramstoken')
    })
  })

  context('#selectParamsType', () => {
    it('returns the params type', () => {
      const state = { json }
      const props = { params, location }
      expect(selectParamsType(state, props)).to.equal('paramsType')
    })
  })

  context('#selectParamsUsername', () => {
    const state = { json }
    const props = { params, location }

    it('returns the params username as undefined', () => {
      expect(selectParamsUsername(state, props)).to.be.undefined
    })

    it('returns the correct params username', () => {
      const nextProps = { params: { ...params, username: 'username' }, location }
      expect(selectParamsUsername(state, nextProps)).to.equal('username')
    })
  })

  context('#selectPost', () => {
    it('returns the post object with memoization', () => {
      const state = { json }
      const thisParams = { token: 'token1', type: 'paramsType' }
      const props = { params: thisParams, location }
      const testPost = get(json, 'posts.1')
      expect(selectPost(state, props)).to.deep.equal(testPost)
      const nextState = { ...state, blah: 1 }
      expect(selectPost(nextState, props)).to.deep.equal(testPost)
      expect(selectPost.recomputations()).to.equal(1)
    })
  })

  context('#selectUser', () => {
    it('returns the user object with memoization', () => {
      const state = { json }
      const props = { params: { ...params, username: 'archer' }, location }
      const testUser = get(json, 'users.1')
      expect(selectUser(state, props)).to.deep.equal(testUser)
      const nextState = { ...state, blah: 1 }
      expect(selectUser(nextState, props)).to.deep.equal(testUser)
    })
  })

  context('#selectPagination', () => {
    it('returns the pagination object related to the /discover page with memoization', () => {
      const state = { json, routing: { location: { pathname: '/discover' } } }
      const props = { params }
      expect(selectPagination(state, props)).to.deep.equal(json.pages['/discover'].pagination)
      const nextState = { ...state, blah: 1 }
      expect(selectPagination(nextState, props)).to.deep.equal(json.pages['/discover'].pagination)
      expect(selectPagination.recomputations()).to.equal(1)
    })
  })

  context('#selectCategoryPageTitle', () => {
    it('returns the page title related to the /discover page with memoization', () => {
      const state = { json }
      const props = { params: { token: 'paramsToken', type: 'arktip-x-ello' }, location }
      expect(selectCategoryPageTitle(state, props)).to.equal('Arktip x Ello')
      const nextProps = { ...props, blah: 1 }
      expect(selectCategoryPageTitle(state, nextProps)).to.equal('Arktip x Ello')
      expect(selectPagination.recomputations()).to.equal(1)
      const nextNextProps = { ...nextProps, params: { token: 'paramsToken', type: 'all' } }
      expect(selectCategoryPageTitle(state, nextNextProps)).to.be.null
      const lastProps = { ...nextNextProps, params: { token: 'paramsToken', type: 'recommended' } }
      expect(selectCategoryPageTitle(state, lastProps)).to.equal('Featured')
    })
  })

  context('#selectCategories', () => {
    it('returns the category object with memoization', () => {
      const state = { json }
      const props = { params, location }
      const categories = json.categories
      const keys = Object.keys(categories)
      let primary = []
      let secondary = []
      let tertiary = []
      keys.forEach((key) => {
        const category = categories[key]
        switch (category.level) {
          case 'primary':
            primary.push(category)
            break
          case 'secondary':
            secondary.push(category)
            break
          case 'tertiary':
            tertiary.push(category)
            break
          default:
            break
        }
      })
      primary = primary.sort(sortCategories)
      secondary = secondary.sort(sortCategories)
      tertiary = tertiary.sort(sortCategories)
      const selected = selectCategories(state, props)
      const compare = { primary, secondary, tertiary }
      expect(selected).to.deep.equal(compare)
    })
  })

  context('#selectHasSaidHelloTo', () => {
    it('returns the gui.saidHelloTo', () => {
      const state = { json, gui: { saidHelloTo: ['archer', 'lana'] } }
      const props = { params: { ...params, username: 'archer' }, location }
      expect(selectHasSaidHelloTo(state, props)).to.be.true
    })
  })
})

