import React from 'react'
import { connect } from 'react-redux'
import { Button  } from 'reactstrap'
import {
          FaFacebook,
          FaGoogle,
          FaGithub
} from 'react-icons/lib/fa' // material design icons

import { userActions } from '../_actions'

let hello = require('hellojs/dist/hello.all.js')

hello.init({
    facebook: process.env.REACT_APP_FACEBOOK_CLIENT_ID,
    google: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    github: process.env.REACT_APP_GITHUB_CLIENT_ID
  }, {
    scope: 'email'
  }
)

export class SocialLogin extends React.Component {

  constructor(props) {
    super(props)
    // reset login status
    this.props.logout()
  }

  render() {
    return (
      <i className="float-right">{this.fbButton()}.{this.googleButton()}</i>
    )
  }

  googleButton() {
    return <Button
      color="link"
      className="google-button"
      onClick={()=>this.socialLogin('google')}
      title="Google login"
    ><FaGoogle/></Button>
  }

  fbButton() {
    return <Button
      color="link"
      className="facebook-button"
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

    let hello = require('hellojs/dist/hello.all.js')

    hello.init({
        facebook: process.env.REACT_APP_FACEBOOK_CLIENT_ID,
        google: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        github: process.env.REACT_APP_GITHUB_CLIENT_ID
      }, {
        scope: 'email'
      }
    )

    hello(network).login().then(socialResponse, error)

    function socialResponse() {
      let authResponse = hello(network).getAuthResponse();
      let token = authResponse.access_token;
      this.props.socialLogin(network, token)
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

function mapDispatchToProps(dispatch) {
  return {
    socialLogin: (email, password) => {
      dispatch(userActions.socialLogin(email, password))
    },
    logout: () => {
      dispatch(userActions.logout())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialLogin)
