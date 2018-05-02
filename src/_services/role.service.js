import { axiosClient } from './axios.instance'

export const roleService = {
  getAll,
  getById,
  getMyPermissions,
  updateMyPermissions,
  update,
  add,
  delete: _delete
}

let url = '/roles'

function http() {
  return axiosClient.instance()
}

function getAll() {
  return http().get(url)
    .then(handleResponse)
    .catch(handleError)
}

function getById(id) {
  return http().get(url + '/' + id)
    .then(handleResponse)
    .catch(handleError)
}

function getMyPermissions(id) {
  return http().get(url + '/mypermissions/' + id)
    .then(handleResponse)
    .catch(this.handleError);
}

function updateMyPermissions(id, attachedIds) {
  let data = { 'mypermissionsIds': attachedIds };
  return http().put(url + '/mypermissions/' + id, data)
    .then(handleResponse)
    .catch(this.handleError);
}

function update(model) {
  return http().put(url + '/' + model.id, model)
    .then(handleResponse)
    .catch(handleError)
}

function add(model) {
  return http().post(url, model)
    .then(handleResponse)
    .catch(handleError)
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  return http().delete(url + '/' + id)
    .then(handleResponse)
    .catch(handleError)
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
