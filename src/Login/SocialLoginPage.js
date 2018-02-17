import React from 'react'
import { connect } from 'react-redux'
import { Button  } from 'reactstrap'
import {
          FaFacebook,
          FaGoogle
} from 'react-icons/lib/fa' // material design icons

import { userActions, alertActions } from '../_actions'

let hello = require('hellojs/dist/hello.all.js')

hello.init({
    //facebook: '1771579283136832',
    facebook: process.env.REACT_APP_FACEBOOK_CLIENT_ID,
    //google: '826764168016-pcg0d6v1mcr39befq3gvorc7tgjkfdbj.apps.googleusercontent.com'
    google: process.env.REACT_APP_GOOGLE_CLIENT_ID
  }, {
    scope: 'email'
  }
)

class SocialLoginPage extends React.Component {
  constructor(props) {
    super(props)
    console.log('-------------------------------')
    console.log('process.env.FACEBOOK_CLIENT_ID: ', process.env.REACT_APP_FACEBOOK_CLIENT_ID)
    // reset login status
    this.props.dispatch(userActions.logout())
    this.props.dispatch(alertActions.clear())  // clear alert messages from other pages

    this.facebookLogin = this.facebookLogin.bind(this)
//    this.login = this.login.bind(this)
  }

  render() {
//    const { submitted } = this.state
//    const { alert } = this.props
    return (
      <i>or, sign-in through {this.fbButton()}, {this.googleButton()}</i>
    )
  }

  googleButton() {
    return <Button
      color="link"
      onClick={this.googleLogin}
      title="Google"
    ><FaGoogle/></Button>
  }

  googleLogin() {
    let network = 'google'

    // const { dispatch } = this.props

    hello(network).login().then(function() {
    	alert('You are signed in to Google');
    }, function(e) {
    	alert('Signin error: ' + e.error.message);
    });

  }

  fbButton() {
    return <Button
      color="link"
      onClick={this.facebookLogin}
      title="facebook"
    ><FaFacebook/></Button>
  }

  facebookLogin() {
    // let network = 'facebook'
    this.socialLogin('facebook')
    // const { dispatch } = this.props
/*
    hello(network).login().then(function() {
    	alert('You are signed in to Facebook');
    }, function(e) {
    	alert('Signin error: ' + e.error.message);
    });
*/
  }
  socialLogin(network){
    const { dispatch } = this.props
    hello(network).login().then(networkResponse, error)
    console.log('Social Network login called...', network)
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
