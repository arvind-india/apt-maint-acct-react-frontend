import { axiosClient } from './axios.instance'
import  'url-search-params-polyfill'

export const accountService = {
//  getAll,
  getListFor,
  getById,
  update,
  add,
  delete: _delete
}

let url = '/maintenance-accounts'

function http() {
  return axiosClient.instance()
}

/*
function getAll() {
  return http().get(url)
    .then(handleResponse)
    .catch(handleError)
}
*/

function getListFor(fromDate, toDate) {

  let urlParams = {
                    params: {
                      fromDate: fromDate.toString(),
                      toDate: toDate.toString()
                    }
                  }
  return http()
    .get(url, urlParams)
    .then(handleResponse)
    .catch(this.handleError)
}

function getById(id) {
  return http().get(url + '/' + id)
    .then(handleResponse)
    .catch(handleError)
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
