import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import jwtDecode from 'jwt-decode'
import moment from 'moment'

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
  isJWTExpired(token) {
      let tokenExpiration = jwtDecode(token).exp
      // if token is about to expire in the next 30 seconds...
      return moment.unix(tokenExpiration) - moment(Date.now()) < 30
  }
  showDecodedJWT(token) {
    let jwtDecodedToken = jwtDecode(token)
    return <div>
      <p>User Details:</p>
      <p>Id: {jwtDecodedToken.id}</p>
      <p>Name: {jwtDecodedToken.name}</p>
      <p>First Name: {jwtDecodedToken.first_name}</p>
      <p>Last Name: {jwtDecodedToken.last_name}</p>
      <p>Email: {jwtDecodedToken.email}</p>
    </div>
  }
  render() {
    const { user, alert } = this.props
    if(user) {
      let jwtDecodedToken = jwtDecode(user.id_token)
      console.log('jwtDecodedToken: ', jwtDecodedToken)
    }
    return (
      <div>
        <h2>Welcome to Account Tracking Website</h2>
        {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
        {user && this.showDecodedJWT(user.id_token)}
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
