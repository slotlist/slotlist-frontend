import * as _ from 'lodash'

const state = {
  working: null
}

const getters = {
  working() {
    return state.working
  }
}

const actions = {
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
