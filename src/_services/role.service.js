import axios from 'axios'

export const roleService = {
  getAll,
  getById,
  update,
  delete: _delete
}
let user = JSON.parse(localStorage.getItem('user'))
let url = '/roles'
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

function getAll() {
  console.log('role service getAll()')
  return instance.get(url)
    .then(handleResponse)
    .catch(handleError)
}

function getById(id) {
  return instance.get(url + '/' + id)
    .then(handleResponse)
    .catch(handleError)
}

function update(model) {
  console.log('role service update model: ', model)
  return instance.put(url + '/' + model.id, model)
    .then(handleResponse)
    .catch(handleError)
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  return instance.delete(url + '/' + id)
    .then(handleResponse)
    .catch(handleError)
}

function handleResponse(response) {
  console.log('Role service response: ', response)
  if(!response.data) {
    return Promise.reject(response.statusText)
  }
  return response.data
}
function handleError(error) {
  return Promise.reject(error)
}
