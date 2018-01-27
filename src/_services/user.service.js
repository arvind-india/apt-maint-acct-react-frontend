import axios from 'axios'

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
let user = JSON.parse(localStorage.getItem('user'))
let url = '/users'
let instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL+'/api',
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' }
})
// if jwt token is available, set it for authorization
if(user && user.id_token) {
  console.log('passing jwt token: ', user)
  // instance.defaults.headers.common['Authorization'] = user.id_token
  instance.defaults.headers.common['x-access-token'] = user.id_token
}

function login(username, password) {
  let data = { email: username, password: password }
  return instance.post('/login', data)
    .then(handleLoginResponse)
    .catch(handleError)
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('user')
  localStorage.removeItem('authorizations')
}

function getAll() {
  return instance.get(url)
    .then(handleResponse)
    .catch(handleError)
}

function getById(id) {
  return instance.get(url+'/' + id)
    .then(handleResponse)
    .catch(handleError)
}

function register(model) {
  return instance.post(url, model)
    .then(handleResponse)
    .catch(handleError)
}

function update(model) {
  return instance.put(url+'/'+model.id, model)
    .then(handleResponse)
    .catch(handleError)
}

function add(model) {
  console.log('user service add model: ', model)
  return instance.post(url, model)
    .then(handleResponse)
    .catch(handleError)
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  return instance.delete(url+'/'+id)
    .then(handleResponse)
    .catch(handleError)
}

function getAllPermissions(loginResponse) {
  console.log('user service >> getAllPermissions()...')
  return instance.get(url+'/allpermissions')
    .then(handleAllPermissionsResponse)
    .catch(handleError)
}

function handleAllPermissionsResponse(response) {
  console.log('handling Reponses...')
  console.log(response)
  if(!response.data) {
    return Promise.reject(response.statusText)
  }
  return response.data
  // let authzns = authorizationsByResource(response.data)
  // localStorage.setItem('authorizations', JSON.stringify(authzns))
  // return authzns
}
/*
function authorizationsByResource(models) {
  let result = []
  models.forEach(model => {
    result[model.resource] = {
      allowsAdd: model.operations.includes('C'),
      allowsView: model.operations.includes('R'),
      allowsEdit: model.operations.includes('U'),
      allowsDelete: model.operations.includes('D')
    }
  })
  return result;
}
*/

function handleLoginResponse(response) {
  // login successful if there's a jwt token in the response
  if(response.data && response.data.id_token) {
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

function handleResponse(response) {
  console.log('handling Reponses...')
  console.log(response)
  if(!response.data) {
    return Promise.reject(response.statusText)
  }
  return response.data
}
function handleError(error) {
  console.log('error occurred...')
  console.log(error)
  return Promise.reject(error)
}
