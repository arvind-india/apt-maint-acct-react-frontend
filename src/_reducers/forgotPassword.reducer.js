import { userConstants as constants } from '../_constants'

export function forgotPassword(state={}, action) {
  switch(action.type) {
    case constants.FORGOTPASSWORD_REQUEST: return { loading: true }
    case constants.FORGOTPASSWORD_SUCCESS: return { data: action.model }
    case constants.FORGOTPASSWORD_FAILURE: return { error: action.error }
    default: return state
  }
}
