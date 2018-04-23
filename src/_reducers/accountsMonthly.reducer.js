import { accountConstants as constants } from '../_constants'

export function accountsMonthly(state = {}, action) {

  switch (action.type) {

    case constants.GETMONTHLYMODELS_REQUEST:
      return { loading: true }

    case constants.GETMONTHLYMODELS_SUCCESS:
      return { items: action.models }

    case constants.GETMONTHLYMODELS_FAILURE:
      return { error: action.error }

    case constants.ADDMONTHLY_REQUEST:
      return { loading: true }

    case constants.ADDMONTHLY_SUCCESS:
      return { added: true, data: action.model }

    case constants.ADDMONTHLY_FAILURE:
      return { error: action.error }

    case constants.UPDATEMONTHLY_REQUEST:
      return { loading: true }

    case constants.UPDATEMONTHLY_SUCCESS:
      return { updated: true, data: action.model }

    case constants.UPDATEMONTHLY_FAILURE:
      return { error: action.error }

    case constants.DELETEMONTHLY_REQUEST:
      // add 'deleting:true' property to model being deleted
      return { deleting: true }

    case constants.DELETEMONTHLY_SUCCESS:
      return {
        model: {
          ...action.model,
          id: 0
        }
      }

    case constants.DELETEMONTHLY_FAILURE:
      return { model: null }

    default: return state

  }

}
