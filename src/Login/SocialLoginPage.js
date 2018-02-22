import React from 'react'
import { connect } from 'react-redux'
import { Button  } from 'reactstrap'
import {
          FaFacebook,
          FaGoogle,
          FaGithub
} from 'react-icons/lib/fa' // material design icons

import { userActions, alertActions } from '../_actions'

let hello = require('hellojs/dist/hello.all.js')

hello.init({
    facebook: process.env.REACT_APP_FACEBOOK_CLIENT_ID,
    google: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    github: process.env.REACT_APP_GITHUB_CLIENT_ID
  }, {
    scope: 'email'
  }
)

class SocialLoginPage extends React.Component {

  constructor(props) {
    super(props)
    // reset login status
    this.props.dispatch(userActions.logout())
    this.props.dispatch(alertActions.clear())  // clear alert messages from other pages
  }

  render() {
    return (
      <i>.{this.fbButton()}.{this.googleButton()}.</i>
    )
  }

  googleButton() {
    return <Button
      color="link"
      onClick={()=>this.socialLogin('google')}
      title="Google login"
    ><FaGoogle/></Button>
  }

  fbButton() {
    return <Button
      color="link"
      onClick={()=>this.socialLogin('facebook')}
      title="Facebook login"
    ><FaFacebook/></Button>
  }

  githubButton() {
    return <Button
      color="link"
      onClick={()=>this.socialLogin2('github')}
      title="github"
    ><FaGithub/></Button>
  }

  socialLogin(network){
    const { dispatch } = this.props
    hello(network).login().then(socialResponse, error)

    function socialResponse() {
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