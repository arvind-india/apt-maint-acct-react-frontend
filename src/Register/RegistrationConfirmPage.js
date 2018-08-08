import React from 'react'
import { connect } from 'react-redux'

import { userActions, alertActions } from '../_actions'
import { FlashMessage } from '../_components'

export class RegistrationConfirm extends React.Component {

  componentDidMount() {
    this.props.registrationConfirm(this.props.match.params.code)
  }
  render() {
    const { alert } = this.props
    return (
      <div>
        <h2 align="center">Registration</h2>
        {alert.message && <FlashMessage text={alert.message} color={alert.color} delay={2100}/>}
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { alert } = state
  return {
    alert
  }
}

function mapDispatchToProps(dispatch) {
  return {
    error: (msg) => {
      dispatch(alertActions.error(msg))
    },
    registrationConfirm: (code) => {
      dispatch(userActions.registrationConfirm(code))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationConfirm)
