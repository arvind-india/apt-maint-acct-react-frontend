import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import jwtDecode from 'jwt-decode'
import moment from 'moment'

import { userActions, alertActions } from '../_actions'

class HomePage extends React.Component {

  alertOptions = {
    offset: 14,
    position: 'top right',
    theme: 'dark',
    time: 2000,
    transition: 'scale'
  }

  constructor(props) {
    super(props)
    this.handleLogout = this.handleLogout.bind(this)
  }
  handleLogout() {
    this.props.dispatch(userActions.logout())
    this.props.dispatch(alertActions.error('You are now Logged out!!'))
  }
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
        <h2>Welcome to Account Tracking Website</h2>
        {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
        <p>
          {user
            ?<Button color="danger" onClick={this.handleLogout}>Logout</Button>
            :<Link to="/login">Login</Link>}
            <br/>
          {user && this.isJWTExpired(user.id_token) && this.exitApp()}
        </p>

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

const connectedHomePage = connect(mapStateToProps)(HomePage)
export { connectedHomePage as HomePage }
