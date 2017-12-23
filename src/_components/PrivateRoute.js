import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import moment from 'moment'

/*
export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    localStorage.getItem('user')
      ? <Component {...props} />
      : <Redirect to={{ pathname: '/login', state: { from: props.location }}} />
  )} />
)
*/


export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    validToken()
      ? <Component {...props} />
      : <Redirect to={{ pathname: '/login', state: { from: props.location }}} />
  )} />
)

function validToken() {
  console.log('Inside PrivateRoute >> validToken()')
  let user = localStorage.getItem('user')
  let userp = JSON.parse(user)
  console.log('User: ', userp)
  if(!userp) {
    console.log('@PrivateRoute: No logged user')
    return false; // no user in local storage, so return false
  }

  let token = userp.id_token
  let tokenExpiration = jwtDecode(token).exp
  // if token has more than 30 seconds before its expiration, it is taken as valid token...
  let isValid = moment.unix(tokenExpiration) - moment(Date.now()) > 30
  isValid ? console.log('User has valid Token') : console.log('User has NO VALID Token')
  return isValid
}
