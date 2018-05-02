import { userConstants as constants } from '../_constants'

export function userDetails(state = {}, action) {
  switch (action.type) {
    case constants.GETBYID_REQUEST: return { loading: true }
    case constants.GETBYID_SUCCESS: return { data: action.model }
    case constants.GETBYID_FAILURE: return { error: action.error }

    case constants.UPDATE_REQUEST: return { loading: true }
    case constants.UPDATE_SUCCESS: return { data: action.model }
    case constants.UPDATE_FAILURE: return { error: action.error }

    default: return state
  }
}
