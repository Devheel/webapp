/* eslint-disable react/no-danger */
import React from 'react'
import PropTypes from 'prop-types'
import BackgroundImage from '../assets/BackgroundImage'
import {
  BadgeFeaturedIcon,
  CategorySubscribedIcon,
  CategorySubscribeButton,
} from '../categories/CategoryRenderables'
import {
  HeroAppStores,
  HeroPromotionCredits,
  HeroPromotionCTA,
  HeroScrollToContentButton,
  HeroShareUserButton,
} from './HeroParts'
import { ZeroStream } from '../zeros/Zeros'
import UserContainer from '../../containers/UserContainer'
import { css, media, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'

// -------------------------------------

const heroStyle = css(
  { paddingTop: 85 },
  s.bgcWhite,
  select('.isOnboardingView ~ &', { paddingTop: '0 !important' }),
  select('.isAuthenticationView ~ &', { paddingTop: '0 !important' }),
  select('.isDiscoverView ~ &', { paddingTop: '160px !important' }),
  media(s.maxBreak2,
    parent('.isLoggedOut', { paddingTop: 80 }),
    select('.isDiscoverView ~ &', { paddingTop: '150px !important' }),
    select('.isLogged .isDiscoverView ~ &', { paddingTop: '120px !important' }),
    select('.isProfileMenuActive ~ &', s.displayNone),
  ),
  media('(max-width: 23.375em)',
    select('.isDiscoverView ~ &', { paddingTop: '130px !important' }),
    select('.isLogged .isDiscoverView ~ &', { paddingTop: '100px !important' }),
  ),
  media(s.minBreak2,
    { paddingTop: 80 },
  ),
)

export const Hero = ({ children }) => (
  <div className={`Hero ${heroStyle}`}>
    {children}
  </div>
)
Hero.propTypes = {
  children: PropTypes.array.isRequired,
}

// -------------------------------------

export const HeroBroadcast = ({ broadcast, onDismiss }) =>
  <ZeroStream onDismiss={onDismiss}>{broadcast}</ZeroStream>

HeroBroadcast.propTypes = {
  broadcast: PropTypes.string.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

// -------------------------------------
const profileStyle = css(
  s.relative, s.flex, s.overflowHidden,
  media(s.minBreak2, { height: 'calc(100vh - 80px)', minHeight: 540 }),
)

export const HeroProfile = ({ dpi, sources, userId, useGif }) =>
  (<div className={profileStyle}>
    <BackgroundImage
      className="inHeroProfile hasOverlay6"
      dpi={dpi}
      sources={sources}
      useGif={useGif}
    />
    <UserContainer userId={userId} type="profile" />
    <HeroShareUserButton />
    <HeroScrollToContentButton />
  </div>)

HeroProfile.propTypes = {
  dpi: PropTypes.string.isRequired,
  sources: PropTypes.object,
  userId: PropTypes.string,
  useGif: PropTypes.bool.isRequired,
}
HeroProfile.defaultProps = {
  sources: null,
  userId: null,
}

// -------------------------------------

const promotionAuthStyle = css(s.fullscreen)

export const HeroPromotionAuth = (props) => {
  const { creditSources, creditUsername, dpi, sources } = props
  return (
    <div className={promotionAuthStyle}>
      <BackgroundImage className="hasOverlay4" dpi={dpi} sources={sources} />
      {creditUsername ?
        <HeroPromotionCredits sources={creditSources} username={creditUsername} /> : null
      }
      <HeroAppStores />
    </div>
  )
}

HeroPromotionAuth.propTypes = {
  creditSources: PropTypes.object,
  creditUsername: PropTypes.string,
  dpi: PropTypes.string.isRequired,
  sources: PropTypes.object,
}
HeroPromotionAuth.defaultProps = {
  creditSources: null,
  creditUsername: null,
  sources: null,
}

// -------------------------------------
const promotionStyle = css(
  s.relative,
  s.flex,
  s.itemsCenter,
  s.fullWidth,
  { minHeight: 240 },
  s.overflowHidden,
  s.colorWhite,
  media(s.minBreak2, { minHeight: 380 }),
)

const captionStyle = css(
  s.relative, s.py20, s.mx10, s.fontSize14,
  media(s.minBreak2, s.mx20),
  media(s.minBreak4, s.pr40, s.mx40),
)

const categoryCaptionStyle = css(
  s.relative,
  s.py20,
  s.fontSize14,
  s.mxAuto,
  { maxWidth: 500 },

  media(s.maxBreak2,
    s.px10,
    { minHeight: 200 },
  ),
  media(s.minBreak4,
    s.px0,
  ),
)

const categoryHeadingStyle = css(
  s.sansBlack,
  s.center,

  select('& .category-check',
    { marginTop: 2 },
    media(s.maxBreak2,
      { marginTop: -2 },
    ),
  ),

  select('& .text',
    s.inlineBlock,
    s.fontSize18,
    {
      lineHeight: 1,
      borderBottom: '2px solid',
    },

    media(s.minBreak2,
      s.fontSize32,
    ),
  ),
)

const mobileActionStyle = css(s.relative, s.fullWidth, s.px10, s.pb10, s.fontSize14, s.selfEnd)
const categoryCopyStyle = css(s.mt20)
const subscribeHolderStyle = css(
  s.flex,
  s.fullWidth,
  s.justifyCenter,
  s.mt30,
  media(s.maxBreak2,
    s.mt20,
  ),
)

const subscribeHolderMobileStyle = css(
  s.relative,
  s.fullWidth,

  select('& .subscribe-button',
    s.fullWidth,
    s.pt10,
    s.pb10,
    {
      borderRadius: 0,
    },
    select('& .CheckCircleIcon',
      s.displayNone,
    ),
    select('& .text',
      s.m0,
      s.fontSize14,
    ),
  ),
)

const promotionCategoryStyle = css(
  { ...promotionStyle },
  media(s.maxBreak2, s.flexColumn),
)

export const HeroPromotionCategory = (props) => {
  const { creditLabel, creditSources, creditUsername, creditTrackingLabel } = props
  const { description, dpi, name, sources, isPromo } = props
  const { ctaCaption, ctaHref, ctaTrackingLabel, isLoggedIn, isMobile, isSubscribed } = props
  const { subscribe, unsubscribe } = props

  // desktop version
  if (!isMobile) {
    return (
      <div className={promotionCategoryStyle}>
        <BackgroundImage className="hasOverlay4" dpi={dpi} sources={sources} />
        <div className={categoryCaptionStyle}>
          <h1 className={categoryHeadingStyle}>
            <CategorySubscribedIcon isSubscribed={isSubscribed} />
            <span className="text">{name}</span>
          </h1>
          <p className={categoryCopyStyle}>{description}</p>
          <span className={subscribeHolderStyle}>
            {isPromo &&
              <span className="featured-badge">
                <BadgeFeaturedIcon />
              </span>
            }
            <CategorySubscribeButton
              subscribe={subscribe}
              unsubscribe={unsubscribe}
              isSubscribed={isSubscribed}
            />
          </span>
          <HeroPromotionCTA
            caption={ctaCaption}
            isLoggedIn={isLoggedIn}
            to={ctaHref}
            label={ctaTrackingLabel}
          />
        </div>
        {creditUsername &&
          <HeroPromotionCredits
            label={creditLabel}
            sources={creditSources}
            username={creditUsername}
            trackingLabel={creditTrackingLabel}
          />
        }
      </div>
    )
  }

  // mobile version
  return (
    <div>
      <div className={promotionCategoryStyle}>
        <BackgroundImage className="hasOverlay4" dpi={dpi} sources={sources} />
        <div className={categoryCaptionStyle}>
          <h1 className={categoryHeadingStyle}>
            <CategorySubscribedIcon isSubscribed={isSubscribed} />
            <span className="text">{name}</span>
          </h1>
          <p className={categoryCopyStyle}>{description}</p>
        </div>
        <div className={`HeroPromotionMobileActions ${mobileActionStyle}`}>
          <HeroPromotionCTA
            caption={ctaCaption}
            isLoggedIn={isLoggedIn}
            to={ctaHref}
            label={ctaTrackingLabel}
          />
          {creditUsername &&
            <HeroPromotionCredits
              label={creditLabel}
              sources={creditSources}
              username={creditUsername}
              trackingLabel={creditTrackingLabel}
            />
          }
        </div>
      </div>
      <span className={subscribeHolderMobileStyle}>
        <CategorySubscribeButton
          subscribe={subscribe}
          unsubscribe={unsubscribe}
          isSubscribed={isSubscribed}
        />
      </span>
    </div>
  )
}

HeroPromotionCategory.propTypes = {
  creditLabel: PropTypes.string.isRequired,
  creditSources: PropTypes.object,
  creditUsername: PropTypes.string,
  creditTrackingLabel: PropTypes.string.isRequired,
  ctaCaption: PropTypes.string,
  ctaHref: PropTypes.string,
  ctaTrackingLabel: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  dpi: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  sources: PropTypes.object,
  subscribe: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
  isSubscribed: PropTypes.bool.isRequired,
  isPromo: PropTypes.bool.isRequired,
}
HeroPromotionCategory.defaultProps = {
  creditSources: null,
  creditUsername: null,
  ctaCaption: null,
  ctaHref: null,
  sources: null,
}

// -------------------------------------

const promotionHeadingStyle = css(s.fontSize18, media(s.minBreak2, s.fontSize48))
const promotionSubheadingStyle = css(s.fontSize14, media(s.minBreak2, s.fontSize28))

export const HeroPromotionPage = (props) => {
  const { creditSources, creditUsername, dpi, header, sources, subheader } = props
  const { ctaCaption, ctaHref, isLoggedIn } = props
  return (
    <div className={promotionStyle}>
      <BackgroundImage className="hasOverlay4" dpi={dpi} sources={sources} />
      <div className={captionStyle}>
        <h1 className={promotionHeadingStyle}>{header}</h1>
        <h2 className={promotionSubheadingStyle}>{subheader}</h2>
        <HeroPromotionCTA
          caption={ctaCaption}
          isLoggedIn={isLoggedIn}
          to={ctaHref}
          trackingLabel="general"
        />
      </div>
      {creditUsername &&
        <HeroPromotionCredits
          sources={creditSources}
          username={creditUsername}
          trackingLabel="general"
        />
      }
    </div>
  )
}

HeroPromotionPage.propTypes = {
  creditSources: PropTypes.object,
  creditUsername: PropTypes.string,
  ctaCaption: PropTypes.string,
  ctaHref: PropTypes.string,
  dpi: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  sources: PropTypes.object,
  subheader: PropTypes.string,
}
HeroPromotionPage.defaultProps = {
  creditSources: null,
  creditUsername: null,
  ctaCaption: null,
  ctaHref: null,
  sources: null,
  subheader: null,
}

const headerStyle = css(
  s.relative,
  s.px10,
  s.fullWidth,
  s.colorWhite,
  s.mxAuto,
  { marginTop: 0 },
  { height: 430, maxWidth: 1440 },
  parent('.Editorial', s.px0),
  media(
    s.minBreak2,
    s.px20,
    parent('.Editorial', s.px20),
    { marginTop: 0 },
  ),
  media(
    s.minBreak4,
    { height: 600 },
    s.px40,
    parent('.Editorial', s.px40, s.mb20),
    { marginTop: 0 },
  ),
)

const imageContainerStyle = css(
  s.flex,
  s.justifyCenter,
  s.itemsCenter,
  s.relative,
  { height: 430 },
  media(s.minBreak4, { height: 600 }),
)

const HeroHeaderCaptionStyle = css(
  s.absolute, s.pl20, s.pr20, { width: '100%', left: 0, top: 80 },
  media(s.minBreak2, { paddingLeft: 60, paddingRight: 60, top: 40 }),
  media(s.minBreak3, s.containedAlignMiddle, { paddingLeft: 80, paddingRight: 80, left: 0 }),
  media(s.minBreak4, { paddingLeft: 100, paddingRight: 100 }),
)

const HeroHeaderHeadingStyle = css(
  s.sansBlack, s.fontSize38, { lineHeight: 38 },
  media(s.minBreak2, { fontSize: 60, lineHeight: 60 }),
  media(s.minBreak3, { fontSize: 90, lineHeight: 90 }),
)

const HeroHeaderSubHeadingStyle = css(
  s.sansRegular,
  s.fontSize18,
  { lineHeight: 24, margin: 0 },
  media(s.minBreak2, s.fontSize24, { lineHeight: 30 }),
)

export const HeroHeader = ({
  dpi,
  headerText,
  subHeaderText,
  sources,
  avatarSources,
  username,
}) => (
  <div className={`HeroHeader ${headerStyle}`}>
    <div className={imageContainerStyle}>
      <BackgroundImage className="hasOverlay4" dpi={dpi} sources={sources} />
    </div>
    <div className={HeroHeaderCaptionStyle}>
      <h1 className={HeroHeaderHeadingStyle}>{headerText}</h1>
      <p
        className={HeroHeaderSubHeadingStyle}
        dangerouslySetInnerHTML={{ __html: subHeaderText }}
      />
    </div>
    <HeroPromotionCredits
      label="Posted by"
      sources={avatarSources}
      username={username}
    />
  </div>
)
HeroHeader.propTypes = {
  dpi: PropTypes.string.isRequired,
  sources: PropTypes.object.isRequired,
  avatarSources: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  headerText: PropTypes.string.isRequired,
  subHeaderText: PropTypes.string.isRequired,
}

