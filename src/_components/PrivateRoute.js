import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import moment from 'moment'

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    validToken()
      ? <Component {...props} />
      : <Redirect to={{ pathname: '/login', state: { from: props.location }}} />
  )} />
)

function validToken() {
  let user = sessionStorage.getItem('user')
  let userp = JSON.parse(user)
  if(!userp) {
    return false; // no user in local storage, so return false
  }
  let token = userp.id_token
  let tokenExpiration = jwtDecode(token).exp
  // if token has more than 30 seconds before its expiration, it is taken as valid token...
  let isValid = moment.unix(tokenExpiration) - moment(Date.now()) > 30
  return isValid
}
