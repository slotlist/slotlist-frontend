import * as _ from 'lodash'

import AuthApi from '../../api/auth'

const state = {
  missionDetails: {}
}

const getters = {
  slotlist() {
    return state.missionDetails.slots
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

export default {
  state,
  getters,
  actions,
  mutations
}
