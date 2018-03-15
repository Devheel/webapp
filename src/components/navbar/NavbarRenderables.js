import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isElloAndroid } from '../../lib/jello'
import {
  BoltIcon,
  CircleIcon,
  GridIcon,
  ListIcon,
  SearchIcon,
  SparklesIcon,
} from '../assets/Icons'
import {
  NavbarLayoutTool,
  NavbarLink,
  NavbarMark,
  NavbarMorePostsButton,
  NavbarOmniButton,
  NavbarProfile,
} from './NavbarParts'
import { CategoryTabBar } from '../tabs/CategoryTabBar'
import NotificationsContainer from '../../containers/NotificationsContainer'
import { css, media, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const navbarStyle = css(
  s.fixed,
  { height: 80, top: 0, right: 0, left: 0 },
  s.zNavbar,
  s.p10,
  s.bgcWhite,
  { transition: 'transform 150ms ease, height 150ms ease, background-color 0s' },
  parent('.isOmnibarActive', s.overflowHidden, s.pointerNone, s.bgcTransparent, s.opacity0),
  select('.isOnboardingView ~ &', s.displayNone),
  select('.isNavbarHidden ~ &',
    s.bgcTransparent,
    {
      transitionDelay: '0s, 0s, 150ms',
      transform: 'translate3d(0, -100%, 0)',
    },
  ),
  media(s.minBreak2,
    s.p20,
    { borderBottom: '1px solid #f2f2f2' },
    select('.no-touch .isNavbarHidden ~ &:hover', s.bgcWhite, s.transformNone, { transitionDelay: '350ms' }),
    select('.no-touch .isNavbarHidden ~ .Discover + &:hover', { transitionDelay: '1.5s' }),
    select('.no-touch .isNavbarHidden ~ &::after',
      s.absolute,
      { right: 0, bottom: -15, left: 0, height: 15 },
      { content: '""', backgroundColor: 'rgba(0, 0, 0, 0)' },
    ),
  ),
  media(s.minBreak4, s.px40),
)

const mainStyle = css(
  s.maxSiteWidth,
  s.mxAuto,
  s.relative,
  { transition: 'opacity 0s' },
  parent('.isNavbarHidden ~ .Navbar', s.opacity0, { transitionDelay: '150ms' }),
  media(s.minBreak2,
    parent('.no-touch .isNavbarHidden ~ .Navbar:hover', s.opacity1, { transitionDelay: '0s' }),
    parent('.no-touch .isNavbarHidden ~ .Discover + .Navbar:hover', { transitionDelay: '1.5s' }),
  ),
)

const linksStyle = css(
  s.absolute,
  { top: 0, left: 0 },
  s.nowrap,
  media(s.minBreak2,
    parent('.isLoggedIn', { top: 'calc(50% + 5px)', right: 200, left: 'auto', marginTop: -20 }),
    parent('.isLoggedOut', { top: 'calc(50% + 5px)', right: 175, left: 'auto', marginTop: -20 }),
    parent('.isOmnibarActive .Navbar >', s.absolute, { transform: 'translate3d(400px, 0, 0)' }),
  ),
)

export const NavbarLoggedOut = ({
  categoryTabs,
  areCategoriesSubscribed,
  deviceSize,
  hasLoadMoreButton,
  onClickLoadMorePosts,
  onClickNavbarMark,
  pathname,
}, { onClickArtistInvites, onClickLogin, onClickSignup }) =>
  (<nav className={`Navbar ${navbarStyle}`} >
    <div className={`NavbarMain ${mainStyle}`}>
      <NavbarMark onClick={onClickNavbarMark} />
      {hasLoadMoreButton ? <NavbarMorePostsButton onClick={onClickLoadMorePosts} /> : null}
      <div className={`NavbarLinks ${linksStyle}`}>
        { deviceSize === 'mobile' &&
          <NavbarLink
            className="LabelOnly"
            label="Editorial"
            pathname={pathname}
            to="/"
          />
        }
        <NavbarLink
          className="LabelOnly"
          label="Artist Invites"
          onClick={onClickArtistInvites}
          pathname={pathname}
          to="/artist-invites"
        />
        <NavbarLink
          className="LabelOnly"
          icon={<SparklesIcon />}
          label="Discover"
          pathname={pathname}
          to="/discover"
        />
        <NavbarLink
          className="IconOnly"
          icon={<SearchIcon />}
          label="Search"
          pathname={pathname}
          to="/search"
        />
      </div>
      <NavbarLink
        className="LabelOnly isLogin"
        label="Login"
        onClick={onClickLogin}
        pathname={pathname}
        to="/enter"
      />
      <NavbarLink
        className="LabelOnly isSignUp"
        label="Sign Up"
        onClick={onClickSignup}
        pathname={pathname}
        to="/join"
      />
    </div>
    {categoryTabs &&
      <CategoryTabBar
        pathname={pathname}
        tabs={categoryTabs}
        areCategoriesSubscribed={areCategoriesSubscribed}
        subscribed={false}
        deviceSize={deviceSize}
      />
    }
  </nav>)

NavbarLoggedOut.propTypes = {
  categoryTabs: PropTypes.array,
  areCategoriesSubscribed: PropTypes.bool,
  deviceSize: PropTypes.string.isRequired,
  hasLoadMoreButton: PropTypes.bool.isRequired,
  onClickLoadMorePosts: PropTypes.func.isRequired,
  onClickNavbarMark: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
}
NavbarLoggedOut.defaultProps = {
  categoryTabs: null,
  areCategoriesSubscribed: false,
}
NavbarLoggedOut.contextTypes = {
  onClickArtistInvites: PropTypes.func.isRequired,
  onClickLogin: PropTypes.func.isRequired,
  onClickSignup: PropTypes.func.isRequired,
}

export const NavbarLoggedIn = ({
  artistInvitesInProfileMenu,
  avatar,
  categoryTabs,
  areCategoriesSubscribed,
  deviceSize,
  hasLoadMoreButton,
  isBrand,
  isGridMode,
  isLayoutToolHidden,
  isNotificationsActive,
  isNotificationsUnread,
  isProfileMenuActive,
  notificationCategory,
  onClickAvatar,
  onClickLoadMorePosts,
  onClickNavbarMark,
  onClickNotification,
  onClickOmniButton,
  onClickToggleLayoutMode,
  onDragLeaveStreamLink,
  onDragOverOmniButton,
  onDragOverStreamLink,
  onDropStreamLink,
  onLogOut,
  pathname,
  username,
}, { onClickArtistInvites }) =>
  (<nav className={`Navbar ${navbarStyle}`}>
    <div className={`NavbarMain ${mainStyle}`}>
      <NavbarMark onClick={onClickNavbarMark} />
      {hasLoadMoreButton ? <NavbarMorePostsButton onClick={onClickLoadMorePosts} /> : null}
      <div className={`NavbarLinks ${linksStyle}`}>
        { deviceSize === 'mobile' &&
          <NavbarLink
            className="LabelOnly"
            label="Editorial"
            pathname={pathname}
            to="/"
          />
        }
        { !artistInvitesInProfileMenu &&
          <NavbarLink
            className="LabelOnly"
            label="Artist Invites"
            onClick={onClickArtistInvites}
            pathname={pathname}
            to="/artist-invites"
          />
        }
        <NavbarLink
          className="LabelOnly"
          icon={<SparklesIcon />}
          label="Discover"
          pathname={pathname}
          to="/discover/subscribed"
        />
        <NavbarLink
          className="LabelOnly"
          icon={<CircleIcon />}
          label="Following"
          onDragLeave={onDragLeaveStreamLink}
          onDragOver={onDragOverStreamLink}
          onDrop={onDropStreamLink}
          pathname={pathname}
          to="/following"
        />
        <NavbarLink
          className={classNames('IconOnly', { isNotificationsUnread })}
          icon={<BoltIcon />}
          label="Notifications"
          onClick={isElloAndroid() || deviceSize === 'mobile' ? null : onClickNotification}
          pathname={pathname}
          to={`/notifications${notificationCategory}`}
        />
        <NavbarLink
          className="IconOnly"
          icon={<SearchIcon />}
          label="Search"
          pathname={pathname}
          to="/search"
        />
      </div>
      <NavbarProfile
        artistInvitesInProfileMenu={artistInvitesInProfileMenu}
        avatar={avatar}
        isBrand={isBrand}
        isProfileMenuActive={isProfileMenuActive}
        onClickAvatar={onClickAvatar}
        onLogOut={onLogOut}
        username={username}
      />
      {deviceSize === 'mobile' && !isLayoutToolHidden ?
        <NavbarLayoutTool
          icon={isGridMode ? <ListIcon /> : <GridIcon />}
          onClick={onClickToggleLayoutMode}
        /> : null
      }
      <NavbarOmniButton
        onClick={onClickOmniButton}
        onDragOver={onDragOverOmniButton}
      />
      {deviceSize !== 'mobile' && isNotificationsActive ?
        <NotificationsContainer isModal /> : null
      }
    </div>
    {categoryTabs &&
      <CategoryTabBar
        pathname={pathname}
        tabs={categoryTabs}
        areCategoriesSubscribed={areCategoriesSubscribed}
        subscribed
        deviceSize={deviceSize}
      />
    }
  </nav>)

NavbarLoggedIn.propTypes = {
  artistInvitesInProfileMenu: PropTypes.bool.isRequired,
  avatar: PropTypes.object,
  categoryTabs: PropTypes.array,
  areCategoriesSubscribed: PropTypes.bool,
  deviceSize: PropTypes.string.isRequired,
  hasLoadMoreButton: PropTypes.bool.isRequired,
  isBrand: PropTypes.bool.isRequired,
  isGridMode: PropTypes.bool,
  isLayoutToolHidden: PropTypes.bool.isRequired,
  isNotificationsActive: PropTypes.bool.isRequired,
  isNotificationsUnread: PropTypes.bool.isRequired,
  isProfileMenuActive: PropTypes.bool.isRequired,
  notificationCategory: PropTypes.string.isRequired,
  onClickAvatar: PropTypes.func.isRequired,
  onClickLoadMorePosts: PropTypes.func.isRequired,
  onClickNavbarMark: PropTypes.func.isRequired,
  onClickNotification: PropTypes.func.isRequired,
  onClickOmniButton: PropTypes.func.isRequired,
  onClickToggleLayoutMode: PropTypes.func.isRequired,
  onDragLeaveStreamLink: PropTypes.func.isRequired,
  onDragOverOmniButton: PropTypes.func.isRequired,
  onDragOverStreamLink: PropTypes.func.isRequired,
  onDropStreamLink: PropTypes.func.isRequired,
  onLogOut: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
  username: PropTypes.string,
}
NavbarLoggedIn.defaultProps = {
  avatar: null,
  categoryTabs: null,
  areCategoriesSubscribed: false,
  isGridMode: false,
  username: null,
}
NavbarLoggedIn.contextTypes = {
  onClickArtistInvites: PropTypes.func.isRequired,
}

