import { accountConstants as constants } from '../_constants'
import { accountService as service } from '../_services'
import { alertActions } from './'
import { history } from '../_helpers'

export const accountMonthlyActions = {
  getMonthlyListFor,
  delete: _delete,
  saveChanges,
  saveChangesAndRefresh
}

function getMonthlyListFor(month, year) {
  return dispatch => {
    dispatch(request())
    service.getMonthlyListFor(month, year)
      .then(
        models => dispatch(success(models)),
        error => dispatch(failure(error+' getting MONTHLY account models for the given month and year'))
      )
  }
  function request() { return { type: constants.GETMONTHLY_REQUEST } }
  function success(models) { return { type: constants.GETMONTHLY_SUCCESS, models } }
  function failure(error) { return { type: constants.GETMONTHLY_FAILURE, error } }
}


// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  return dispatch => {
    dispatch(request(id))
    // console.log('delete request in progress...')
    service.delete(id)
      .then(
        model => dispatch(success(id)),
        error => dispatch(failure(id, error))
      )
  }
  function request(id) { return { type: constants.DELETE_REQUEST, id } }
  function success(id) { return { type: constants.DELETE_SUCCESS, id } }
  function failure(id, error) { return { type: constants.DELETE_FAILURE, id, error } }
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

      service.update(model)
        .then(
          res => {
            dispatch(success())
            //history.push('/accounts', {prevPathname: '/accounts/'+model.id})
            //history.goBack()
            dispatch(alertActions.success('Updated Successfully'))
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
    function request(model) { return { type: constants.UPDATE_REQUEST, model } }
    function success(model) { return { type: constants.UPDATE_SUCCESS, model } }
    function failure(error) { return { type: constants.UPDATE_FAILURE, error } }
  }

  function add(model) {
    return dispatch => {
      dispatch(request(model))

      service.add(model)
        .then(
          model => {
            dispatch(success())
            //history.push('/accounts')
            //history.goBack()
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


function saveChangesAndRefresh(model, data=null) {
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
            dispatch(success())
            //history.push('/accounts', {prevPathname: '/accounts/'+model.id})
            //history.goBack()
            dispatch(alertActions.success('Updated Successfully'))
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
    function request(model) { return { type: constants.UPDATE_REQUEST, model } }
    function success(model) { return { type: constants.UPDATE_SUCCESS, model } }
    function failure(error) { return { type: constants.UPDATE_FAILURE, error } }
  }

  function add(model) {
    return dispatch => {
      dispatch(request(model))

      service.add(model)
        .then(
          model => {
            if(data) {
              console.log('account >> add >> data is: ', data)
              //dispatch(accountActions.getMonthlyListFor(data.month, data.year))
            } else {
              console.log('account >> add >> no data ', data)
            }
            dispatch(success())
            //history.push('/accounts')
            //history.goBack()
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

} // end of saveChangesAndRefresh()
