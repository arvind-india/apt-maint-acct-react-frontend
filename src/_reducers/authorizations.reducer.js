import { authorizationConstants as constants } from '../_constants'
/*
let authzns = JSON.parse(sessionStorage.getItem('authorizations'))
const initialState = authzns ? authzns : {}

export function authorizations(state = initialState, action) { */
export function authorizations(state = {}, action) {
  switch(action.type) {
    case constants.GETALL_REQUEST:
      return {
        loading: true
      }
    case constants.GETALL_SUCCESS:
      return action.models
    case constants.GETALL_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }

}
