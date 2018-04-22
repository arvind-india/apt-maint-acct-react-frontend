import { accountConstants as constants } from '../_constants'
import { accountService as service } from '../_services'
import { alertActions } from './'

export const accountMonthlyActions = {
  getMonthlyAccountsFor,
  delete: _delete,
  saveChanges
}

function getMonthlyAccountsFor(data) {
  return dispatch => {
    dispatch(request())
    service.getMonthlyAccountsFor(data)
      .then(
        response => {
          console.log('Response on getMonthlyAccountsFor: ', response)
          if(response.error) {
            throw new Error('Failed to get Monthly Account for data: '+data.flatNumber)
          }
          dispatch(success(response))
        },
        error => dispatch(failure(error+' getting account model for the given flatNumber, month and year'))
      )
  }
  function request() { return { type: constants.GETMODELS_REQUEST } }
  function success(models) { return { type: constants.GETMODELS_SUCCESS, models } }
  function failure(error) { return { type: constants.GETMODELS_FAILURE, error } }
}


// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(data) {
  let model = data.model
  let id = model.id
  return dispatch => {
    dispatch(request(id))
    // console.log('delete request in progress...')
    service.delete(id)
      .then(
        response => {
          //dispatch(accountMonthlyActions.getLatest(model))
          console.log('Response after delete request: ', response)
          if(response.error) {
            throw new Error('Failed to delete model id: '+id)
          }
          dispatch(success(model))
        },
        error => dispatch(failure(id, error))
      )
  }
  function request(id) { return { type: constants.DELETE_REQUEST, id } }
  function success(deletedModel) { return { type: constants.DELETE_SUCCESS, deletedModel } }
  function failure(id, error) { return { type: constants.DELETE_FAILURE, id, error } }
}

function saveChanges(model) {
  //let model = data.model
  if(model.id === 0) {
    return add(model)
  } else {
    return update(model)
  }

  function update(model) {
    return dispatch => {
      dispatch(request(model))
      service.update(model)
        .then(
          res => {
            //dispatch(accountMonthlyActions.getLatest(model))
            console.log('Response after update request: ', res)
            if(res.error){
              throw new Error('Failed to update account id: '+model.id)
            }
            dispatch(success(res.data.model))
            dispatch(alertActions.success('Updated Successfully'))
          },
          error => {
            let data = error.response.data
            let appData;
            if(data.error) { // check if there is a application specific error data enclosed
              appData = data.data
              dispatch(failure(appData.message))
              dispatch(alertActions.error(appData.message))
            } else {
              dispatch(failure(error.response))
              dispatch(alertActions.error(error.response.statusText))
            }
          }
        )
    }
    function request(model) { return { type: constants.UPDATE_REQUEST, model } }
    function success(model) { return { type: constants.UPDATE_SUCCESS, model } }
    function failure(error) { return { type: constants.UPDATE_FAILURE, error } }
  }

  function add(model) {
    return dispatch => {
      dispatch(request(model))
      service.add(model)
        .then(
          response => {
            console.log('Response after add request: ', response)
            if(response.error) {
              throw new Error('Failed to add model for flat number: '+model.flat_number)
            }
            // dispatch(accountMonthlyActions.getLatest(data))
            dispatch(success(response.data.model))
            dispatch(alertActions.success('Added new Flat Details Successfully'))
          },
          error => {
            let data = error.response.data
            // console.log('error response...')
            // console.log(error.response.data)
            let appData;
            if(data.error) { // check if there is a application specific error data enclosed
              appData = data.data
              dispatch(failure(appData.message))
              dispatch(alertActions.error(appData.message))
            } else {
              dispatch(failure(error.response))
              dispatch(alertActions.error(error.response.statusText))
            }
          }
        )
    }
    function request(model) { return { type: constants.ADD_REQUEST, model } }
    function success(model) { return { type: constants.ADD_SUCCESS, model } }
    function failure(error) { return { type: constants.ADD_FAILURE, error } }
  }

} // end of saveChanges()
