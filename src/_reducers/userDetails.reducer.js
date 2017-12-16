import { userConstants } from '../_constants'

export function userDetails(state = {}, action) {
  switch (action.type) {
    case userConstants.GETBYID_REQUEST:
      return {
        loading: true
      }
    case userConstants.GETBYID_SUCCESS:
      console.log('Get By ID success: ', action)
      return {
        data: action.userDetails
      }
    case userConstants.GETBYID_FAILURE:
      return {
        error: action.error
      }
    case userConstants.CHANGE_REQUEST:
      return {
        loading: true
      }
    case userConstants.CHANGE_SUCCESS:
      console.log('User Change Request success: ', action)
      return {
        data: action.userDetails
      }
    case userConstants.CHANGE_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
