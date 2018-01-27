import { authorizationConstants as constants } from '../_constants'

export function authentication(state = {}, action) {

  switch(action.type) {
    case constants.GETALL_REQUEST:
      return {
        loading: true
      }
    case constants.GETALL_SUCCESS:
      return {
        items: action.models
      }
    case constants.GETALL_FAILURE:
      return {
        error: action.error
      }
    case constants.GETFORMODULE_RESOURCE:
      // filter permissions specific to a module resource
      return {
        items: state.items.filter(model => model.resource == action.resource)
      }
    default:
      return state
  }
}
