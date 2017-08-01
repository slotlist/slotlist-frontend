import * as _ from 'lodash'
import utils from '../../utils'
import router from '../../router'

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
  registeringForMissionSlot: false,
  showMissionSlotDeletion: false,
  deletingMissionSlot: false,
  showMissionSlotUnregister: false,
  unregisteringFromMissionSlot: false
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
  showMissionSlotDeletion() {
    return state.showMissionSlotDeletion
  },
  registeringForMissionSlot() {
    return state.registeringForMissionSlot
  },
  deletingMissionSlot() {
    return state.deletingMissionSlot
  },
  showMissionSlotUnregister() {
    return state.showMissionSlotUnregister
  },
  unregisteringFromMissionSlot() {
    return state.unregisteringFromMissionSlot
  },
}

const actions = {
  getMissions({ commit, state, dispatch }) {
    commit({
      type: 'startLoadingMissions'
    })

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
      }).catch((error) => {
        commit({
          type: 'finishLoadingMissions'
        })

        if (error.response) {
          console.error('getMissions', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load missions - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('getMissions', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load missions - Request failed`
          })
        } else {
          console.error('getMissions', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load missions - Something failed...`
          })
        }
      })
  },
  getMissionDetails({ commit, dispatch }, payload) {
    commit({
      type: 'startLoadingMissionDetails'
    })

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
      }).catch((error) => {
        commit({
          type: 'finishLoadingMissionDetails'
        })

        if (error.response) {
          console.error('getMissionDetails', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load mission details - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('getMissionDetails', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load mission details - Request failed`
          })
        } else {
          console.error('getMissionDetails', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load mission details - Something failed...`
          })
        }
      })
  },
  getMissionSlotlist({ commit, dispatch }, payload) {
    commit({
      type: 'startLoadingMissionSlotlist'
    })

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
      }).catch((error) => {
        commit({
          type: 'finishLoadingMissionSlotlist'
        })

        if (error.response) {
          console.error('getMissionSlotlist', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load mission slotlist - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('getMissionSlotlist', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load mission slotlist - Request failed`
          })
        } else {
          console.error('getMissionSlotlist', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load mission slotlist - Something failed...`
          })
        }
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
  clearMissionSlotlist({ commit }) {
    commit({
      type: 'clearMissionSlotlist'
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
  showMissionSlotDeletion({ commit }, payload) {
    commit({
      type: 'showMissionSlotDeletion',
      slotDetails: payload
    })
  },
  clearMissionSlotDeletion({ commit }) {
    commit({
      type: 'clearMissionSlotDeletion'
    })
  },
  registerForMissionSlot({ commit, dispatch }, payload) {
    commit({
      type: "startRegisteringForMissionSlot"
    })

    const comment = _.isNil(payload.comment) || _.isEmpty(payload.comment) ? null : payload.comment

    return MissionsApi.registerForMissionSlot(payload.missionSlug, payload.slotUid, comment)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw "Registering for mission slot failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (_.isNil(response.data.registration) || !_.isObject(response.data.registration)) {
          console.error(response)
          throw "Received invalid mission slot registration"
        }

        commit({
          type: 'finishRegisteringForMissionSlot'
        })

        dispatch('getMissionSlotlist', payload.missionSlug)

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully registered for slot <strong>#${payload.slotOrderNumber} ${payload.slotTitle}</strong>`
        })
      }).catch((error) => {
        commit({
          type: 'finishRegisteringForMissionSlot'
        })

        if (error.response) {
          console.error('registerForMissionSlot', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to register for slot <strong>#${payload.slotOrderNumber} ${payload.slotTitle}</strong> - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('registerForMissionSlot', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to register for slot <strong>#${payload.slotOrderNumber} ${payload.slotTitle}</strong> - Request failed`
          })
        } else {
          console.error('registerForMissionSlot', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to register for slot <strong>#${payload.slotOrderNumber} ${payload.slotTitle}</strong> - Something failed...`
          })
        }
      })
  },
  deleteMissionSlot({ commit, dispatch }, payload) {
    commit({
      type: "startDeletingMissionSlot"
    })

    return MissionsApi.deleteMissionSlot(payload.missionSlug, payload.slotUid)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw "Deleting mission slot failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (response.data.success !== true) {
          console.error(response)
          throw "Received invalid mission slot deletion"
        }

        commit({
          type: 'finishDeletingMissionSlot'
        })

        dispatch('getMissionSlotlist', payload.missionSlug)

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully deleted slot <strong>#${payload.slotOrderNumber} ${payload.slotTitle}</strong>`
        })
      }).catch((error) => {
        commit({
          type: 'finishDeletingMissionSlot'
        })

        if (error.response) {
          console.error('deleteMissionSlot', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to delete slot <strong>#${payload.slotOrderNumber} ${payload.slotTitle}</strong> - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('deleteMissionSlot', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to delete slot <strong>#${payload.slotOrderNumber} ${payload.slotTitle}</strong> - Request failed`
          })
        } else {
          console.error('deleteMissionSlot', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to delete slot <strong>#${payload.slotOrderNumber} ${payload.slotTitle}</strong> - Something failed...`
          })
        }
      })
  },
  deleteMission({ commit, dispatch }, payload) {
    return MissionsApi.deleteMission(payload.missionSlug)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw "Deleting mission failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (response.data.success !== true) {
          console.error(response)
          throw "Received invalid mission deletion"
        }

        router.push({ name: 'missionList' })
        dispatch('getMissions')

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully deleted mission <strong>${payload.missionTitle}</strong>`
        })

        commit({
          type: 'clearMissionDetails'
        })
      }).catch((error) => {
        if (error.response) {
          console.error('deleteMission', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to delete mission <strong>${payload.missionTitle}</strong> - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('deleteMission', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to delete mission <strong>${payload.missionTitle}</strong> - Request failed`
          })
        } else {
          console.error('deleteMission', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to delete mission <strong>${payload.missionTitle}</strong> - Something failed...`
          })
        }
      })
  },
  editMission({ commit, dispatch }, payload) {
    return MissionsApi.editMission(payload.missionSlug, payload.updatedMissionDetails)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw "Editing mission failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (_.isNil(response.data.mission) || !_.isObject(response.data.mission)) {
          console.error(response)
          throw "Received invalid mission"
        }

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully edited mission <strong>${payload.missionTitle}</strong>`
        })

        commit({
          type: 'setMissionDetails',
          mission: response.data.mission
        })
      }).catch((error) => {
        if (error.response) {
          console.error('editMission', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to edit mission <strong>${payload.missionTitle}</strong> - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('editMission', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to edit mission <strong>${payload.missionTitle}</strong> - Request failed`
          })
        } else {
          console.error('editMission', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to edit mission <strong>${payload.missionTitle}</strong> - Something failed...`
          })
        }
      })
  },
  showMissionSlotUnregister({ commit }, payload) {
    commit({
      type: 'showMissionSlotUnregister',
      slotDetails: payload
    })
  },
  clearMissionSlotUnregister({ commit }) {
    commit({
      type: 'clearMissionSlotUnregister'
    })
  },
  unregisterFromMissionSlot({ commit, dispatch }, payload) {
    commit({
      type: "startUnregisteringFromMissionSlot"
    })

    return MissionsApi.unregisterFromMissionSlot(payload.missionSlug, payload.slotUid, payload.registrationUid)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw "Unregistering from mission slot failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (response.data.success !== true) {
          console.error(response)
          throw "Received invalid mission slot registration deletion"
        }

        commit({
          type: 'finishUnregisteringFromMissionSlot'
        })

        dispatch('getMissionSlotlist', payload.missionSlug)

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully unregistered from slot <strong>#${payload.slotOrderNumber} ${payload.slotTitle}</strong>`
        })
      }).catch((error) => {
        commit({
          type: 'finishUnregisteringFromMissionSlot'
        })

        if (error.response) {
          console.error('unregisterFromMissionSlot', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to unregister from slot <strong>#${payload.slotOrderNumber} ${payload.slotTitle}</strong> - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('unregisterFromMissionSlot', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to unregister from slot <strong>#${payload.slotOrderNumber} ${payload.slotTitle}</strong> - Request failed`
          })
        } else {
          console.error('unregisterFromMissionSlot', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to unregister from slot <strong>#${payload.slotOrderNumber} ${payload.slotTitle}</strong> - Something failed...`
          })
        }
      })
  }
}

const mutations = {
  startLoadingMissions(state) {
    state.missionsLoaded = false
  },
  finishLoadingMissions(state) {
    state.missionsLoaded = true
  },
  setMissions(state, payload) {
    state.missions = payload.missions
    state.missionsLoaded = true
    state.missionsOffset = payload.offset
  },
  clearMissions(state) {
    state.missions = []
    state.missionsLoaded = false
  },
  startLoadingMissionDetails(state) {
    state.missionDetailsLoaded = false
  },
  finishLoadingMissionDetails(state) {
    state.missionDetailsLoaded = true
  },
  setMissionDetails(state, payload) {
    state.missionDetails = payload.mission
    state.missionDetailsLoaded = true
    utils.setTitle(`Mission ${state.missionDetails.title}`)
  },
  startLoadingMissionSlotlist(state) {
    state.missionSlotlistLoaded = false
  },
  finishLoadingMissionSlotlist(state) {
    state.missionSlotlistLoaded = true
  },
  setMissionSlotlist(state, payload) {
    state.missionSlotlist = payload.slots
    state.missionSlotlistLoaded = true
  },
  clearMissionDetails(state) {
    state.missionDetails = {}
    state.missionDetailsLoaded = false
  },
  clearMissionSlotlist(state) {
    state.missionSlotlist = []
    state.missionSlotlistLoaded = false
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
  },
  showMissionSlotDeletion(state, payload) {
    state.missionSlotDetails = payload.slotDetails
    state.showMissionSlotDeletion = true
  },
  clearMissionSlotDeletion(state) {
    state.showMissionSlotDeletion = false
  },
  startDeletingMissionSlot(state) {
    state.deletingMissionSlot = true
  },
  finishDeletingMissionSlot(state) {
    state.deletingMissionSlot = false
  },
  showMissionSlotUnregister(state, payload) {
    state.missionSlotDetails = payload.slotDetails
    state.showMissionSlotUnregister = true
  },
  clearMissionSlotUnregister(state) {
    state.showMissionSlotUnregister = false
  },
  startUnregisteringFromMissionSlot(state) {
    state.unregisteringFromMissionSlot = true
  },
  finishUnregisteringFromMissionSlot(state) {
    state.unregisteringFromMissionSlot = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
