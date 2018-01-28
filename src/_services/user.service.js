import { axiosClient } from './axios.instance'
//import axios from 'axios'

export const userService = {
  login,
  logout,
  register,
  getAll,
  getById,
  update,
  add,
  delete: _delete,
  getAllPermissions
}

let url = '/users'

function http() {
  return axiosClient.instance()
}

function login(username, password) {
  let data = { email: username, password: password }
  return http().post('/login', data)
    .then(handleLoginResponse)
    .catch(handleError)
}

function logout() {
  // remove user from local storage to log user out
  sessionStorage.removeItem('user')
  sessionStorage.removeItem('authorizations')
}

function getAll() {
  return http().get(url)
    .then(handleResponse)
    .catch(handleError)
}

function getById(id) {
  return http().get(url+'/' + id)
    .then(handleResponse)
    .catch(handleError)
}

function register(model) {
  return http().post(url, model)
    .then(handleResponse)
    .catch(handleError)
}

function update(model) {
  return http().put(url+'/'+model.id, model)
    .then(handleResponse)
    .catch(handleError)
}

function add(model) {
  console.log('user service add model: ', model)
  return http().post(url, model)
    .then(handleResponse)
    .catch(handleError)
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  return http().delete(url+'/'+id)
    .then(handleResponse)
    .catch(handleError)
}

function getAllPermissions(loginResponse) {
  return http().get(url+'/allpermissions')
    .then(handleAllPermissionsResponse)
    .catch(handleError)
}

function handleAllPermissionsResponse(response) {
  if(!response.data) {
    return Promise.reject(response.statusText)
  }
  return authorizationsByResource(response.data)
}

function authorizationsByResource(models) {
  let result = {}
  models.forEach(model => {
    result[model.resource] = {
      allowsAdd: model.operations.includes('C'),
      allowsView: model.operations.includes('R'),
      allowsEdit: model.operations.includes('U'),
      allowsDelete: model.operations.includes('D')
    }
  })
  sessionStorage.setItem('authorizations', JSON.stringify(result))
  return result;
}

function handleLoginResponse(response) {
  // login successful if there's a jwt token in the response
  if(response.data && response.data.id_token) {
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    sessionStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

function handleResponse(response) {
  if(!response.data) {
    return Promise.reject(response.statusText)
  }
  return response.data
}
function handleError(error) {
  return Promise.reject(error)
}
