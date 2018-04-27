import { axiosClient } from './axios.instance'
import  'url-search-params-polyfill'

export const accountService = {
  getListFor,
  getMonthlyListFor,
  getById,
  getMonthlyAccountsFor,
  getSummaryList,
  update,
  add,
  delete: _delete
}

let url = '/maintenance-accounts'
let urlPeriodic = '/maintenance-accounts-periodic'
let urlMonthlyAccount = '/maintenance-accounts-for'

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

function getMonthlyListFor(data) {
console.log('getMonthlyListFor month: '+data.month+' year: '+data.year)
  let urlParams = {
                    params: {
                      month: data.month,
                      year: data.year
                    }
                  }
  return http()
    .get(urlPeriodic, urlParams)
    .then(handleResponse)
    .catch(this.handleError)
}

function getMonthlyAccountsFor(data) {
  console.log('getMonthlyAccountsFor: ', data)
  let urlParams = {
                    params: {
                      flatNumber: data.flatNumber,
                      month: data.forMonth,
                      year: data.forYear
                    }
                  }
  return http()
    .get(urlMonthlyAccount, urlParams)
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
  console.log('Deleting account id: ', id)
  return http().delete(url + '/' + id)
    .then(handleResponse)
    .catch(handleError)
}

function handleResponse(response) {
  console.log('account service >> handleResponse.......', response)
  if(!response.data) {
    return Promise.reject(response.statusText)
  }
  return response.data
}
function handleError(error) {
  return Promise.reject(error)
}
