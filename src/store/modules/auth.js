import Vue from 'vue'
import * as _ from 'lodash'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import moment from 'moment'
import router from '../../router'

import AuthApi from '../../api/auth'

const state = {
  loggedIn: false,
  loginRedirectUrl: null,
  redirect: null,
  performingLogin: false,
  token: null,
  decodedToken: null,
  refreshingToken: false,
  accountDetails: null,
  accountMissions: null,
  accountPermissions: null
}

const getters = {
  loginRedirectUrl() {
    return state.loginRedirectUrl
  },
  loggedIn() {
    return state.loggedIn
  },
  performingLogin() {
    return state.performingLogin
  },
  decodedToken() {
    return state.decodedToken
  },
  refreshingToken() {
    return state.refreshingToken
  },
  user() {
    return _.isNil(state.decodedToken) ? {} : state.decodedToken.user
  },
  accountDetails() {
    return state.accountDetails
  },
  accountMissions() {
    return state.accountMissions
  },
  accountPermissions() {
    return state.accountPermissions
  }
}

const actions = {
  getLoginRedirectUrl({ commit, state, dispatch }) {
    if (_.isString(state.loginRedirectUrl) && !_.isEmpty(state.loginRedirectUrl)) {
      return
    }

    return AuthApi.getLoginRedirectUrl()
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Retrieving login redirect URL failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (!_.isString(response.data.url) || _.isEmpty(response.data.url)) {
          console.error(response)
          throw "Missing login redirect URL"
        }

        commit({
          type: 'setLoginRedirectUrl',
          url: response.data.url
        })
      }).catch((error) => {
        if (error.response) {
          console.error('getLoginRedirectUrl', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to get Steam SSO URL - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('getLoginRedirectUrl', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to get Steam SSO URL - Request failed`
          })
        } else {
          console.error('getLoginRedirectUrl', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to get Steam SSO URL - Something failed...`
          })
        }
      })
  },
  performLogin({ commit, dispatch }, payload) {
    commit({
      type: "startPerformingLogin"
    })

    return AuthApi.performLogin(payload)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Performing login failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (!_.isString(response.data.token) || _.isEmpty(response.data.token)) {
          console.error(response)
          throw "Missing JWT"
        }

        const decodedToken = jwtDecode(response.data.token)

        commit({
          type: "setToken",
          token: response.data.token,
          decodedToken: decodedToken
        })
      }).catch((error) => {
        commit({
          type: "finishPerformingLogin"
        })

        if (error.response) {
          console.error('performLogin', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to perform login - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('performLogin', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to perform login - Request failed`
          })
        } else {
          console.error('performLogin', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to perform login - Something failed...`
          })
        }
      })
  },
  performLogout({ commit }) {
    commit({
      type: "logout"
    })
  },
  setToken({ commit }, payload) {
    const decodedToken = jwtDecode(payload)

    commit({
      type: "setToken",
      token: payload,
      decodedToken: decodedToken
    })
  },
  setTokenFromLocalStorage({ commit }, payload) {
    let decodedToken = Vue.ls.get('auth-decodedToken')
    if (_.isNil(decodedToken)) {
      decodedToken = jwtDecode(payload)
    }

    const expiry = moment(decodedToken.exp * 1000)
    const now = moment().utc()
    if (expiry <= now) {
      console.info('JWT from localStorage is expired, clearing stored data')

      return commit({
        type: 'logout'
      })
    }

    commit({
      type: "setToken",
      token: payload,
      decodedToken: decodedToken
    })
  },
  refreshToken({ commit, dispatch }) {
    commit({
      type: "startRefreshingToken"
    })

    return AuthApi.refreshToken()
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Refreshing token failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (!_.isString(response.data.token) || _.isEmpty(response.data.token)) {
          console.error(response)
          throw "Missing JWT"
        }

        const decodedToken = jwtDecode(response.data.token)

        commit({
          type: "setToken",
          token: response.data.token,
          decodedToken: decodedToken
        })
      }).catch((error) => {
        commit({
          type: "finishRefreshingToken"
        })

        dispatch('performLogout')

        if (error.response) {
          console.error('refreshToken', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to perform login - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('refreshToken', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to perform login - Request failed`
          })
        } else {
          console.error('refreshToken', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to perform login - Something failed...`
          })
        }
      })
  },
  setRedirect({ commit }, payload) {
    commit({
      type: "setRedirect",
      redirect: payload
    })
  },
  getAccountDetails({ commit, dispatch }) {
    dispatch('startWorking', 'Loading account details...')

    return AuthApi.getAccountDetails()
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Retrieving account details failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (_.isNil(response.data.user) || !_.isObject(response.data.user)) {
          console.error(response)
          throw "Received invalid user"
        }

        commit({
          type: 'setAccountDetails',
          accountDetails: response.data.user
        })

        dispatch('stopWorking')
      }).catch((error) => {
        dispatch('stopWorking')

        if (error.response) {
          console.error('getAccountDetails', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load account details - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('getAccountDetails', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load account details - Request failed`
          })
        } else {
          console.error('getAccountDetails', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load account details - Something failed...`
          })
        }
      })
  },
  clearAccountDetails({ commit }) {
    commit({
      type: 'clearAccountDetails'
    })
  },
  editAccount({ commit, dispatch }, payload) {
    dispatch('startWorking', 'Updating account details...')

    return AuthApi.editAccount(payload.updatedAccountDetails)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Updating account details failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (_.isNil(response.data.user) || !_.isObject(response.data.user)) {
          console.error(response)
          throw "Received invalid user"
        }

        commit({
          type: 'setAccountDetails',
          accountDetails: response.data.user
        })

        dispatch('stopWorking')

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully updated account details`
        })
      }).catch((error) => {
        dispatch('stopWorking')

        if (error.response) {
          console.error('editAccount', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to update account details - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('editAccount', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to update account details - Request failed`
          })
        } else {
          console.error('editAccount', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to update account details - Something failed...`
          })
        }
      })
  }
}

const mutations = {
  setLoginRedirectUrl(state, payload) {
    state.loginRedirectUrl = payload.url
  },
  startPerformingLogin(state) {
    state.performingLogin = true
  },
  finishPerformingLogin(state) {
    state.performingLogin = false
  },
  startRefreshingToken(state) {
    state.refreshingToken = true
  },
  finishRefreshingToken(state) {
    state.refreshingToken = false
  },
  setToken(state, payload) {
    Vue.ls.set('auth-token', payload.token)
    Vue.ls.set('auth-decodedToken', payload.decodedToken)

    Vue.acl.parsePermissions(payload.decodedToken.permissions)

    axios.defaults.headers.common['Authorization'] = `JWT ${payload.token}`

    state.token = payload.token
    state.decodedToken = payload.decodedToken
    state.loggedIn = true
    state.performingLogin = false
    state.refreshingToken = false

    const redirect = Vue.ls.get('auth-redirect')
    if (!_.isNil(redirect)) {
      Vue.ls.remove('auth-redirect')
      router.push(redirect)
    }
  },
  logout(state) {
    Vue.ls.clear()

    Vue.acl.clearPermissions()

    state.token = null
    state.decodedToken = null
    state.loggedIn = false
    state.performingLogin = false
    state.refreshingToken = false
  },
  setRedirect(state, payload) {
    if (_.isNil(Vue.ls.get('auth-redirect'))) {
      Vue.ls.set('auth-redirect', payload.redirect)
    }
  },
  setAccountDetails(state, payload) {
    state.accountDetails = payload.accountDetails
    state.accountMissions = payload.accountDetails.missions
    state.accountPermissions = payload.accountDetails.permissions
  },
  clearAccountDetails(state) {
    state.accountDetails = null
    state.accountMissions = null
    state.accountPermissions = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
