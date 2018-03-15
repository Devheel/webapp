import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import Avatar from '../assets/Avatar'
import { ChevronCircleIcon, ShareIcon } from '../assets/Icons'
import { AppleStore, GooglePlayStore } from '../assets/Sprites'
import { css, hover, media, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'
import * as ENV from '../../../env'

// -------------------------------------

const storesStyle = css(
  s.absolute, s.zIndex2, { bottom: 12, left: 10 }, s.displayNone,
  media(s.minBreak2, { left: 20 }, s.block),
  media(s.minBreak4, { left: 40 }),
)

export const HeroAppStores = () =>
  (<div className={storesStyle}>
    <AppleStore />
    <GooglePlayStore />
  </div>)

// -------------------------------------

const creditsStyle = css(
  s.absolute,
  { right: 10, bottom: 10 },
  s.zIndex1,
  s.fontSize14,
  s.colorWhite,
  { transition: 'color 0.2s ease, opacity 0.2s ease' },
  hover(s.colorC),
  parent('.isCreditsHidden', s.pointerNone, s.opacity0),
  parent('.ArtistInvites', { right: 20 }),
  parent('.AuthenticationFormDialog.inModal', { right: 20 }),
  media(s.minBreak2,
    { right: 20, bottom: 20 },
    parent('.HeroHeader', { right: 40 }),
    parent('.AuthenticationFormDialog.inModal', { right: 30 }),
  ),
  media(s.minBreak4, { right: 40 }, parent('.HeroHeader', { right: 60 })),
  media(s.maxBreak2,
    s.flex,
    s.justifyEnd,
    s.itemsCenter,
    s.fullWidth,
    s.pl10,
    {
      whiteSpace: 'nowrap',
      maxWidth: '100%',
    },
    select('& .inHeroPromotionCredits', { flex: 'none' }),
  ),
)

const creditsAuthorStyle = css(
  s.inlineBlock,
  s.ml10,
  { marginRight: 15, lineHeight: 1.2, borderBottom: '1px solid' },
  media(s.maxBreak2,
    parent('.HeroPromotionCredits',
      s.relative,
      s.inlineBlock,
      s.truncate,
      { maxWidth: 'calc(100% - 60px)' },
    ),
    select('&.with-label',
      parent('.HeroPromotionCredits',
        { maxWidth: 'calc(100% - 136px)' },
      ),
    ),
  ),
)

const creditsByStyle = media(s.maxBreak2,
  parent('.HeroPromotionCredits', s.inlineBlock),
)

export const HeroPromotionCredits = ({ label, sources, username, trackingLabel }, context) => {
  const { onClickTrackCredits } = context
  const track = () => onClickTrackCredits(trackingLabel)
  return (
    <Link className={`HeroPromotionCredits ${creditsStyle}`} onClick={track} to={`/${username}`}>
      {label && <span className={creditsByStyle}>{label}</span>}
      <span className={`${creditsAuthorStyle}${label ? ' with-label' : ''}`}>@{username}</span>
      <Avatar className="inHeroPromotionCredits" sources={sources} username={username} />
    </Link>
  )
}

HeroPromotionCredits.contextTypes = {
  onClickTrackCredits: PropTypes.func.isRequired,
}

HeroPromotionCredits.propTypes = {
  label: PropTypes.string,
  sources: PropTypes.object,
  username: PropTypes.string,
  trackingLabel: PropTypes.string,
}

// -------------------------------------

const ctaStyle = css(
  s.mt20,
  { lineHeight: 1.3 },
  media(s.maxBreak2, parent('.HeroPromotionMobileActions >',
    s.inlineBlock,
    s.mt0,
    s.alignMiddle,
    { width: '40%', paddingRight: 5, border: 0 },
  )),
)

const ctaTextStyle = css({ borderBottom: '1px solid' })

export const HeroPromotionCTA = ({ caption, isLoggedIn, to, trackingLabel }, context) => {
  const { onClickTrackCTA } = context
  const track = () => onClickTrackCTA(trackingLabel)
  if (caption && to) {
    const re = new RegExp(ENV.AUTH_DOMAIN.replace('https://', ''))
    if (re.test(to)) {
      return (
        <Link className={ctaStyle} onClick={track} to={to}>
          <span className={ctaTextStyle}>{caption}</span>
        </Link>
      )
    }
    return (
      <a className={ctaStyle} href={to} onClick={track} rel="noopener noreferrer" target="_blank">
        <span className={ctaTextStyle}>{caption}</span>
      </a>
    )
  }
  return <span className={ctaStyle} />
}

HeroPromotionCTA.contextTypes = {
  onClickTrackCTA: PropTypes.func.isRequired,
}

HeroPromotionCTA.propTypes = {
  caption: PropTypes.string,
  isLoggedIn: PropTypes.bool,
  to: PropTypes.string,
  trackingLabel: PropTypes.string,
}

// -------------------------------------

const scrollToContentButton = css(
  s.absolute,
  { bottom: 60, left: 'calc(50% - 20px)', borderRadius: 20 },
  s.wv40,
  s.hv40,
  s.bgcBlack,
  media(s.maxBreak2, s.displayNone),
)

export const HeroScrollToContentButton = (props, { onClickScrollToContent }) =>
  (<button className={`HeroScrollToContentButton ${scrollToContentButton}`} onClick={onClickScrollToContent}>
    <ChevronCircleIcon />
  </button>)

HeroScrollToContentButton.contextTypes = {
  onClickScrollToContent: PropTypes.func.isRequired,
}

// -------------------------------------

const shareButtonStyle = css(
  s.absolute,
  { top: 20, right: 20, borderRadius: 20 },
  s.displayNone,
  s.wv40,
  s.hv40,
  s.bgcBlack,
  media(s.minBreak2, s.block),
)

export const HeroShareUserButton = (props, { onClickShareProfile }) =>
  (<button className={`HeroShareUserButton ${shareButtonStyle}`} onClick={onClickShareProfile} >
    <ShareIcon />
  </button>)

HeroShareUserButton.contextTypes = {
  onClickShareProfile: PropTypes.func.isRequired,
}

