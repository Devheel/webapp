// @flow
/* eslint-disable react/no-multi-comp */
import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { ArrowIcon } from '../assets/Icons'
import EmailControl from '../forms/EmailControl'
import FormButton from '../forms/FormButton'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/status_types'
import { css, hover, media, modifier, select } from '../../styles/jss'
import * as s from '../../styles/jso'

// -----------------

const formStyle = css(s.inlineBlock, s.relative)

type FormPropTypes = {
  formActionPath: string,
  formMessage: string,
  formStatus: string,
  isDisabled: boolean,
  isMobile: boolean,
}

export class FooterForm extends PureComponent {
  props: FormPropTypes

  static contextTypes = {
    onBlur: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  getStatusAsClassName() {
    const { formStatus } = this.props
    switch (formStatus) {
      case STATUS.FAILURE:
        return 'isFailing'
      case STATUS.SUCCESS:
        return 'isSucceeding'
      default:
        return 'isIndeterminate'
    }
  }

  render() {
    const { formActionPath, formMessage, isDisabled, isMobile } = this.props
    const { onBlur, onChange, onFocus, onSubmit } = this.context
    return (
      <form
        action={formActionPath}
        className={classNames(`${formStyle}`, this.getStatusAsClassName())}
        method="POST"
        noValidate="novalidate"
        onSubmit={onSubmit}
      >
        <EmailControl
          classList="inFooter"
          label="Email"
          placeholder={isMobile ? 'Subscribe' : 'Enter email for daily inspiration'}
          id="FooterEmailInput"
          onBlur={onBlur}
          onChange={onChange}
          onFocus={onFocus}
        />
        <FormButton
          className="FormButton inFooter"
          disabled={isDisabled}
        >
          { isMobile ? <ArrowIcon /> : 'Subscribe' }
        </FormButton>
        { formMessage && formMessage.length &&
          <span className="FormControlStatusBubble inFooter">{formMessage}</span>
        }
      </form>
    )
  }
}

// -----------------

const linkStyle = css(
  s.inlineBlock,
  s.fontSize14,
  s.alignMiddle,
  { borderBottom: 0 },
  hover(s.colorBlack),
)

const linkTextStyle = css(
  s.inlineBlock,
  s.overflowHidden,
  s.nowrap,
  s.alignMiddle,
  { marginRight: 15 },
  { transition: `width 0.2s ${s.ease}` },
  media(s.minBreak2, s.mr20),
)

type LinkPropTypes = {
  href: string,
  label: string,
}

export class FooterLink extends PureComponent {
  props: LinkPropTypes
  render() {
    const { href, label } = this.props
    return (
      <a className={linkStyle} href={href} rel="noopener noreferrer" target="_blank">
        <span className={linkTextStyle}>{label}</span>
      </a>
    )
  }
}

// -----------------

const toolStyle = css(
  s.inlineBlock,
  s.fontSize12,
  hover(s.colorBlack),
  modifier('.LayoutTool', { marginRight: -8, marginLeft: 5 }),
)

const toolTextStyle = css(
  s.inlineBlock,
  { width: 0 },
  s.ml5,
  s.overflowHidden,
  s.nowrap,
  s.alignMiddle,
  { transition: `width 0.2s ${s.ease}, color 0.2s` },
  select('.no-touch .FooterTool.TopTool:hover > &', s.wv30),
  select('.no-touch .FooterTool.LayoutTool:hover > &', { width: 66 }),
)

type ToolPropTypes = {
  className?: string,
  icon: React.Element<*>,
  label: string,
  onClick: () => void,
}

export class FooterTool extends Component {
  props: ToolPropTypes

  static defaultProps = {
    className: '',
  }

  shouldComponentUpdate(nextProps: ToolPropTypes) {
    return nextProps.label !== this.props.label || nextProps.className !== this.props.className
  }

  render() {
    const { className, icon, label, onClick } = this.props
    return (
      <button className={classNames(className, `FooterTool ${toolStyle}`)} onClick={onClick} >
        {icon}
        <span className={toolTextStyle}>{label}</span>
      </button>
    )
  }
}

