import * as _ from 'lodash'

import MissionsApi from '../../api/missions'

const state = {
  missions: [],
  missionsLoaded: false,
  missionDetails: {},
  missionDetailsLoaded: false,
}

const getters = {
  missions() {
    return state.missions
  },
  missionsLoaded() {
    return state.missionsLoaded
  },
  missionDetails() {
    return state.missionDetails
  },
  missionDetailsLoaded() {
    return state.missionDetailsLoaded
  }
}

const actions = {
  getMissions({ commit, state }, payload) {
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

        if (_.isNil(response.data.missions) || !_.isArray(response.data.missions)) {
          console.error(response)
          throw "Received invalid missions"
        }

        commit({
          type: 'setMissions',
          missions: response.data.missions
        })
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

        if (_.isNil(response.data.mission) || !_.isObject(response.data.mission)) {
          console.error(response)
          throw "Received invalid mission"
        }

        commit({
          type: 'setMissionDetails',
          mission: response.data.mission
        })
      })
  }
}

const mutations = {
  setMissions(state, payload) {
    state.missions = payload.missions
    state.missionsLoaded = true
  },
  clearMissions(state, payload) {
    state.missions = []
    state.missionsLoaded = false
  },
  setMissionDetails(state, payload) {
    state.missionDetails = payload.mission
    state.missionDetailsLoaded = true
  },
  clearMissionDetails(state, payload) {
    state.missionDetails = {}
    state.missionDetailsLoaded = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
