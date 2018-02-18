import { userConstants as constants } from '../_constants'

export function resetPassword(state={}, action) {
  switch(action.type) {
    case constants.RESETPASSWORD_REQUEST:
      return {
        loading: true
      }
    case constants.RESETPASSWORD_SUCCESS:
      return {
        data: action.model
      }
    case constants.RESETPASSWORD_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
