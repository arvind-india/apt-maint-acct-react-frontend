import { authorizationConstants as constants } from '../_constants'

export function authorizations(state = {}, action) {
  switch(action.type) {
    case constants.GETALL_REQUEST:
      return {
        loading: true
      }
    case constants.GETALL_SUCCESS:
      return action.models
    case constants.GETALL_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }

}
