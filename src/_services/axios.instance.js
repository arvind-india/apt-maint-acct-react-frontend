import axios from 'axios'

export const axiosClient={
  instance
}

function instance() {
  let user = JSON.parse(sessionStorage.getItem('user'))
  return axios.create({
    baseURL: process.env.REACT_APP_API_URL+'/api',
    timeout: 1000,
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': user?user.id_token:null
    }
  })
}