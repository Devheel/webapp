import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import {
  ArrowIcon,
  BrowseIcon,
  MoneyIconCircle,
  ReplyAllIcon,
  XIconLG,
} from '../assets/Icons'
import { openModal, closeModal } from '../../actions/modals'
import { updateBuyLink } from '../../actions/editor'
import BuyLinkDialog from '../dialogs/BuyLinkDialog'
import { css, disabled, hover, media, modifier, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const wrapperStyle = css(
  s.flex,
  s.justifySpaceBetween,
  s.hv40,
  s.lh40,
  s.mt10,
)

const leftStyle = css(
  select('& button', s.mr10),
  select('& button:last-child', s.mr0),
  select('& .forCancel', s.inlineBlock),
  select('.PostGrid & .forCancel', s.inlineBlock),
  media(s.minBreak2, select('& .forCancel', s.displayNone)),
)

const rightStyle = css(
  select('& button + button', s.ml10),
  select('& button:first-child', s.ml0),
  select('& .forCancel', s.displayNone),
  select('.PostGrid & .forCancel', s.displayNone),
  media(s.minBreak2, select('& .forCancel', s.inlineBlock)),
)

const buttonStyle = css(
  s.bgcBlack,
  s.colorWhite,
  s.hv40,
  s.lh40,
  s.nowrap,
  s.wv40,
  { borderRadius: 5, transition: `background-color 0.2s ease, color 0.2s ease, width 0.2s ${s.ease}` },
  disabled(s.pointerNone, s.bgcA),
  hover({ backgroundColor: '#6a6a6a' }),
  media(
    s.minBreak2,
    { width: 'auto' },
  ),
  modifier('.isBuyLinked', s.bgcGreen),
  modifier(
    '.forComment',
    parent(
      '.isComment',
      s.wv40,
      disabled(s.bgcA),
    ),
    parent(
      '.PostGrid .isComment',
      s.wv40,
    ),
  ),
  modifier('.forSubmit', s.bgcGreen, disabled(s.bgcA), hover({ backgroundColor: '#02B302' }), { width: 'auto' }),
  parent('.isComment', s.wv40, media(s.minBreak2, s.wv40)),
  parent('.PostGrid', s.wv40, media(s.minBreak2, s.wv40)),
)

const buttonContentsStyle = css(
  s.inlineFlex,
  s.itemsCenter,
  s.justifyCenter,
  { height: '100%' },
)

const cancelTextButtonStyle = css(
  s.colorA,
  s.px10,
  { width: 'auto' },
  hover({ color: '#6a6a6a' }),
)

const labelStyle = css(
  s.displayNone,
  { marginLeft: 15, marginRight: 7 },
  media(
    s.minBreak2,
    s.inlineBlock,
    select('& + .SVGIcon', { marginRight: 11 }),
    parent(
      '.PostDetail .forComment',
      select('& + .SVGIcon', { marginRight: 11, marginLeft: 11 }),
    ),
  ),
  parent('.forSubmit', s.inlineBlock, select('& + .SVGIcon', { marginRight: 11 })),
  parent('.isComment', s.displayNone, select('& + .SVGIcon', s.mr0)),
  parent('.PostGrid', s.displayNone, select('& + .SVGIcon', s.mr0)),
  parent('.PostGrid .isComment .forComment', s.displayNone, select('& + .SVGIcon', s.mr0)),
)
const hide = css(s.hide)

class PostActionBar extends Component {

  static propTypes = {
    buyLink: PropTypes.string,
    cancelAction: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    disableSubmitAction: PropTypes.bool.isRequired,
    editorId: PropTypes.string.isRequired,
    handleFileAction: PropTypes.func.isRequired,
    hasMedia: PropTypes.bool,
    replyAllAction: PropTypes.func,
    submitAction: PropTypes.func.isRequired,
    submitText: PropTypes.string.isRequired,
  }

  static defaultProps = {
    buyLink: null,
    hasMedia: false,
    replyAllAction: null,
  }

  onAddBuyLink = ({ value }) => {
    const { dispatch, editorId } = this.props
    dispatch(updateBuyLink(editorId, value))
    this.onCloseModal()
  }

  onCloseModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  submitted = () => {
    const { submitAction } = this.props
    submitAction()
  }

  handleFileBrowser = (e) => {
    const { handleFileAction } = this.props
    handleFileAction(e)
    this.fileBrowser.value = ''
  }

  browse = () => {
    this.browseButton.blur()
    this.fileBrowser.click()
  }

  cancel = () => {
    this.props.cancelAction()
  }

  money = () => {
    const { dispatch, buyLink, submitText } = this.props
    dispatch(openModal(
      <BuyLinkDialog
        dispatch={dispatch}
        onConfirm={this.onAddBuyLink}
        onDismiss={this.onCloseModal}
        text={buyLink}
        editorType={submitText}
      />))
  }

  render() {
    const { disableSubmitAction, hasMedia, replyAllAction, submitText, editorId } = this.props
    const isBuyLinked = this.props.buyLink && this.props.buyLink.length
    return (
      <div className={wrapperStyle} id={editorId}>
        <div className={leftStyle}>
          <button
            className={`PostActionButton forUpload ${buttonStyle}`}
            onClick={this.browse}
            ref={(comp) => { this.browseButton = comp }}
          >
            <div className={buttonContentsStyle}>
              <span className={labelStyle}>Upload</span>
              <BrowseIcon />
            </div>
          </button>
          <button
            className={classNames('PostActionButton forMoney', { isBuyLinked }, `${buttonStyle}`)}
            disabled={!hasMedia}
            onClick={this.money}
          >
            <div className={buttonContentsStyle}>
              <span className={labelStyle}>Sell</span>
              <MoneyIconCircle />
            </div>
          </button>
          {replyAllAction &&
            <button className={`PostActionButton forReplyAll ${buttonStyle}`} onClick={replyAllAction}>
              <div className={buttonContentsStyle}>
                <span className={labelStyle}>Reply All</span>
                <ReplyAllIcon />
              </div>
            </button>
          }
          <button
            className={`PostActionButton forCancel ${buttonStyle}`}
            onClick={this.cancel}
            disabled={disableSubmitAction}
          >
            <div className={buttonContentsStyle}>
              <span className={labelStyle}>Cancel</span>
              <XIconLG />
            </div>
          </button>
        </div>

        <div className={rightStyle}>
          <button className={`PostActionButton forCancel ${cancelTextButtonStyle}`} onClick={this.cancel}>
            <span>Cancel</span>
          </button>
          <button
            className={`PostActionButton forSubmit for${submitText} ${buttonStyle}`}
            disabled={disableSubmitAction}
            ref={(comp) => { this.submitButton = comp }}
            onClick={this.submitted}
          >
            <div className={buttonContentsStyle}>
              <span className={labelStyle}>{submitText}</span>
              <ArrowIcon />
            </div>
          </button>
        </div>
        <input
          className={hide}
          onChange={this.handleFileBrowser}
          ref={(comp) => { this.fileBrowser = comp }}
          type="file"
          accept="image/*"
          multiple
        />
      </div>
    )
  }
}

export default connect()(PostActionBar)

