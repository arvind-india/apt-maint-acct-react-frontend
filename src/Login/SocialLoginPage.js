import React from 'react'
//import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
//          Form,
          Button,
//          FormGroup,
//          FormText,
//          Input,
//          Label,
//          Col
        } from 'reactstrap'
import {
          FaFacebook
        } from 'react-icons/lib/fa' // material design icons

import { userActions, alertActions } from '../_actions'

let hello = require('hellojs/dist/hello.all.js')

class SocialLoginPage extends React.Component {
  constructor(props) {
    super(props)

    // reset login status
    this.props.dispatch(userActions.logout())
    this.props.dispatch(alertActions.clear())  // clear alert messages from other pages

    hello.init(
      {
        facebook: process.env.facebook_id,
        google: process.env.google_id
      },
      {
        scope: 'email'
      }
    )
//    this.handleChange = this.handleChange.bind(this)
//    this.handleSubmit = this.handleSubmit.bind(this)
//    this.facebookLogin = this.facebookLogin.bind(this)
//    this.login = this.login.bind(this)
  }

  render() {
//    const { submitted } = this.state
//    const { alert } = this.props
    return (
      <i>or, sign-in through {this.fbButton()}</i>
    )
  }

  fbButton() {
    return <Button
      color="link"
      onClick={this.facebookLogin}
      title="facebook"
    ><FaFacebook/></Button>
  }
  facebookLogin() {
    let network = 'facebook'

    const { dispatch } = this.props

    hello(network).login().then(networkResponse, error)
  console.log('Social Network login called...')
      //.then(this.appLogin(network), this.error);
    function networkResponse() {

      console.log('Received Response from '+network)
      let authResponse = hello(network).getAuthResponse();
      let token = authResponse.access_token;
      dispatch( userActions.socialLogin(network, token) )
    }
    function error(err) {
      console.error('Social Login Error: ', err)
    }
  }

}


function mapStateToProps(state) {
  const { alert } = state
  const { loggingIn } = state.authentication
  return {
    alert,
    loggingIn
  }
}

const connectedSocialLoginPage = connect(mapStateToProps)(SocialLoginPage)
export { connectedSocialLoginPage as SocialLoginPage }
