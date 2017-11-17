import axios from 'axios'
import * as _ from 'lodash'
import moment from 'moment-timezone'
import store from '../store'
import router from '../router'

axios.defaults.baseURL = process.env.BASE_API_URL
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.patch['Content-Type'] = 'application/json'

let pendingRequests = 0

axios.interceptors.request.use((config) => {
  pendingRequests += 1

  if (!store.getters.refreshingToken && shouldRefreshToken()) {
    console.info('Refreshing JWT before performing request')

    return store.dispatch('refreshToken')
      .then(() => {
        console.info('Done refreshing JWT, performing actual request')

        return config
      }).catch((error) => {
        return Promise.reject(error)
      })
  }

  console.debug('request', config.url, config)
  return config
}, (error) => {
  const url = error && error.config ? error.config.url : 'unknown URL'
  console.debug('request error', url, error)

  return Promise.reject(error)
})

axios.interceptors.response.use((response) => {
  pendingRequests -= 1

  console.debug('response', response.config.url, response)

  if (!_.isNil(response.data.token)) {
    console.info('Received new JWT during request, updating local token')

    store.dispatch('setToken', response.data.token)
  }

  return response
}, (error) => {
  if (error.response && error.response.status === 401) {
    store.dispatch('performLogout')

    router.push({ name: 'login' })
  }

  const url = error && error.config ? error.config.url : 'unknown URL'
  console.debug('response error', url, error)

  return Promise.reject(error)
})

export function pendingRequestCount() {
  return pendingRequests
}

export function shouldRefreshToken() {
  const decodedToken = store.getters.decodedToken
  if (_.isNil(decodedToken)) {
    return false
  }

  if (!_.isNumber(decodedToken.exp)) {
    return false
  }

  const expiry = moment.unix(decodedToken.exp).utc()
  const now = moment().utc().add(1, 'm')

  if (expiry <= now) {
    return true
  }

  return false
}
