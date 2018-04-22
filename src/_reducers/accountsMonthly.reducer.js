import { accountConstants as constants } from '../_constants'

export function accountsMonthly(state = {}, action) {

  switch (action.type) {

    case constants.GETMODELS_REQUEST:
      return { loading: true }

    case constants.GETMODELS_SUCCESS:
      return { items: action.models }

    case constants.GETMODELS_FAILURE:
      return { error: action.error }

    case constants.ADD_REQUEST:
      return { loading: true }

    case constants.ADD_SUCCESS:
      return { added: true, data: action.model }

    case constants.ADD_FAILURE:
      return { error: action.error }

    case constants.UPDATE_REQUEST:
      return { loading: true }

    case constants.UPDATE_SUCCESS:
      return { updated: true, data: action.model }

    case constants.UPDATE_FAILURE:
      return { error: action.error }

    case constants.DELETE_REQUEST:
      // add 'deleting:true' property to model being deleted
      return { deleting: true }

    case constants.DELETE_SUCCESS:
      return {
        model: {
          ...action.deletedModel,
          id: 0
        }
      }

    case constants.DELETE_FAILURE:
      return { model: null }

    default: return state

  }

}
