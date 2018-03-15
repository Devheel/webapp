import {
  selectCategory,
  selectCategoryName,
  selectCategoryPageTitle,
  selectCategorySlug,
  selectCategoryTileImageUrl,
  selectCreatorTypeCategories,
  selectOnboardingCategoriesFiltered,
  selectPropsCategoryId,
} from '../../../src/selectors/categories'
import { clearJSON, json, stubJSONStore } from '../../support/stubs'

describe('categories selectors', () => {
  let location
  let state
  beforeEach(() => {
    stubJSONStore()
    location = { pathname: '/discover' }
    state = { json }
  })

  afterEach(() => {
    clearJSON()
    location = {}
  })

  context('#selectPropsCategoryId', () => {
    it('returns the correct props category id from a categoryId', () => {
      const props = { categoryId: '666' }
      expect(selectPropsCategoryId(state, props)).to.equal('666')
    })
  })

  context('#selectCategory', () => {
    it('returns a post from a postId', () => {
      state = { json }
      const props = { categoryId: '1' }
      const category = selectCategory(state, props)
      expect(category).to.deep.equal(state.json.get('categories').first())
    })
  })

  context('#selectCategoryName', () => {
    it('returns category name', () => {
      state = { json }
      const props = { categoryId: '1' }
      const categoryName = selectCategoryName(state, props)
      expect(categoryName).to.equal('Featured')
    })
  })

  context('#selectCategorySlug', () => {
    it('returns category slug', () => {
      state = { json }
      const props = { categoryId: '1' }
      const categorySlug = selectCategorySlug(state, props)
      expect(categorySlug).to.equal('featured')
    })
  })

  context('#selectCategoryTileImageUrl', () => {
    it('returns category slug', () => {
      state = { json }
      const props = { categoryId: '1' }
      const categoryTileImageUrl = selectCategoryTileImageUrl(state, props)
      expect(categoryTileImageUrl).to.equal('/tile_image/1/large.png')
    })
  })

  context('#selectOnboardingCategoriesFiltered', () => {
    it('the allowInOnboarding categories as a concatenated array', () => {
      expect(selectOnboardingCategoriesFiltered(state).map(c => c.get('id'))).to.contain(4, 5)
      expect(selectOnboardingCategoriesFiltered(state).map(c => c.get('id'))).not.to.contain(6, 7)
    })
  })

  context('#selectCreatorTypeCategories', () => {
    it('the allowInOnboarding categories as a concatenated array', () => {
      expect(selectCreatorTypeCategories(state).map(c => c.get('id'))).to.contain(6, 7)
      expect(selectCreatorTypeCategories(state).map(c => c.get('id'))).not.to.contain(4, 5)
    })
  })

  context('#selectCategoryPageTitle', () => {
    it('returns the page title related to the /discover page with memoization', () => {
      const props = { params: { token: 'paramsToken', type: 'arktip-x-ello' }, location }
      expect(selectCategoryPageTitle(state, props)).to.equal('Arktip x Ello')
      const nextProps = { ...props, blah: 1 }
      expect(selectCategoryPageTitle(state, nextProps)).to.equal('Arktip x Ello')
      expect(selectCategoryPageTitle.recomputations()).to.equal(1)
      const nextNextProps = { ...nextProps, params: { token: 'paramsToken', type: 'all' } }
      expect(selectCategoryPageTitle(state, nextNextProps)).to.be.null
      const lastProps = { ...nextNextProps, params: { token: 'paramsToken', type: 'recommended' } }
      expect(selectCategoryPageTitle(state, lastProps)).to.equal('Featured')
    })
  })

  context('#selectDiscoverMetaData', () => {
    it('should be tested')
  })
})

