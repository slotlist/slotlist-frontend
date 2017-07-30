import * as _ from 'lodash'
import utils from '../../utils'

import MissionsApi from '../../api/missions'

const state = {
  missions: [],
  missionsLoaded: false,
  missionsLimit: 25,
  missionsOffset: 0,
  missionDetails: {},
  missionDetailsLoaded: false,
  missionSlotlist: [],
  missionSlotlistLoaded: false,
  missionSlotDetails: {},
  showMissionSlotDetails: false,
  showMissionSlotRegister: false,
  registeringForMissionSlot: false
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
  missionSlotlistLoaded() {
    return state.missionSlotlistLoaded
  },
  missionSlotlist() {
    return state.missionSlotlist
  },
  missionSlotDetails() {
    return state.missionSlotDetails
  },
  showMissionSlotDetails() {
    return state.showMissionSlotDetails
  },
  showMissionSlotRegister() {
    return state.showMissionSlotRegister
  },
  registeringForMissionSlot() {
    return state.registeringForMissionSlot
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
          throw "Retrieving mission details failed"
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
  },
  getMissionSlotlist({ commit }, payload) {
    return MissionsApi.getMissionSlotlist(payload)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Retrieving mission slotlist failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (_.isNil(response.data.slots) || !_.isObject(response.data.slots)) {
          console.error(response)
          throw "Received invalid mission slotlist"
        }

        commit({
          type: 'setMissionSlotlist',
          slots: response.data.slots
        })
      })
  },
  setMissionSlotDetails({ commit }, payload) {
    commit({
      type: 'setMissionSlotDetails',
      slotDetails: payload
    })
  },
  clearMissionDetails({ commit }) {
    commit({
      type: 'clearMissionDetails'
    })
  },
  clearMissionSlotDetails({ commit }) {
    commit({
      type: 'clearMissionSlotDetails'
    })
  },
  showMissionSlotRegister({ commit }, payload) {
    commit({
      type: 'showMissionSlotRegister',
      slotDetails: payload
    })
  },
  clearMissionSlotRegister({ commit }) {
    commit({
      type: 'clearMissionSlotRegister'
    })
  },
  registerForMissionSlot({ commit }, payload) {
    commit({
      type: "startRegisteringForMissionSlot"
    })

    const comment = _.isNil(payload.comment) || _.isEmpty(payload.comment) ? null : payload.comment

    return MissionsApi.registerMissionSlot(payload.missionSlug, payload.slotUid, comment)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Registering for mission slot failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        console.log(response.data)

        if (_.isNil(response.data.registration) || !_.isObject(response.data.registration)) {
          console.error(response)
          throw "Received invalid mission slot registration"
        }

        commit({
          type: 'finishRegisteringForMissionSlot'
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
    utils.setTitle(`Mission ${state.missionDetails.title}`)
  },
  setMissionSlotlist(state, payload) {
    state.missionSlotlist = payload.slots
    state.missionSlotlistLoaded = true
  },
  clearMissionDetails(state) {
    state.missionDetails = {}
    state.missionDetailsLoaded = false
  },
  setMissionSlotDetails(state, payload) {
    state.missionSlotDetails = payload.slotDetails
    state.showMissionSlotDetails = true
  },
  clearMissionSlotDetails(state) {
    state.showMissionSlotDetails = false
  },
  showMissionSlotRegister(state, payload) {
    state.missionSlotDetails = payload.slotDetails
    state.showMissionSlotRegister = true
  },
  clearMissionSlotRegister(state) {
    state.showMissionSlotRegister = false
  },
  startRegisteringForMissionSlot(state) {
    state.registeringForMissionSlot = true
  },
  finishRegisteringForMissionSlot(state) {
    state.registeringForMissionSlot = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
