import axios from 'axios'
import  'url-search-params-polyfill'

export const axiosClient={
  instance
}

function instance() {
  let user = JSON.parse(sessionStorage.getItem('user'))

  let host = process.env.NODE_ENV === 'production' ?
              window.location.origin :
              process.env.REACT_APP_API_URL

  //let host = process.env.REACT_APP_API_URL
  return axios.create({
    baseURL: host+'/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': user?user.id_token:null
    }
  })
}
