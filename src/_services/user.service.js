import { axiosClient } from './axios.instance'

export const userService = {
  login,
  socialLogin,
  forgotPassword,
  resetPassword,
  logout,
  register,
  getAll,
  getById,
  update,
  add,
  updateProfile,
  delete: _delete,
  getAllPermissions,
  getMyRoles,
  updateMyRoles
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

function socialLogin(network, token) {
  let data = { network: network, socialToken: token }
  return http().post('/sociallogin', data)
    .then(handleLoginResponse)
    .catch(handleError)
}

function forgotPassword(email) {
  let data = { email: email }
  return http().post('/login/forgot-password', data)
    .then(handleResponse)
    .catch(handleError)
}

function resetPassword(password, token) {
  let data = { resetpassword: password, token: token }
  return http().post('/login/reset-password', data)
    .then(handleResponse)
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

function getMyRoles(id) {
  return http().get(url + '/myroles/' + id)
    .then(handleResponse)
    .catch(this.handleError);
}

function updateMyRoles(id, attachedIds) {
  let data = { 'myrolesIds': attachedIds };
  return http().put(url + '/myroles/' + id, data)
    .then(handleResponse)
    .catch(this.handleError);
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
  return http().post(url, model)
    .then(handleResponse)
    .catch(handleError)
}

function updateProfile(model) {
  let profileUrl = 'userprofile'
  return http().put(profileUrl+'/'+model.id, model)
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
    let existingPermission = result[model.resource]
    let currentPermission = extractPermission(model)
    result[model.resource] = existingPermission ?
      mergePermissions(existingPermission, currentPermission) :
      currentPermission
  })
  sessionStorage.setItem('authorizations', JSON.stringify(result))
  return result;
}

function extractPermission(model) {
  return {
    allowsAdd: model.operations.includes('C'),
    allowsView: model.operations.includes('R'),
    allowsEdit: model.operations.includes('U'),
    allowsDelete: model.operations.includes('D'),
    condition: model.condition
  }
}
function mergePermissions(existing, current) {
  return {
    allowsAdd: existing.allowsAdd || current.allowsAdd,
    allowsView: existing.allowsView || current.allowsView,
    allowsEdit: existing.allowsEdit || current.allowsEdit,
    allowsDelete: existing.allowsDelete || current.allowsDelete,
    condition: existing.condition && current.condition ?
                  existing.condition+','+current.condition : // concatenate conditions
                  '' // condition is no longer needed
  }
}
function handleLoginResponse(response) {
  console.log('user.service >> handleLoginResponse(response) ', response)
  // login successful if there's a jwt token in the response
  if(response.data && response.data.id_token) {
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    sessionStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

function handleResponse(response) {
  console.log('user.service >> handleResponse(response) ', response)
  if(!response.data) {
    return Promise.reject(response.statusText)
  }
  return response.data
}
function handleError(error) {
  console.log('user.service >> handleError(error) ', error)
  return Promise.reject(error)
}
