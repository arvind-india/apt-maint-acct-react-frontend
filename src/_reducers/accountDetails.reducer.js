import { accountConstants as constants } from '../_constants'

export function accountDetails(state = {}, action) {
  switch (action.type) {
    case constants.GETBYID_REQUEST: return { loading: true }
    case constants.GETBYID_SUCCESS: return { data: action.model }
    case constants.GETBYID_FAILURE: return { error: action.error }

    case constants.UPDATE_REQUEST: return { loading: true }
    case constants.UPDATE_SUCCESS: return { updated: true, data: action.model }
    case constants.UPDATE_FAILURE: return { error: action.error }

    case constants.ADD_REQUEST: return { loading: true }
    case constants.ADD_SUCCESS: return { added: true, data: action.model }
    case constants.ADD_FAILURE: return { error: action.error }

    default: return state
  }
}
