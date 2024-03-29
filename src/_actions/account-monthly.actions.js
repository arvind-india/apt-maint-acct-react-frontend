import { accountConstants as constants } from '../_constants'
import { accountService as service } from '../_services'
import { alertActions } from './'

export const accountMonthlyActions = {
  getMonthlyListFor,
  getMonthlyAccountsFor,
  delete: _delete,
  saveChanges
}

function getMonthlyListFor(data) {
  return dispatch => {
    dispatch(request())
    service.getMonthlyListFor(data)
      .then(
        response => {
          if(response.error) {
            throw new Error('Failed to get Monthly List for data '+data.forMonth)
          }
          dispatch(success(response))
        },
        error => dispatch(failure(error+' getting account list for the given month and year'))
      )
  }
  function request() { return { type: constants.GETMONTHLYLIST_REQUEST } }
  function success(models) { return { type: constants.GETMONTHLYLIST_SUCCESS, models } }
  function failure(error) { return { type: constants.GETMONTHLYLIST_FAILURE, error } }
}

function getMonthlyAccountsFor(data) {
  return dispatch => {
    dispatch(request())
    service.getMonthlyAccountsFor(data)
      .then(
        response => {
          if(response.error) {
            throw new Error('Failed to get Monthly Account for data: '+data.flatNumber)
          }
          dispatch(success(response))
        },
        error => dispatch(failure(error+' getting account model for the given flatNumber, month and year'))
      )
  }
  function request() { return { type: constants.GETMONTHLYMODELS_REQUEST } }
  function success(models) { return { type: constants.GETMONTHLYMODELS_SUCCESS, models } }
  function failure(error) { return { type: constants.GETMONTHLYMODELS_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(model) {
  let id = model.id
  return dispatch => {
    dispatch(request(id))
    let data = {
      month: model.for_month,
      year: model.for_year
    }
    service.delete(id)
      .then(
        response => {
          if(response.error) {
            throw new Error('Failed to delete model id: '+id)
          }
          dispatch(success(model))
          dispatch(accountMonthlyActions.getMonthlyListFor(data))
        },
        error => dispatch(failure(id, error))
      )
  }
  function request(id) { return { type: constants.DELETEMONTHLY_REQUEST, id } }
  function success(model) { return { type: constants.DELETEMONTHLY_SUCCESS, model } }
  function failure(id, error) { return { type: constants.DELETEMONTHLY_FAILURE, id, error } }
}

function saveChanges(model) {
  if(model.id === 0) {
    return add(model)
  } else {
    return update(model)
  }

  function update(model) {
    return dispatch => {
      dispatch(request(model))
      let data = {
        month: model.for_month,
        year: model.for_year
      }
      service.update(model)
        .then(
          res => {
            if(res.error){
              throw new Error('Failed to update account id: '+model.id)
            }
            dispatch(success(res.data.model))
            dispatch(alertActions.success('Updated Successfully'))
            dispatch(accountMonthlyActions.getMonthlyListFor(data))
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
    function request(model) { return { type: constants.UPDATEMONTHLY_REQUEST, model } }
    function success(model) { return { type: constants.UPDATEMONTHLY_SUCCESS, model } }
    function failure(error) { return { type: constants.UPDATEMONTHLY_FAILURE, error } }
  }

  function add(model) {
    return dispatch => {
      dispatch(request(model))
      let data = {
        month: model.for_month,
        year: model.for_year
      }
      service.add(model)
        .then(
          response => {
            if(response.error) {
              throw new Error('Failed to add model for flat number: '+model.flat_number)
            }
            dispatch(success(response.data.model))
            dispatch(alertActions.success('Added new Flat Details Successfully'))
            dispatch(accountMonthlyActions.getMonthlyListFor(data))
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
    function request(model) { return { type: constants.ADDMONTHLY_REQUEST, model } }
    function success(model) { return { type: constants.ADDMONTHLY_SUCCESS, model } }
    function failure(error) { return { type: constants.ADDMONTHLY_FAILURE, error } }
  }

} // end of saveChanges()
