import React from 'react'
import { connect } from 'react-redux'
import jwtDecode from 'jwt-decode'
import moment from 'moment'

import { userActions, alertActions } from '../_actions'

export class TokenWatch extends React.Component {

  constructor(props) {
    super(props)
    this.start()
  }

  start() {
    console.log('TokenWatch is started...')
    this.timer = setInterval(this.watch, 1000)
  }

  exitApp() {
    this.props.dispatch(userActions.logout())
    this.props.dispatch(alertActions.error('JWT Expired, re-login the Application!'))
    clearInterval(this.timer)
    console.log('TokenWatch is ended')
  }
  isJWTExpired(token) {
      let tokenExpiration = jwtDecode(token).exp
      // if token is about to expire in the next 30 seconds...
      return moment.unix(tokenExpiration) - moment(Date.now()) < 30
  }
  watch() {
    if( this.isJWTExpired(this.props.user.id_token) ) {
        this.exitApp()
    }
  }

}
