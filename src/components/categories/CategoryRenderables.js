import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import classNames from 'classnames'
import {
  CheckCircleIcon,
} from '../assets/Icons'
import { RoundedRectLink } from '../buttons/Buttons'
import { before, css, hover, media, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const categoryCheckStyle = css(
  s.absolute,
  s.inlineBlock,
  {
    marginLeft: -44,
    marginTop: -6,
    width: 40,
    transform: 'scale(1.6)',
  },
  select('& .svg-stroke-bevel', s.strokeGreen),
  select('& circle', s.strokeGreen),

  media(s.maxBreak2,
    {
      marginLeft: -28,
      marginTop: -2,
      width: 28,
      transform: 'none',
    },
  ),
  media('(max-width: 26.25em)', // 420 / 16 = 26.25em
    {
      marginLeft: -25,
      marginTop: -2,
      width: 26,
      transform: 'scale(0.86)',
    },
  ),
)

export function CategorySubscribedIcon({ isSubscribed }) {
  if (!isSubscribed) { return null }
  return (
    <span className={`category-check ${categoryCheckStyle}`}>
      <CheckCircleIcon />
    </span>
  )
}
CategorySubscribedIcon.propTypes = {
  isSubscribed: PropTypes.bool.isRequired,
}

const categorySubscribeButtonStyle = css(
  s.bgcGreen,
  s.colorWhite,
  {
    padding: '5px 15px 5px 6px',
    borderRadius: 100,
    transition: `background-color 0.2s ${s.ease}`,
  },
  hover({ backgroundColor: '#16a905' }),
  select('&.subscribed',
    s.bgcA,
    hover(s.bgcBlack),
  ),
  select('& .text',
    s.fontSize12,
    s.inlineBlock,
    s.pl10,
    { paddingTop: 4 },
  ),
  select('& .CheckCircleIcon', s.inlineBlock, { marginTop: -2 }),
)

export function CategorySubscribeButton({ isSubscribed, subscribe, unsubscribe }) {
  return (
    <button
      className={`${categorySubscribeButtonStyle} subscribe-button${isSubscribed ? ' subscribed' : ''}`}
      onClick={!isSubscribed ? subscribe : unsubscribe}
    >
      <CheckCircleIcon />
      <span className="text">
        {!isSubscribed ? 'Subscribe' : 'Subscribed'}
      </span>
    </button>
  )
}
CategorySubscribeButton.propTypes = {
  isSubscribed: PropTypes.bool.isRequired,
  subscribe: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
}

const categorySubNavStyle = css(
  s.relative,
  s.fullWidth,
  s.pt20,
  s.pb0,
  s.center,
  s.resetList,

  media(s.minBreak2,
    s.pt40,
    s.pb20,
  ),

  select('& li',
    s.inlineBlock,
    {
      marginRight: 15,
      marginLeft: 15,
    },
    select('& a',
      s.fontSize16,
      s.colorA,
      {
        border: 'none',
      },

      media(s.minBreak2,
        s.fontSize18,
      ),
    ),

    select('&.selected',
      select('& a',
        s.colorBlack,
        s.borderBottom,
        { borderBottomWidth: 2 },
      ),
    ),
  ),

  // style mobile-specific version
  media(s.maxBreak2,
    s.pr10,
    s.pl10,

    select('& li',
      s.relative,
      s.inlineBlock,
      s.m0,
      s.center,
      s.borderBottom,
      {
        width: '50%',
        borderColor: '#aaa',
      },
      select('& a',
        { borderWidth: '0' },
      ),
      select('&.selected',
        { borderColor: '#000' },
        select('& a',
          { borderWidth: '0' },
        ),
      ),
    ),
    select('&.global li',
      { width: '33.3333333%' },
    ),
  ),
)

export function CategorySubNav({ stream, kind }) {
  if (stream === 'global') {
    return (
      <ul className={`category-sub-nav global ${categorySubNavStyle}`}>
        <li className={classNames({ selected: kind === 'featured' })}>
          <Link to="/discover">
            Featured
          </Link>
        </li>
        <li className={classNames({ selected: kind === 'trending' })}>
          <Link to="/discover/trending">
            Trending
          </Link>
        </li>
        <li className={classNames({ selected: kind === 'recent' })}>
          <Link to="/discover/recent">
            Recent
          </Link>
        </li>
      </ul>
    )
  }
  return (
    <ul className={`category-sub-nav ${categorySubNavStyle}`}>
      <li className={classNames({ selected: kind === 'featured' })}>
        <Link to={`/discover/${stream}`}>
          Featured
        </Link>
      </li>
      <li className={classNames({ selected: kind === 'trending' })}>
        <Link to={`/discover/${stream}/trending`}>
          Trending
        </Link>
      </li>
    </ul>
  )
}
CategorySubNav.propTypes = {
  stream: PropTypes.string.isRequired,
  kind: PropTypes.string.isRequired,
}

const categoryCardLinkStyle = css(
  s.absolute,
  s.flex,
  s.itemsCenter,
  s.fullWidth,
  s.fullHeight,
  s.bgcBlack,
  { backgroundSize: 'cover' },
  before(
    s.absolute,
    s.flood,
    s.zIndex2,
    s.transitionBgColor,
    { content: '""', backgroundColor: 'rgba(0, 0, 0, 0.7)' },
  ),
  hover(before({ backgroundColor: 'rgba(0, 0, 0, 0.3)' })),

  media('(max-width: 26.25em)', // 420 / 16 = 26.25em
    s.block,
  ),
)

const CategoryCardLink = ({ children, imageUrl, to }) => (
  <Link
    className={categoryCardLinkStyle}
    to={to}
    style={imageUrl ? { backgroundImage: `url("${imageUrl}")` } : null}
  >
    {children}
  </Link>
)
CategoryCardLink.propTypes = {
  children: PropTypes.node.isRequired,
  imageUrl: PropTypes.string,
  to: PropTypes.string.isRequired,
}

CategoryCardLink.defaultProps = {
  imageUrl: null,
}

const categoryCardTitleStyle = css(
  s.relative,
  s.block,
  s.mAuto,
  s.colorWhite,
  s.fontSize32,
  s.center,
  s.zIndex3,
  { width: 'calc(100% - 100px)' },

  media(s.maxBreak2,
    s.fontSize18,
  ),
  media('(max-width: 26.25em)', // 420 / 16 = 26.25em
    s.fontSize16,
    { width: 'calc(100% - 50px)' },
  ),

  select('& .category-check',
    { marginTop: -6 },
    media(s.maxBreak2,
      { marginTop: -2 },
    ),
  ),
)

const CategoryCardTitle = ({ name, isSubscribed }) => (
  <span className={`${categoryCardTitleStyle} title-holder`}>
    <CategorySubscribedIcon isSubscribed={isSubscribed} />
    <span className="text">{name}</span>
  </span>
)
CategoryCardTitle.propTypes = {
  name: PropTypes.string.isRequired,
  isSubscribed: PropTypes.bool,
}
CategoryCardTitle.defaultProps = {
  isSubscribed: false,
}

// Card for /discover/all
const categoryCardStyle = css(
  s.relative,
  s.block,
  {
    margin: '0 20px 40px 20px',
    width: 'calc(25% - 40px)',
    paddingBottom: 'calc(25% - 40px)',
  },

  media(s.maxBreak4,
    {
      margin: '0 10px 20px 10px',
      width: 'calc(33.3333333% - 20px)',
      paddingBottom: 'calc(33.3333333% - 20px)',
    },
  ),
  media(s.maxBreak3,
    {
      width: 'calc(50% - 20px)',
      paddingBottom: 'calc(50% - 20px)',
    },
  ),
  media(s.maxBreak2,
    {
      margin: '0 5px 10px 5px',
      width: 'calc(50% - 10px)',
      paddingBottom: 'calc(50% - 10px)',
    },
  ),

  media(s.minBreak5,
    {
      width: 'calc(20% - 40px)',
      paddingBottom: 'calc(20% - 40px)',
    },
  ),
  media(s.minBreak6,
    {
      width: 'calc(16.666666667% - 40px)',
      paddingBottom: 'calc(16.666666667% - 40px)',
    },
  ),
  media(s.minBreak7,
    {
      width: 'calc(14.28571429% - 40px)',
      paddingBottom: 'calc(14.28571429% - 40px)',
    },
  ),

  select('& .button-holder',
    s.absolute,
    s.flex,
    s.justifyCenter,
    s.fullWidth,
    s.zIndex3,
    { bottom: 40 },

    media(s.maxBreak2,
      { bottom: 20 },
    ),
  ),
  select('& .title-holder',
    media('(max-width: 26.25em)', // 420 / 16 = 26.25em
      // s.absolute,
      { top: 20 },
    ),
  ),
)

export const CategoryCard = ({ name, imageUrl, to, isSubscribed, subscribe, unsubscribe }) => (
  <li className={categoryCardStyle}>
    <CategoryCardLink imageUrl={imageUrl} to={to}>
      <CategoryCardTitle
        className="title-holder"
        name={name}
        isSubscribed={isSubscribed}
      />
      <span className="button-holder">
        <CategorySubscribeButton
          subscribe={subscribe}
          unsubscribe={unsubscribe}
          isSubscribed={isSubscribed}
        />
      </span>
    </CategoryCardLink>
  </li>
)
CategoryCard.propTypes = {
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  to: PropTypes.string.isRequired,
  isSubscribed: PropTypes.bool.isRequired,
  subscribe: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
}

CategoryCard.defaultProps = {
  imageUrl: null,
}

// footer for /discover/all style
const categoryAllFooterStyle = css(
  s.fixed,
  s.flex,
  s.fullWidth,
  s.itemsCenter,
  s.justifyCenter,
  s.bgcF2,
  s.zIndex4,
  {
    bottom: 0,
    left: 0,
    height: 50,
  },
  media(s.minBreak2,
    { height: 80 },
  ),
)

export const CategoryAllFooter = () => (
  <footer className={categoryAllFooterStyle}>
    <p>
      <RoundedRectLink
        to="/discover/subscribed"
        className=""
      >
        View Subscriptions
      </RoundedRectLink>
    </p>
  </footer>
)

