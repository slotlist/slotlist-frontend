import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  missionDetails: {},
  loggedIn: true
}

const getters = {
  slotlist() {
    return state.missionDetails.slots
  },
  loggedIn() {
    return state.loggedIn
  }
}

const actions = {
  getMissionDetails({ commit, state }, payload) {
    var mockData = {
      id: 12345,
      name: 'Mock Mission',
      slots: [
        {
          id: 1,
          name: 'FBI Special Agent Derp',
          comment: 'FUCK YEA!'
        },
        {
          id: 2,
          name: 'FBI Survellance Pilot',
          comment: ''
        }
      ]
    }

    commit({
      type: 'setMissionDetails',
      content: mockData
    })
  }
}

const mutations = {
  setMissionDetails(state, payload) {
    state.missionDetails = payload.content
  },
  clearMissionDetails(state, payload) {
    state.missionDetails = {}
  }
}

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

export default store
