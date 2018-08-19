import React from 'react'
import { connect } from 'react-redux'
import jwtDecode from 'jwt-decode'
import moment from 'moment'

import { userActions, alertActions } from '../_actions'
import { FlashMessage } from '../_components'
import { texts } from '../_constants'

export class Home extends React.Component {

  constructor(props) {
    super(props)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogout() {
    this.props.logout()
    this.props.error('You are now logged out!!')
  }
  exitApp() {
    this.props.logout()
    this.props.error('JWT Expired, re-login the Application!')
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
    const { alert } = this.props
    return (
      <div>
        <div>
          {alert.message && <FlashMessage text={alert.message} color={alert.color} delay={2100}/>}
        </div>
        <div className="home-page">
            <br/>
            <h1>{texts.welcomeHead1}</h1>
            <h4>{texts.welcomeHead2}</h4>
            <h3>{texts.welcomeHead3}</h3>
            <h3>{texts.welcomeHead4}</h3>
            <br/><br/>
            <h4>{texts.welcomeDesc0}</h4>
            <ul>
              <li>{texts.welcomeDesc1}</li>
              <li>{texts.welcomeDesc2}</li>
              <li>{texts.welcomeDesc3}</li>
              <li>{texts.welcomeDesc4}</li>
            </ul>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { alert, authentication, authenticationSocial } = state
  let user = authentication.user || authenticationSocial.user
  return {
    alert,
    user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => {
      dispatch(userActions.logout())
    },
    error: (msg) => {
      dispatch(alertActions.error(msg))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
