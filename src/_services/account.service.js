import { axiosClient } from './axios.instance'
import  'url-search-params-polyfill'

export const accountService = {
  getListFor,
  getMonthlyListFor,
  getById,
  getSummaryList,
  update,
  add,
  delete: _delete
}

let url = '/maintenance-accounts'
let urlPeriodic = '/maintenance-accounts-periodic'

function http() {
  return axiosClient.instance()
}

function getListFor(fromDate, toDate) {
console.log('getListFor: '+fromDate+' to '+toDate)
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

function getMonthlyListFor(month, year) {
console.log('getMonthlyListFor month: '+month+' year: '+year)
  let urlParams = {
                    params: {
                      month: month,
                      year: year
                    }
                  }
  return http()
    .get(urlPeriodic, urlParams)
    .then(handleResponse)
    .catch(this.handleError)
}

function getById(id) {
  return http().get(url + '/' + id)
    .then(handleResponse)
    .catch(handleError)
}

function getSummaryList() {
  // console.log('account service >> getSummaryList()................')
  return http().get(url + '/summary/list')
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
  // console.log('account service >> handleResponse.......', response)
  if(!response.data) {
    return Promise.reject(response.statusText)
  }
  return response.data
}
function handleError(error) {
  return Promise.reject(error)
}
