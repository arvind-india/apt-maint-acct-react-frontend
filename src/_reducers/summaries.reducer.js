import { accountConstants as constants } from '../_constants'

export function summaries(state = {}, action) {

  switch (action.type) {

    case constants.GETSUMMARY_REQUEST:
      return {
        loading: true
      }

    case constants.GETSUMMARY_SUCCESS:
      return {
        items: action.summaries
      }

    case constants.GETSUMMARY_FAILURE:
      return {
        error: action.error
      }

    default:
      return state

  }

}
