import { userConstants as constants } from '../_constants'

export function registrationConfirm(state = {}, action) {
  switch (action.type) {
    case constants.REGISTRATIONCONFIRM_REQUEST: return { confirming: true }
    case constants.REGISTRATIONCONFIRM_SUCCESS: return { data: action.data }
    case constants.REGISTRATIONCONFIRM_FAILURE: return { error: action.error }
    default: return state
  }
}
