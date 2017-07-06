import axios from 'axios'
import * as _ from 'lodash'

export const v1 = {
  getLoginRedirectUrl() {
    return axios.get('/v1/auth/steam')
  },
  performLogin(url) {
    return axios.post('/v1/auth/steam', { url })
  }
}

export default v1
