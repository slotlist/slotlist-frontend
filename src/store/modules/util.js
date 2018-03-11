import Vue from 'vue'
import { i18n } from '../../app'
import * as _ from 'lodash'
import moment from 'moment-timezone'
import Raven from 'raven-js'

import StatusApi from '../../api/status'

const state = {
  backendVersion: null,
  activeWork: [],
  timezone: null
}

const getters = {
  backendVersion() {
    return state.backendVersion
  },
  working() {
    return state.activeWork.length > 0 ? state.activeWork[0] : null
  },
  timezone() {
    return state.timezone
  }
}

const actions = {
  getBackendVersion({ commit }) {
    return StatusApi.getStatus()
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Retrieving backend version failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (_.isNil(response.data.version) || !_.isString(response.data.version)) {
          console.error(response)
          throw "Received invalid version"
        }

        commit({
          type: 'setBackendVersion',
          backendVersion: response.data.version
        })
      }).catch((error) => {
        if (error.response) {
          console.error('getBackendVersion', error.response)
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'util', function: 'getBackendVersion' } }) : null
          console.error('getBackendVersion', error.request)
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'util', function: 'getBackendVersion' } }) : null
          console.error('getBackendVersion', error.message)
        }
      })
  },
  setLocale({ commit }, payload) {
    commit({
      type: 'setLocale',
      locale: payload
    })
  },
  setTimezone({ commit }, payload) {
    commit({
      type: 'setTimezone',
      timezone: payload
    })
  },
  startWorking({ commit }, payload) {
    commit({
      type: 'startWorking',
      message: payload
    })
  },
  stopWorking({ commit }, payload) {
    commit({
      type: 'stopWorking',
      message: payload
    })
  }
}

const mutations = {
  setBackendVersion(state, payload) {
    state.backendVersion = payload.backendVersion
  },
  setLocale(state, payload) {
    Vue.ls.set('locale', payload.locale)

    i18n.locale = payload.locale
    moment.locale(payload.locale)
  },
  setTimezone(state, payload) {
    Vue.ls.set('timezone', payload.timezone)

    state.timezone = payload.timezone

    moment.tz.setDefault(payload.timezone)
  },
  startWorking(state, payload) {
    const message = _.isString(payload.message) && !_.isEmpty(payload.message) ? payload.message : 'Doing something...'

    state.activeWork.push(message)
    state.activeWork = _.uniq(state.activeWork)
  },
  stopWorking(state, payload) {
    const message = _.isString(payload.message) && !_.isEmpty(payload.message) ? payload.message : 'Doing something...'

    state.activeWork = _.uniq(state.activeWork).filter((w) => !_.isEqual(w, message))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
