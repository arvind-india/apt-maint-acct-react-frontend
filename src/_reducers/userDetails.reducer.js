import { userConstants } from '../_constants'

export function userDetails(state = {}, action) {
  switch (action.type) {
    case userConstants.GETBYID_REQUEST:
      return {
        loading: true
      }
    case userConstants.GETBYID_SUCCESS:
      return {
        items: action.userDetails
      }
    case userConstants.GETBYID_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
