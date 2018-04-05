import { alertConstants as constants } from '../_constants'

export function alert(state = {}, action) {
  switch (action.type) {
    case constants.SUCCESS:
      return {
        type: 'alert-success',
        color: 'success',
        message: action.message
      }
    case constants.ERROR:
      return {
        type: 'alert-danger',
        color: 'danger',
        message: action.message
      }
    case constants.CLEAR:
      return {}
    default:
      return state
  }
}
