import React from 'react'
// import { Link } from 'react-router-dom'
 import { connect } from 'react-redux'
// import { Button } from 'reactstrap'
import jwtDecode from 'jwt-decode'
import moment from 'moment'

import { userActions, alertActions } from '../_actions'

class TokenWatch extends React.Component {

  exitApp() {
    this.props.dispatch(userActions.logout())
    this.props.dispatch(alertActions.error('JWT Expired, re-login the Application!'))
  }
  isJWTExpired(token) {
      let tokenExpiration = jwtDecode(token).exp
      // if token is about to expire in the next 30 seconds...
      return moment.unix(tokenExpiration) - moment(Date.now()) < 30
  }
  render() {
    const { user, alert } = this.props
    return (
      <div>
          {user && this.isJWTExpired(user.id_token) && this.exitApp()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { alert, authentication } = state
  const { user } = authentication
  return {
    alert,
    user
  }
}

const connectedTokenWatch = connect(mapStateToProps)(TokenWatch)
export { connectedTokenWatch as TokenWatch }
