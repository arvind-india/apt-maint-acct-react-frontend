import { userConstants as constants } from '../_constants'

export function authenticationSocial(state = {}, action) {
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
    case constants.LOGOUT:
      return {}
    default:
      return state
  }
}
