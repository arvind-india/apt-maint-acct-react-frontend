import { userConstants } from '../_constants'
import { userService } from '../_services'
import { alertActions } from './'
import { history } from '../_helpers'

export const userActions = {
  login,
  logout,
  register,
  getAll,
  delete: _delete,
  getById,
  saveChanges
}

function login(username, password) {

  return dispatch => {
    dispatch(request({ username }))

    userService.login(username, password)
      .then(
        user => {
          dispatch(success(user))
          history.push('/')
          dispatch(alertActions.success('Welcome to Apartment Maintenance Tracking Application'))
        },
        error => {
          dispatch(failure(error.response))
          dispatch(alertActions.error(error.response.statusText))
        }
      )
  }

  function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
  function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
  function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
  userService.logout()
  return { type: userConstants.LOGOUT }
}

function register(user) {
  return dispatch => {
    dispatch(request(user))

    userService.register(user)
      .then(
        user => {
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
  function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
  function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
  function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

function getAll() {
  return dispatch => {
    dispatch(request())

    userService.getAll()
      .then(
        users => dispatch(success(users)),
        error => dispatch(failure(error+' getting all users'))
      )
  }
  function request() { return { type: userConstants.GETALL_REQUEST } }
  function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
  function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  return dispatch => {
    dispatch(request(id))
    userService.delete(id)
      .then(
        user => {
          dispatch(success(id))
        },
        error => {
          dispatch(failure(id, error))
        }
      )
  }
  function request(id) { return { type: userConstants.DELETE_REQUEST, id } }
  function success(id) { return { type: userConstants.DELETE_SUCCESS, id } }
  function failure(id, error) { return { type: userConstants.DELETE_FAILURE, id, error } }
}


function getById(id) {
  return dispatch => {
    dispatch(request(id))
    userService.getById(id)
      .then(
        userDetails => dispatch(success(userDetails)),
        error => dispatch(failure(error+' in get user by id: '+id))
      )
  }
  function request(id) { return { type: userConstants.GETBYID_REQUEST, id } }
  function success(userDetails) {
    console.log('user details in action file: ', userDetails)
    return { type: userConstants.GETBYID_SUCCESS, userDetails } }
  function failure(id, error) { return { type: userConstants.GETBYID_FAILURE, id, error } }
}

function saveChanges(user) {
  return dispatch => {
    dispatch(request(user))

    userService.update(user)
      .then(
        user => {
          dispatch(success())
          history.push('/users')
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
  function request(user) { return { type: userConstants.CHANGE_REQUEST, user } }
  function success(user) { return { type: userConstants.CHANGE_SUCCESS, user } }
  function failure(error) { return { type: userConstants.CHANGE_FAILURE, error } }
}
