import Vue from 'vue'
import * as _ from 'lodash'

import AuthApi from '../../api/auth'

const state = {
  loggedIn: false,
  loginRedirectUrl: null,
  performingLogin: false,
  token: null
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
  }
}

const actions = {
  getLoginRedirectUrl({ commit, state }) {
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

        if (!response.data.success) {
          console.error(response)
          throw "Retrieving login redirect URL was unsuccessful"
        }

        if (!_.isString(response.data.url) || _.isEmpty(response.data.url)) {
          console.error(response)
          throw "Missing login redirect URL"
        }

        commit({
          type: 'setLoginRedirectUrl',
          url: response.data.url
        })
      })
  },
  performLogin({ state, commit }, payload) {
    commit({
      type: "startPerformingLogin"
    })

    return AuthApi.performLogin(payload)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Performing failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (!response.data.success) {
          console.error(response)
          throw "Performing login was unsuccessful"
        }

        if (!_.isString(response.data.token) || _.isEmpty(response.data.token)) {
          console.error(response)
          throw "Missing JWT"
        }

        commit({
          type: "setToken",
          token: response.data.token
        })
      })
  },
  performLogout({ commit }) {
    commit({
      type: "logout"
    })
  },
  setTokenFromLocalStorage({ commit }, payload) {
    commit({
      type: "setToken",
      token: payload.token
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
  setToken(state, payload) {
    Vue.ls.set("token", payload.token)

    state.token = payload.token
    state.loggedIn = true
    state.performingLogin = false
  },
  logout(state) {
    Vue.ls.clear()

    state.token = null
    state.loggedIn = false
    state.performingLogin = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
