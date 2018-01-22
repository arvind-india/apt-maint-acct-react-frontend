import { roleConstants as constants } from '../_constants'

export function rolesToPermissions(state = {}, action) {

  switch (action.type) {

    case constants.GETMYPERMISSIONS_REQUEST:
      return {
        loading: true
      }

    case constants.GETMYPERMISSIONS_SUCCESS:
      return {
        items: action.models
      }

    case constants.GETMYPERMISSIONS_FAILURE:
      return {
        error: action.error
      }

    default:
      return state

  }

}
