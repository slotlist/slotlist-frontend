import * as _ from 'lodash'

import MissionsApi from '../../api/missions'

const state = {
  missions: []
}

const getters = {
  slotlist() {
    return state.missionDetails.slots
  }
}

const actions = {
  getMissions({ commit }, payload) {
    return MissionsApi.getMissions()
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Retrieving missions failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }
        console.log(response)

        return response.data.missions
      })
  },
  getMissionDetails({ commit, state }, payload) {
    return MissionsApi.getMissionDetails(payload)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Retrieving missions failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }
        console.log(response)

        return response.data.mission
      })

    /*var mockData = {
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
    })*/
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
