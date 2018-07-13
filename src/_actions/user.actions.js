import { userConstants as constants } from '../_constants'
import { userService as service } from '../_services'
import { alertActions, authorizationActions as authzn } from './'
import { history } from '../_helpers'

export const userActions = {
  login,
  socialLogin,
  forgotPassword,
  resetPassword,
  logout,
  register,
  getAll,
  delete: _delete,
  getById,
  saveChanges,
  getMyRoles,
  updateMyRoles,
  getProfile,
  saveProfileChanges
}

function login(username, password) {
  return dispatch => {
    dispatch(request({ username }))
    service.login(username, password)
      .then(
        model => {
          dispatch(success(model))
          history.push('/')
          dispatch(alertActions.success('Welcome to Apartment Maintenance Tracking Application'))
          dispatch(authzn.getAll()) // get all authorizations/permissions for this logged user
        },
        error => {
          dispatch(failure(error.response))
          dispatch(alertActions.error(error.response.statusText))
        }
      )
  }
  function request(model) { return { type: constants.LOGIN_REQUEST, model } }
  function success(model) { return { type: constants.LOGIN_SUCCESS, model } }
  function failure(error) { return { type: constants.LOGIN_FAILURE, error } }
}

function socialLogin(network, token) {
  return dispatch => {
    dispatch(request({ network }))
    service.socialLogin(network, token)
      .then(
        model => {
          dispatch(success(model))
          history.push('/')
          dispatch(alertActions.success('Welcome to Apartment Maintenance Tracking Application'))
          dispatch(authzn.getAll()) // get all authorizations/permissions for this logged user
        },
        error => {
          dispatch(failure(error.response))
          dispatch(alertActions.error(error.response.statusText))
        }
      )
  }
  function request(model) { return { type: constants.SOCIALLOGIN_REQUEST, model } }
  function success(model) { return { type: constants.SOCIALLOGIN_SUCCESS, model } }
  function failure(error) { return { type: constants.SOCIALLOGIN_FAILURE, error } }
}

function forgotPassword(email) {
  return dispatch => {
    dispatch(request({ email }))
    service.forgotPassword(email)
      .then(
        model => {
          dispatch(success(model))
          history.push('/')
          dispatch(alertActions.success('An email is sent with link to reset the password'))
        },
        error => {
          dispatch(failure(error.response))
          dispatch(alertActions.error(error.response.statusText))
        }
      )
  }
  function request(model) { return { type: constants.FORGOTPASSWORD_REQUEST, model } }
  function success(model) { return { type: constants.FORGOTPASSWORD_SUCCESS, model } }
  function failure(error) { return { type: constants.FORGOTPASSWORD_FAILURE, error } }
}

function resetPassword(password, token) {
  return dispatch => {
    dispatch(request({ password, token })) // not sure on request parameter, just set token: token as a placeholder
    service.resetPassword(password, token)
      .then(
        model => {
          dispatch(success(model))
          history.push('/')
          dispatch(alertActions.success('Reset the password successfully'))
        },
        error => {
          dispatch(failure(error.response))
          dispatch(alertActions.error(error.response.statusText))
        }
      )
  }
  function request(model) { return { type: constants.RESETPASSWORD_REQUEST, model } }
  function success(model) { return { type: constants.RESETPASSWORD_SUCCESS, model } }
  function failure(error) { return { type: constants.RESETPASSWORD_FAILURE, error } }
}

function logout() {
  service.logout()
  return { type: constants.LOGOUT }
}

function register(model) {
  return dispatch => {
    dispatch(request(model))
    service.register(model)
      .then(
        model => {
          dispatch(success())
          history.push('/login')
          dispatch(alertActions.success('Registration successful'))
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
  function request(model) { return { type: constants.REGISTER_REQUEST, model } }
  function success(model) { return { type: constants.REGISTER_SUCCESS, model } }
  function failure(error) { return { type: constants.REGISTER_FAILURE, error } }
}

function getAll() {
  return dispatch => {
    dispatch(request())
    service.getAll()
      .then(
        models => dispatch(success(models)),
        error => dispatch(failure(error+' getting all models'))
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
    service.delete(id)
      .then(
        model => {
          dispatch(success(id))
        },
        error => {
          dispatch(failure(id, error))
        }
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
        error => dispatch(failure(error+' in getting model by id: '+id))
      )
  }
  function request(id) { return { type: constants.GETBYID_REQUEST, id } }
  function success(model) { return { type: constants.GETBYID_SUCCESS, model } }
  function failure(id, error) { return { type: constants.GETBYID_FAILURE, id, error } }
}

function getProfile(id) {
  return dispatch => {
    dispatch(request(id))
    service.getById(id)
      .then(
        model => dispatch(success(model)),
        error => dispatch(failure(error+' in getting profile model: '+id))
      )
  }
  function request(id) { return { type: constants.GETPROFILE_REQUEST, id } }
  function success(model) { return { type: constants.GETPROFILE_SUCCESS, model } }
  function failure(id, error) { return { type: constants.GETPROFILE_FAILURE, id, error } }
}

function getMyRoles(id) {
  return dispatch => {
    dispatch(request(id))
    service.getMyRoles(id)
      .then(
        model => dispatch(success(model)),
        error => dispatch(failure(error+' in get (my) roles for userID '+id))
      )
  }
  function request(id) { return { type: constants.GETMYROLES_REQUEST, id } }
  function success(models) { return { type: constants.GETMYROLES_SUCCESS, models } }
  function failure(id, error) { return { type: constants.GETMYROLES_FAILURE, id, error } }
}

function updateMyRoles(id, attachedIds) {
  return dispatch => {
    dispatch(request(id))
    service.updateMyRoles(id, attachedIds)
      .then(
        models => dispatch(success(models)),
        error => dispatch(failure(error
                    +' in updating (my) roles for userID '+id
                    +' with role ids: '+attachedIds))
      )
  }
  function request(id) { return { type: constants.UPDATEMYROLES_REQUEST, id } }
  function success(models) { return { type: constants.UPDATEMYROLES_SUCCESS, models } }
  function failure(id, error) { return { type: constants.UPDATEMYROLES_FAILURE, id, error } }
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
          model => {
            dispatch(success())
            history.push('/users')
            dispatch(alertActions.success('Changes in User Details Saved Successfully'))
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
          model => {
            dispatch(success())
            history.push('/users')
            dispatch(alertActions.success('Added new User Successfully'))
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
    function request(model) { return { type: constants.ADD_REQUEST, model } }
    function success(model) { return { type: constants.ADD_SUCCESS, model } }
    function failure(error) { return { type: constants.ADD_FAILURE, error } }
  }

} // end of saveChanges

function saveProfileChanges(model) {
  return dispatch => {
    dispatch(request(model))
    service.updateProfile(model)
      .then(
        model => {
          dispatch(success())
          history.push('/home')
          dispatch(alertActions.success('Changes in User Profile Saved Successfully'))
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
  function request(model) { return { type: constants.UPDATEPROFILE_REQUEST, model } }
  function success(model) { return { type: constants.UPDATEPROFILE_SUCCESS, model } }
  function failure(error) { return { type: constants.UPDATEPROFILE_FAILURE, error } }
}
