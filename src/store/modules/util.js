import * as _ from 'lodash'

import StatusApi from '../../api/status'

const state = {
  backendVersion: null,
  working: null
}

const getters = {
  backendVersion() {
    return state.backendVersion
  },
  working() {
    return state.working
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
          console.error('getBackendVersion', error.request)
        } else {
          console.error('getBackendVersion', error.message)
        }
      })
  },
  startWorking({ commit }, payload) {
    commit({
      type: 'startWorking',
      message: payload
    })
  },
  stopWorking({ commit }) {
    commit({
      type: 'stopWorking'
    })
  }
}

const mutations = {
  setBackendVersion(state, payload) {
    state.backendVersion = payload.backendVersion
  },
  startWorking(state, payload) {
    state.working = _.isString(payload.message) && !_.isEmpty(payload.message) ? payload.message : 'Doing something...'
  },
  stopWorking(state) {
    state.working = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
