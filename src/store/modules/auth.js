import * as _ from 'lodash'

import AuthApi from '../../api/auth'

const state = {
  loggedIn: false,
  loginRedirectUrl: null
}

const getters = {
  loginRedirectUrl() {
    return state.loginRedirectUrl
  },
  loggedIn() {
    return state.loggedIn
  }
}

const actions = {
  getLoginRedirectUrl({ commit, state }) {
    if (_.isString(state.loginRedirectUrl) && !_.isEmpty(state.loginRedirectUrl)) {
      return
    }

    AuthApi.getLoginRedirectUrl()
      .then(function (response) {
        if (response.status !== 200) {
          console.error("Retrieving login redirect URL failed")
          console.error(response)
          return
        }

        if (_.isEmpty(response.data)) {
          console.error("Received empty response")
          console.error(response)
          return
        }

        if (!response.data.success) {
          console.error("Retrieving login redirect URL was unsuccessful")
          console.error(response)
          return
        }

        if (!_.isString(response.data.url) || _.isEmpty(response.data.url)) {
          console.error("Missing login redirect URL")
          console.error(response)
          return
        }

        commit({
          type: 'setLoginRedirectUrl',
          url: response.data.url
        })
      })
  },
  performLogin({ commit, state }, payload) {
    AuthApi.performLogin(payload.url)
      .then(function (response) {
        console.log(response)
        payload.router.replace('missions')
      })
  }
}

const mutations = {
  setLoginRedirectUrl(state, payload) {
    state.loginRedirectUrl = payload.url
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
