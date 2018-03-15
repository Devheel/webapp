import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { trackEvent } from '../actions/analytics'
import { openModal } from '../actions/modals'
import {
  selectUserId,
  selectUserPostsAdultContent,
  selectUserCoverImage,
  selectUserUsername,
} from '../selectors/user'
import { selectViewsAdultContent } from '../selectors/profile'
import { selectHeroDPI } from '../selectors/gui'
import { HeroProfile } from '../components/heros/HeroRenderables'
import ShareDialog from '../components/dialogs/ShareDialog'

function mapStateToProps(state, props) {
  const userId = selectUserId(state, props)
  const username = selectUserUsername(state, props)
  const dpi = selectHeroDPI(state)
  const coverImage = selectUserCoverImage(state, props)
  const useGif = selectViewsAdultContent(state) ||
    !selectUserPostsAdultContent(state, props) ||
    false
  return { userId, dpi, coverImage, useGif, username }
}

class HeroProfileContainer extends Component {
  static propTypes = {
    userId: PropTypes.string,
    username: PropTypes.string,
    dpi: PropTypes.string.isRequired,
    coverImage: PropTypes.object,
    useGif: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    userId: null,
    username: null,
    coverImage: null,
  }

  static childContextTypes = {
    onClickShareProfile: PropTypes.func,
  }

  getChildContext() {
    return {
      onClickShareProfile: this.onClickShareProfile,
    }
  }

  onClickShareProfile = () => {
    const { dispatch, username } = this.props
    const action = bindActionCreators(trackEvent, dispatch)
    dispatch(openModal(<ShareDialog username={username} trackEvent={action} />, '', null, 'open-share-dialog-profile'))
  }

  render() {
    const { userId, dpi, coverImage, useGif } = this.props
    if (!userId) { return null }
    return (
      <HeroProfile
        dpi={dpi}
        sources={coverImage}
        useGif={useGif}
        userId={userId}
      />
    )
  }
}

export default connect(mapStateToProps)(HeroProfileContainer)

