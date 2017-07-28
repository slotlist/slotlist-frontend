import * as _ from 'lodash'

import MissionsApi from '../../api/missions'

const state = {
  missions: [],
  missionsLoaded: false,
  missionsLimit: 25,
  missionsOffset: 0,
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
  },
  missionSlotlist() {
    if (!_.isArray(state.missionDetails.slots)) {
      return []
    }

    return state.missionDetails.slots
  }
}

const actions = {
  getMissions({ commit, state }) {
    return MissionsApi.getMissions(state.missionsLimit, state.missionsOffset)
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
          missions: response.data.missions,
          offset: response.data.moreAvailable === true ? (response.data.offset + response.data.count) : 0
        })
      })
  },
  getMissionDetails({ commit }, payload) {
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
    state.missionsOffset = payload.offset
  },
  clearMissions(state) {
    state.missions = []
    state.missionsLoaded = false
  },
  setMissionDetails(state, payload) {
    state.missionDetails = payload.mission
    state.missionDetailsLoaded = true
  },
  clearMissionDetails(state) {
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
