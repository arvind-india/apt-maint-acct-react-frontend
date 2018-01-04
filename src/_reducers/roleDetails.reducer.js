import { roleConstants as constants } from '../_constants'

export function roleDetails(state = {}, action) {
  switch (action.type) {
    case constants.GETBYID_REQUEST:
      return {
        loading: true
      }
    case constants.GETBYID_SUCCESS:
      console.log('Get By ID success: ', action)
      return {
        data: action.model
      }
    case constants.GETBYID_FAILURE:
      return {
        error: action.error
      }
    case constants.CHANGE_REQUEST:
      return {
        loading: true
      }
    case constants.CHANGE_SUCCESS:
      console.log('User Change Request success: ', action)
      return {
        data: action.model
      }
    case constants.CHANGE_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
