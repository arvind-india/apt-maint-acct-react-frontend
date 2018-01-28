import axios from 'axios'
import jwtDecode from 'jwt-decode'

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
// let user = JSON.parse(sessionStorage.getItem('user'))
let url = '/users'
// if jwt token is available, set it for authorization
/*
if(user && user.id_token) {
  console.log('passing jwt token: ', user)
  console.log('decoded passing jwt: ', jwtDecode(user.id_token))
  // instance.defaults.headers.common['Authorization'] = user.id_token
  //instance.defaults.headers.common['x-access-token'] = user.id_token
  axios.defaults.headers.common['x-access-token'] = user.id_token
}
*/
/*
let user = JSON.parse(sessionStorage.getItem('user'))
let instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL+'/api',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    'x-access-token': user?user.id_token:null
  }
}) */
function instance() {
  let user = JSON.parse(sessionStorage.getItem('user'))

  let axiosinstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL+'/api',
    timeout: 1000,
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': user?user.id_token:null
    }
  })
/*
  console.log('setting user token: ', user)

  // axiosinstance.defaults.headers.common['Authorization'] = user.id_token
  //axiosinstance.defaults.headers.common['x-access-token'] = user.id_token
  if(user) {
    console.log('decoded passing jwt: ', jwtDecode(user.id_token))
    axiosinstance.defaults.headers.common['x-access-token'] = user.id_token
  } else {
    axiosinstance.defaults.headers.common['x-access-token'] = null
  } */
  return axiosinstance
}

function login(username, password) {
  let data = { email: username, password: password }
  return instance().post('/login', data)
    .then(handleLoginResponse)
    .catch(handleError)
}

function logout() {
  // remove user from local storage to log user out
  sessionStorage.removeItem('user')
  sessionStorage.removeItem('authorizations')
}

function getAll() {
  return instance().get(url)
    .then(handleResponse)
    .catch(handleError)
}

function getById(id) {
  return instance().get(url+'/' + id)
    .then(handleResponse)
    .catch(handleError)
}

function register(model) {
  return instance().post(url, model)
    .then(handleResponse)
    .catch(handleError)
}

function update(model) {
  return instance().put(url+'/'+model.id, model)
    .then(handleResponse)
    .catch(handleError)
}

function add(model) {
  console.log('user service add model: ', model)
  return instance().post(url, model)
    .then(handleResponse)
    .catch(handleError)
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  return instance().delete(url+'/'+id)
    .then(handleResponse)
    .catch(handleError)
}

function getAllPermissions(loginResponse) {
  //setToken()
  console.log('user service >> getAllPermissions()...')
  return instance().get(url+'/allpermissions')
    .then(handleAllPermissionsResponse)
    .catch(handleError)
}

function handleAllPermissionsResponse(response) {
  console.log('handling all Permissions Reponses...')
  console.log(response)
  if(!response.data) {
    return Promise.reject(response.statusText)
  }
  //return response.data
   //let authzns = authorizationsByResource(response.data)
   //console.log('authzns: ', authzns)
   // console.log('stringify authzns: ', JSON.stringify(authzns))
   //sessionStorage.setItem('authorizations', JSON.stringify(authzns))
   //localStorage.setItem('authorizations', authzns)
   //localStorage.setItem('authorizations', 'mohan')
   //return authzns
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
  // return Promise.reject(error)
  return error
}
