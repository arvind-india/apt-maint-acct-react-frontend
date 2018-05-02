import { userConstants as constants } from '../_constants'

export function usersToRoles(state = {}, action) {
  switch (action.type) {
    case constants.GETMYROLES_REQUEST: return { loading: true }
    case constants.GETMYROLES_SUCCESS: return { items: action.models }
    case constants.GETMYROLES_FAILURE: return { error: action.error }

    case constants.UPDATEMYROLES_REQUEST: return { loading: true }
    case constants.UPDATEMYROLES_SUCCESS: return { items: action.models }
    case constants.UPDATEMYROLES_FAILURE: return { error: action.error }

    default: return state
  }
}
