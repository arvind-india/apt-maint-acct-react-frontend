import { flatConstants as constants } from '../_constants'

export function flats(state = {}, action) {

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
      // add 'deleting:true' property to model being deleted
      return {
        ...state,
        items: state.items.map(model =>
          model.id === action.idea
            ? { ...model, deleting: true }
            : model
        )
      }

    case constants.DELETE_SUCCESS:

      return {
        items: state.items.filter(model => model.id !== action.id)
      }

    case constants.DELETE_FAILURE:

      return {
        ...state,
        items: state.items.map(model => {
          if(model.id === action.id) {
            // make copy of model without 'deleting:true' property
            const { deleting, ...modelCopy } = model
            // return copy of model with 'deleteError:[error]' property
            return { ...modelCopy, deleteError: action.error }
          }
          return model
        })
      }

    default:
      return state

  }

}
