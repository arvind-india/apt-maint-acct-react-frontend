import { flatConstants as constants } from '../_constants'

export function flatsToResidents(state = {}, action) {

  switch (action.type) {

    case constants.GETMYRESIDENTS_REQUEST:
      return {
        loading: true
      }

    case constants.GETMYRESIDENTS_SUCCESS:
      return {
        items: action.models
      }

    case constants.GETMYRESIDENTS_FAILURE:
      return {
        error: action.error
      }

    case constants.UPDATEMYRESIDENTS_REQUEST:
      return {
        loading: true
      }

    case constants.UPDATEMYRESIDENTS_SUCCESS:
      return {
        items: action.models
      }

    case constants.UPDATEMYRESIDENTS_FAILURE:
      return {
        error: action.error
      }

    default:
      return state

  }

}
