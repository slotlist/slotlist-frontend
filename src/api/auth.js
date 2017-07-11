import axios from 'axios'

export const v1 = {
  getLoginRedirectUrl() {
    return axios.get('/v1/auth/steam')
  },
  performLogin(url) {
    return axios.post('/v1/auth/steam', { url })
  }
}

export default v1
