import axios from 'axios'
import * as _ from 'lodash'
import moment from 'moment'
import store from '../store'
import router from '../router'

axios.defaults.baseURL = process.env.BASE_API_URL
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.patch['Content-Type'] = 'application/json'

axios.interceptors.request.use((config) => {
  if (!store.getters.refreshingToken && shouldRefreshToken()) {
    console.log('Refreshing JWT before performing request')
    return store.dispatch('refreshToken')
      .then(() => {
        console.log('Done refreshing JWT, performing actual request')
        return config
      }).catch((error) => {
        return Promise.reject(error)
      })
  }
  console.log('request', config)
  return config
}, (error) => {
  console.log('request', error)
  return Promise.reject(error)
})

axios.interceptors.response.use((response) => {
  console.log('response', response)
  return response
}, (error) => {
  if (error.response && error.response.status === 401) {
    store.dispatch('performLogout')
    store.dispatch('setRedirect', error.config.url)

    router.push({ name: 'login' })

    return
  }

  console.log('response', error)
  return Promise.reject(error)
})

export function shouldRefreshToken() {
  const decodedToken = store.getters.decodedToken
  if (_.isNil(decodedToken)) {
    return false
  }

  if (!_.isNumber(decodedToken.exp)) {
    return false
  }

  const expiry = moment(decodedToken.exp * 1000)
  const now = moment().utc().subtract('30s')
  if (expiry <= now) {
    return true
  }

  return false
}
