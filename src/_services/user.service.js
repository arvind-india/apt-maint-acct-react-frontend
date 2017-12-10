import axios from 'axios'

export const userService = {
  login,
  logout,
  register,
  getAll,
  getById,
  update,
  delete: _delete
}
let user = JSON.parse(localStorage.getItem('user'))
let instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL+'/api',
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' }
})
// if jwt token is available, set it for authorization
if(user && user.id_token) {
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
}

function getAll() {
  return instance.get('/users')
    .then(handleResponse)
    .catch(handleError)
}

function getById(id) {
  return instance.get('/users/' + id)
    .then(handleResponse)
    .catch(handleError)
}

function register(user) {
  console.log('registering....')
  console.log(user)
  // let data = {body: JSON.stringify(user)}
  return instance.post('/users', user)
    .then(handleResponse)
    .catch(handleError)
}

function update(user) {
  let data = {body: JSON.stringify(user)}
  return instance.put('/users/' + user.id, data)
    .then(handleResponse)
    .catch(handleError)
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  return instance.delete('/users/' + id)
    .then(handleResponse)
    .catch(handleError)
}
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
  return Promise.reject(error)
}
