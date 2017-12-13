import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import AlertContainer from 'react-alert'
import jwtDecode from 'jwt-decode'

import { userActions, alertActions } from '../_actions'

class HomePage extends React.Component {

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
  alertOptions = {
    offset: 14,
    position: 'top right',
    theme: 'dark',
    time: 3000,
    transition: 'scale'
  }
  show(message) {
    this.msg.show(message)
  }
  timeNow() {
    return parseInt(Date.now() / 1000)
  }
  isJWTExpired(user) {
    if(user) {
      return jwtDecode(user.id_token).exp < this.timeNow()
    } else {
      return true
    }
  }
  jwtValidFor(user) {
    let initData = {
      differenceInSeconds: 0,
      remainingHours: 0,
      remainingMinutes: 0,
      remainingSeconds: 0
    }
    if (!user) return initData;
    let exp = jwtDecode(user.id_token).exp
    let now = this.timeNow()
    if(exp < now) return initData;
    let diffInSec = exp - now
    let remainingHours = parseInt(diffInSec / (60*60))
    let remainingMin = parseInt(diffInSec % (60*60) / 60)
    let remainingSec = diffInSec - (remainingHours * 60 * 60) - (remainingMin * 60)
    return {
      differenceInSeconds: diffInSec,
      remainingHours: remainingHours,
      remainingMinutes: remainingMin,
      remainingSeconds: remainingSec}
  }
  render() {
    const { user, alert } = this.props
    const validity = this.jwtValidFor(user)
    return (
      <div>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions}/>
        {alert.message ? this.show(alert.message) : null}
        <h2>Welcome to Account Tracking Website</h2>
        <p>
          {user
            ?<Button color="danger" onClick={this.handleLogout}>Logout</Button>
            :<Link to="/login">Login</Link>}
            <br/>
          <p>JWT is valid for {validity.remainingHours} hours,
            {validity.remainingMinutes} minutes,
            {validity.remainingSeconds} seconds </p>
          {user && this.isJWTExpired(user) && this.exitApp()}
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
