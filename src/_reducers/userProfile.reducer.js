import { userConstants as constants } from '../_constants'

export function userProfile(state = {}, action) {
  switch (action.type) {
    case constants.GETPROFILE_REQUEST: return { loading: true }
    case constants.GETPROFILE_SUCCESS: return { data: action.model }
    case constants.GETPROFILE_FAILURE: return { error: action.error }

    case constants.UPDATEPROFILE_REQUEST: return { loading: true }
    case constants.UPDATEPROFILE_SUCCESS: return { data: action.model }
    case constants.UPDATEPROFILE_FAILURE: return { error: action.error }

    default: return state
  }
}
