import { roleConstants as constants } from '../_constants'

export function roles(state = {}, action) {

  switch (action.type) {

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

    case constants.DELETE_REQUEST:
      // add 'deleting:true' property to user being deleted
      return {
        ...state,
        items: state.items.map(role =>
          role.id === action.idea
            ? { ...role, deleting: true }
            : role
        )
      }

    case constants.DELETE_SUCCESS:

      return {
        items: state.items.filter(role => role.id !== action.id)
      }

    case constants.DELETE_FAILURE:

      return {
        ...state,
        items: state.items.map(role => {
          if(role.id === action.id) {
            // make copy of role without 'deleting:true' property
            const { deleting, ...roleCopy } = role
            // return copy of role with 'deleteError:[error]' property
            return { ...roleCopy, deleteError: action.error }
          }
          return role
        })
      }

    default:
      return state

  }

}
