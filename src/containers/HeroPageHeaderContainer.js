import { Map } from 'immutable'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectUser } from '../selectors/user'
import {
  HeroPromotionCategory,
  HeroPromotionPage,
  HeroPromotionAuth,
} from '../components/heros/HeroRenderables'
import {
  selectHeroDPI,
  selectIsMobile,
} from '../selectors/gui'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectSubscribedCategoryIds } from '../selectors/profile'
import { selectCategoryIsPromo } from '../selectors/categories'
import { selectRandomPageHeader } from '../selectors/page_headers'
import { trackPostViews } from '../actions/posts'
import { followCategories } from '../actions/profile'

function mapStateToProps(state, props) {
  const pageHeader = selectRandomPageHeader(state)
  const user = pageHeader ? selectUser(state, { userId: pageHeader.get('userId') }) : Map()
  const dpi = selectHeroDPI(state)
  const isMobile = selectIsMobile(state)
  const isLoggedIn = selectIsLoggedIn(state)
  const categoryId = pageHeader ? pageHeader.get('categoryId') : null
  const subscribedIds = selectSubscribedCategoryIds(state, props)
  const isSubscribed = !!categoryId && !!isLoggedIn && subscribedIds.includes(categoryId)
  const isPromo = categoryId ? true : false
  console.log(`categoryId: ${categoryId}`)
  console.log(pageHeader)
  cosnole.log(selectCategory({categoryId: categoryId}))
  // console.log(`isPromo: ${pageHeader}`)
  return {
    pageHeader,
    user,
    dpi,
    isMobile,
    isLoggedIn,
    isSubscribed,
    isPromo,
    subscribedIds,
    categoryId,
  }
}

class HeroPageHeaderContainer extends Component {
  static propTypes = {
    pageHeader: PropTypes.object,
    user: PropTypes.object,
    dpi: PropTypes.string.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isSubscribed: PropTypes.bool.isRequired,
    isPromo: PropTypes.bool.isRequired,
    subscribedIds: PropTypes.object,
    categoryId: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    pageHeader: null,
    user: null,
    subscribedIds: null,
    categoryId: null,
  }

  static contextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func.isRequired,
  }

  componentDidUpdate() {
    const { dispatch, pageHeader } = this.props
    if (pageHeader && pageHeader.get('postToken')) {
      dispatch(trackPostViews([], [pageHeader.get('postToken')], 'promo'))
    }
  }

  subscribe = (e) => {
    const { isLoggedIn, categoryId, dispatch, subscribedIds } = this.props
    e.preventDefault()
    if (!isLoggedIn) {
      const { onClickOpenRegistrationRequestDialog } = this.context
      onClickOpenRegistrationRequestDialog('subscribe-from-page-header')
    } else {
      const catIds = subscribedIds.push(categoryId)
      dispatch(followCategories(catIds, true))
    }
  }

  unsubscribe = (e) => {
    const { categoryId, dispatch, subscribedIds } = this.props
    e.preventDefault()
    const catIds = subscribedIds.filter(id => id !== categoryId)
    dispatch(followCategories(catIds, true))
  }

  render() {
    const { pageHeader, user, dpi, isMobile, isLoggedIn, isSubscribed, isPromo } = this.props
    if (!pageHeader) { return null }
    switch (pageHeader.get('kind')) {
      case 'CATEGORY':
        return (
          <HeroPromotionCategory
            name={pageHeader.get('header', '')}
            description={pageHeader.get('subheader', '')}
            ctaCaption={pageHeader.getIn(['ctaLink', 'text'])}
            ctaHref={pageHeader.getIn(['ctaLink', 'url'])}
            ctaTrackingLabel={pageHeader.get('slug')}
            sources={pageHeader.get('image')}
            creditSources={user.get('avatar', null)}
            creditUsername={user.get('username', null)}
            creditLabel="Posted by"
            creditTrackingLabel={pageHeader.get('slug')}
            dpi={dpi}
            isMobile={isMobile}
            isLoggedIn={isLoggedIn}
            isSubscribed={isSubscribed}
            isPromo={isPromo}
            subscribe={this.subscribe}
            unsubscribe={this.unsubscribe}
          />
        )
      case 'GENERIC':
        return (
          <HeroPromotionPage
            header={pageHeader.get('header', '')}
            subheader={pageHeader.get('subheader', '')}
            ctaCaption={pageHeader.getIn(['ctaLink', 'text'])}
            ctaHref={pageHeader.getIn(['ctaLink', 'url'])}
            sources={pageHeader.get('image')}
            creditSources={user.get('avatar', null)}
            creditUsername={user.get('username', null)}
            dpi={dpi}
            isMobile={isMobile}
            isLoggedIn={isLoggedIn}
          />
        )
      case 'AUTHENTICATION':
        return (
          <HeroPromotionAuth
            dpi={dpi}
            sources={pageHeader.get('image')}
            creditSources={user.get('avatar', null)}
            creditUsername={user.get('username', null)}
          />
        )
      default:
        return null
    }
  }
}

export default connect(mapStateToProps)(HeroPageHeaderContainer)
