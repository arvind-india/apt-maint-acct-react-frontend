import { roleConstants as constants } from '../_constants'
import { roleService as service } from '../_services'
import { alertActions } from './'
import { history } from '../_helpers'

export const roleActions = {
  getAll,
  delete: _delete,
  getById,
  saveChanges
}

function getAll() {
  return dispatch => {
    dispatch(request())
    service.getAll()
      .then(
        models => dispatch(success(models)),
        error => dispatch(failure(error+' getting all role models'))
      )
  }
  function request() { return { type: constants.GETALL_REQUEST } }
  function success(models) { return { type: constants.GETALL_SUCCESS, models } }
  function failure(error) { return { type: constants.GETALL_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  return dispatch => {
    dispatch(request(id))
    console.log('delete request in progress...')
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


function getById(id) {
  return dispatch => {
    dispatch(request(id))
    service.getById(id)
      .then(
        model => dispatch(success(model)),
        error => dispatch(failure(error+' in get role model by id: '+id))
      )
  }
  function request(id) { return { type: constants.GETBYID_REQUEST, id } }
  function success(model) { return { type: constants.GETBYID_SUCCESS, model } }
  function failure(id, error) { return { type: constants.GETBYID_FAILURE, id, error } }
}

function saveChanges(model) {
  if(model.id == 0) {
    return add(model)
  } else {
    return update(model)
  }

  function update(model) {
    return dispatch => {
      dispatch(request(model))

      service.update(model)
        .then(
          model => {
            dispatch(success())
            history.push('/roles')
            dispatch(alertActions.success('Updated Successfully'))
          },
          error => {
            let data = error.response.data
            console.log('error response...')
            console.log(error.response.data)
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
            history.push('/roles')
            dispatch(alertActions.success('Added new Role Successfully'))
          },
          error => {
            let data = error.response.data
            console.log('error response...')
            console.log(error.response.data)
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
