import { accountConstants as constants } from '../_constants'

export function accountsMonthly(state = {}, action) {
  switch (action.type) {
    case constants.GETMONTHLYMODELS_REQUEST: return { loading: true }
    case constants.GETMONTHLYMODELS_SUCCESS:
      return { model: action.models.length > 0 ? action.models[0] : null }
    case constants.GETMONTHLYMODELS_FAILURE: return { error: action.error }

    case constants.GETMONTHLYLIST_REQUEST: return { loading: true }
    case constants.GETMONTHLYLIST_SUCCESS: return { items: action.models }
    case constants.GETMONTHLYLIST_FAILURE: return { error: action.error }

    case constants.ADDMONTHLY_REQUEST: return { loading: true }
    case constants.ADDMONTHLY_SUCCESS: return { added: true, model: action.model }
    case constants.ADDMONTHLY_FAILURE: return { error: action.error }

    case constants.UPDATEMONTHLY_REQUEST: return { loading: true }
    case constants.UPDATEMONTHLY_SUCCESS: return { updated: true, model: action.model }
    case constants.UPDATEMONTHLY_FAILURE: return { error: action.error }

    // add 'deleting:true' property to model being deleted
    case constants.DELETEMONTHLY_REQUEST: return { deleting: true }
    case constants.DELETEMONTHLY_SUCCESS:
      return {
        deleted: true,
        model: {
          ...action.model,
          id: 0
        }
      }
    case constants.DELETEMONTHLY_FAILURE: return { model: null }

    default: return state
  }
}
