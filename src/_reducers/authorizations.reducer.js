import { authorizationConstants as constants } from '../_constants'

let authzns = localStorage.getItem('authorizations')
console.log('authzns from localStorage: ', authzns)
const initialState = authzns ? authzns : {}

export function authorizations(state = initialState, action) {

  switch(action.type) {
    case constants.GETALL_REQUEST:
      return {
        loading: true
      }
    case constants.GETALL_SUCCESS:
      //return action.models
      return authorizationsByResource()
      // return {
      //  items: action.models
        // items: authorizationsByResource()
      //}
    case constants.GETALL_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }

  function authorizationsByResource() {
    let result = []
    action.models.forEach(model => {
      result[model.resource] = {
        allowsAdd: model.operations.includes('C'),
        allowsView: model.operations.includes('R'),
        allowsEdit: model.operations.includes('U'),
        allowsDelete: model.operations.includes('D')
      }
    })
    localStorage.setItem('authorizations', result)
    return result;
  }

}
