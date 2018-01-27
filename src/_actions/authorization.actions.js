import { authorizationConstants as constants } from '../_constants'
import { userService as service } from '../_services'

export const authorizationActions = {
  getAll,
  getForModule
}

function getAll() {
  return dispatch => {
    dispatch(request())

    service.getAllPermissions()
      .then(
        models => dispatch(success(models)),
        error => dispatch(failure(error+' getting all models'))
      )
  }
  function request() { return { type: constants.GETALL_REQUEST } }
  function success(models) { return { type: constants.GETALL_SUCCESS, models } }
  function failure(error) { return { type: constants.GETALL_FAILURE, error } }
}

function getForModule(resource) {
  return { type: constants.GETFORMODULE_RESOURCE, resource }
}
