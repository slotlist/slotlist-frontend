import axios from 'axios'

export const v1 = {
  deleteAccount(nickname) {
    return axios.post('/v1/auth/account/delete', { nickname })
  },
  getLoginRedirectUrl() {
    return axios.get('/v1/auth/steam')
  },
  performLogin(url) {
    return axios.post('/v1/auth/steam', { url })
  },
  refreshToken() {
    return axios.post('/v1/auth/refresh')
  },
  getAccountDetails() {
    return axios.get('/v1/auth/account')
  },
  editAccount(payload) {
    return axios.patch('/v1/auth/account', payload)
  }
}

export default v1
