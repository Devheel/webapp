import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { random } from 'lodash'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
import { AUTHENTICATION_PROMOTIONS } from '../../constants/promotions/authentication'
import { sendForgotPasswordRequest } from '../../actions/authentication'
import { trackEvent } from '../../actions/tracking'
import Cover from '../../components/assets/Cover'
import Credits from '../../components/assets/Credits'
import Emoji from '../../components/assets/Emoji'
import EmailControl from '../../components/forms/EmailControl'
import FormButton from '../../components/forms/FormButton'
import { isFormValid, getEmailStateFromClient } from '../../components/forms/Validators'
import AppleStoreLink from '../../components/support/AppleStoreLink'

class ForgotPassword extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const userlist = AUTHENTICATION_PROMOTIONS
    const index = random(0, userlist.length - 1)
    this.state = {
      emailState: { status: STATUS.INDETERMINATE, message: '' },
      featuredUser: userlist[index],
      formStatus: STATUS.INDETERMINATE,
    }
    this.emailValue = ''
  }

  onChangeControl = ({ email }) => {
    this.emailValue = email
    const { emailState } = this.state
    const currentStatus = emailState.status
    const newState = getEmailStateFromClient({ value: email, currentStatus })
    if (newState.status !== currentStatus) {
      this.setState({ emailState: newState })
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { dispatch } = this.props
    dispatch(sendForgotPasswordRequest(this.emailValue))
    this.setState({ formStatus: STATUS.SUBMITTED })
  }

  onClickTrackCredits = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('authentication-credits-clicked'))
  }

  renderSubmitted() {
    return (
      <div>
        If your email address exists in our database, you will receive a
        password recovery link at your email address in a few minutes.
      </div>
    )
  }

  renderForm() {
    const { emailState } = this.state
    const isValid = isFormValid([emailState])
    return (
      <form
        className="AuthenticationForm"
        id="ForgotPasswordForm"
        noValidate="novalidate"
        onSubmit={ this.onSubmit }
        role="form"
      >
        <EmailControl
          classList="asBoxControl"
          label={ `Email ${emailState.message}` }
          onChange={ this.onChangeControl }
          tabIndex="1"
        />
        <FormButton disabled={ !isValid } tabIndex="2">Reset password</FormButton>
      </form>
    )
  }

  render() {
    const { featuredUser, formStatus } = this.state
    return (
      <section className="Authentication Panel">
        <div className="AuthenticationFormDialog">
          <h1>
            <Emoji name="hot_shit" title="It really does" size={ 32 } />
            Shit happens.
          </h1>
          { formStatus === STATUS.SUBMITTED ? this.renderSubmitted() : this.renderForm() }
        </div>
        <AppleStoreLink />
        <Credits onClick={ this.onClickTrackCredits } user={ featuredUser } />
        <Cover coverImage={ featuredUser.coverImage } modifiers="asFullScreen" />
      </section>
    )
  }
}

export default connect()(ForgotPassword)

