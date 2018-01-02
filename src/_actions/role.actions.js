import { roleConstants } from '../_constants'
import { roleService } from '../_services'
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
console.log('role action: getAll()')
    roleService.getAll()
      .then(
        roles => dispatch(success(roles)),
        error => dispatch(failure(error+' getting all roles'))
      )
  }
  function request() { return { type: roleConstants.GETALL_REQUEST } }
  function success(roles) { return { type: roleConstants.GETALL_SUCCESS, roles } }
  function failure(error) { return { type: roleConstants.GETALL_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  return dispatch => {
    dispatch(request(id))
    roleService.delete(id)
      .then(
        model => {
          dispatch(success(id))
        },
        error => {
          dispatch(failure(id, error))
        }
      )
  }
  function request(id) { return { type: roleConstants.DELETE_REQUEST, id } }
  function success(id) { return { type: roleConstants.DELETE_SUCCESS, id } }
  function failure(id, error) { return { type: roleConstants.DELETE_FAILURE, id, error } }
}


function getById(id) {
  return dispatch => {
    dispatch(request(id))
    roleService.getById(id)
      .then(
        model => dispatch(success(model)),
        error => dispatch(failure(error+' in get role model by id: '+id))
      )
  }
  function request(id) { return { type: roleConstants.GETBYID_REQUEST, id } }
  function success(model) {
    console.log('Role model in action file: ', model)
    return { type: roleConstants.GETBYID_SUCCESS, model } }
  function failure(id, error) { return { type: roleConstants.GETBYID_FAILURE, id, error } }
}

function saveChanges(model) {
  return dispatch => {
    dispatch(request(model))

    roleService.update(model)
      .then(
        model => {
          dispatch(success())
          history.push('/roles')
          dispatch(alertActions.success('Changes Saved Successfully'))

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
  function request(model) { return { type: roleConstants.CHANGE_REQUEST, model } }
  function success(model) { return { type: roleConstants.CHANGE_SUCCESS, model } }
  function failure(error) { return { type: roleConstants.CHANGE_FAILURE, error } }
}
