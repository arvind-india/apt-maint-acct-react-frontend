import { connect } from 'react-redux'
import jwtDecode from 'jwt-decode'
import moment from 'moment'

import { userActions, alertActions } from '../_actions'
import { store } from '../_helpers'

export class TokenWatch {

  constructor(user) {
    this.timer = setInterval(this.watch(user.id_token), 1000)
  }

  start() {
    console.log('TokenWatch is started...')
    this.timer = setInterval(this.watch, 1000)
  }

  exitApp() {
    // this.props.dispatch(userActions.logout())
    // this.props.dispatch(alertActions.error('JWT Expired, re-login the Application!'))
    store.dispatch(userActions.logout())
    store.dispatch(alertActions.error('JWT Expired, re-login the Application!'))
    clearInterval(this.timer)
    console.log('TokenWatch is ended')
  }
  isJWTExpired(token) {
      let tokenExpiration = jwtDecode(token).exp
      // if token is about to expire in the next 30 seconds...
      return moment.unix(tokenExpiration) - moment(Date.now()) < 30
  }
  watch(token) {
    if( this.isJWTExpired(token) ) {
        this.exitApp()
    }
  }

}
