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
    console.info('Refreshing JWT before performing request')
    return store.dispatch('refreshToken')
      .then(() => {
        console.info('Done refreshing JWT, performing actual request')
        return config
      }).catch((error) => {
        return Promise.reject(error)
      })
  }
  console.debug('request', config)
  return config
}, (error) => {
  console.debug('request error', error)
  return Promise.reject(error)
})

axios.interceptors.response.use((response) => {
  console.debug('response', response)

  if (!_.isNil(response.data.token)) {
    console.info('Received new JWT during request, updating local token')
    store.dispatch('setToken', response.data.token)
  }

  return response
}, (error) => {
  if (error.response && error.response.status === 401) {
    store.dispatch('performLogout')
    store.dispatch('setRedirect', error.config.url)

    router.push({ name: 'login' })

    return
  }

  console.debug('response error', error)
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
