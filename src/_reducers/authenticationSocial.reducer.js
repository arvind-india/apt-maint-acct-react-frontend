import { userConstants as constants } from '../_constants'

let user = JSON.parse(sessionStorage.getItem('user'))
const initialState = user ? { loggedIn: true, user } : {}

export function authenticationSocial(state = initialState, action) {
  switch(action.type) {
    case constants.SOCIALLOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.model
      }
    case constants.SOCIALLOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.model
      }
    case constants.SOCIALLOGIN_FAILURE:
      return {}
    default:
      return state
  }
}
