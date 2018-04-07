import React from 'react'
import { connect } from 'react-redux'
import { Jumbotron, Container, Row, Col } from 'reactstrap'
import jwtDecode from 'jwt-decode'
import moment from 'moment'

import { userActions, alertActions } from '../_actions'
import { FlashMessage, DisqusThread } from '../_components'

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
    const { user, alert } = this.props

    if(user) {
      let jwtDecodedToken = jwtDecode(user.id_token)
      console.log('jwtDecodedToken: ', jwtDecodedToken)
    }
    return (
      <div>
        {alert.message && <FlashMessage text={alert.message} color={alert.color} delay={2100}/>}
        <Jumbotron fluid>
          <Container fluid>
            <Col sm={{offset: 2, size: 8}}>
            <h1 className="display-5 text-center">Welcome</h1>
            <h1 className="display-6 text-center">to</h1>
            <h1 className="display-5 text-center">Apartment Maintenance Account</h1>
            <hr/>
            <p className="lead text-center">A demo application developed in React, Redux, ...</p>
            <hr/>
            <h5>It is intended</h5>
            <ul>
              <li>To track the collections and expenses towards maintenance of flats in the Apartment<br/></li>
              <li>To ensure any-time-access to transactions in the maintenance account<br/></li>
              <li>To enable transparency<br/></li>
            </ul>
          </Col>
          </Container>
        </Jumbotron>
        <Container>
          <Row>
            <Col sm={{offset: 2, size: 8}}>
              {user && this.showDecodedJWT(user.id_token)}
              <p>
                {user && this.isJWTExpired(user.id_token) && this.exitApp()}
              </p>
            </Col>
          </Row>

          <Row>
            <Col sm={{offset: 3, size: 6}}>
              <DisqusThread
                id="12345-12335-123123-1231312-1"
                title="React Demo"
                path="/blog/123-disquss-integration"
              />
            </Col>
          </Row>
        </Container>
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
