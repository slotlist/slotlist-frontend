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
  missionSlotlistFilter: {},
  missionSlotDetails: {},
  showMissionSlotDetails: false,
  showMissionSlotRegister: false,
  registeringForMissionSlot: false,
  showMissionSlotDeletion: false,
  editingMissionSlot: false,
  deletingMissionSlot: false,
  showMissionSlotUnregister: false,
  unregisteringFromMissionSlot: false,
  showMissionSlotCreate: false,
  creatingMissionSlot: false,
  checkingMissionSlugAvailability: false,
  missionSlugAvailable: false,
  creatingMission: false,
  missionSlotRegistrations: [],
  missionSlotRegistration: {},
  showMissionSlotRegistrationConfirmation: false,
  showMissionSlotRegistrationConfirmationAssign: false,
  modifyingMissionSlotRegistration: false
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
  filteredMissionSlotlist() {
    if (_.isEmpty(_.keys(state.missionSlotlistFilter))) {
      return state.missionSlotlist
    }

    const filteredSlotlist = []
    _.each(state.missionSlotlist, (slot) => {
      if (_.has(state.missionSlotlistFilter, 'assigned') && !_.isNil(slot.assignee)) {
        filteredSlotlist.push(slot)
      } else if (_.has(state.missionSlotlistFilter, 'hasRegistrations') && _.isNil(slot.assignee) && slot.registrationCount > 0) {
        filteredSlotlist.push(slot)
      } else if (_.has(state.missionSlotlistFilter, 'open') && _.isNil(slot.assignee) && slot.registrationCount <= 0) {
        filteredSlotlist.push(slot)
      }
    })

    return filteredSlotlist
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
  editingMissionSlot() {
    return state.editingMissionSlot
  },
  showMissionSlotUnregister() {
    return state.showMissionSlotUnregister
  },
  unregisteringFromMissionSlot() {
    return state.unregisteringFromMissionSlot
  },
  showMissionSlotCreate() {
    return state.showMissionSlotCreate
  },
  checkingMissionSlugAvailability() {
    return state.checkingMissionSlugAvailability
  },
  missionSlugAvailable() {
    return state.missionSlugAvailable
  },
  creatingMission() {
    return state.creatingMission
  },
  missionSlotRegistrations() {
    return state.missionSlotRegistrations
  },
  missionSlotRegistration() {
    return state.missionSlotRegistration
  },
  showMissionSlotRegistrationConfirmation() {
    return state.showMissionSlotRegistrationConfirmation
  },
  showMissionSlotRegistrationConfirmationAssign() {
    return state.showMissionSlotRegistrationConfirmationAssign
  },
  modifyingMissionSlotRegistration() {
    return state.modifyingMissionSlotRegistration
  }
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
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully registered for slot <strong>#${payload.slotOrderNumber + 1} ${payload.slotTitle}</strong>`
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
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to register for slot <strong>#${payload.slotOrderNumber + 1} ${payload.slotTitle}</strong> - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('registerForMissionSlot', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to register for slot <strong>#${payload.slotOrderNumber + 1} ${payload.slotTitle}</strong> - Request failed`
          })
        } else {
          console.error('registerForMissionSlot', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to register for slot <strong>#${payload.slotOrderNumber + 1} ${payload.slotTitle}</strong> - Something failed...`
          })
        }
      })
  },
  editMissionSlot({ commit, dispatch }, payload) {
    commit({
      type: 'startEditingMissionSlot'
    })

    return MissionsApi.editMissionSlot(payload.missionSlug, payload.slotUid, payload.updatedSlotDetails)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw "Editing mission slot failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (_.isNil(response.data.slot) || !_.isObject(response.data.slot)) {
          console.error(response)
          throw "Received invalid mission slot"
        }

        commit({
          type: 'finishEditingMissionSlot'
        })

        dispatch('getMissionSlotlist', payload.missionSlug)

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully edited slot <strong>#${payload.slotOrderNumber + 1} ${payload.slotTitle}</strong>`
        })
      }).catch((error) => {
        commit({
          type: 'finishEditingMissionSlot'
        })

        if (error.response) {
          console.error('editMissionSlot', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to edit slot <strong>#${payload.slotOrderNumber + 1} ${payload.slotTitle}</strong> - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('editMissionSlot', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to edit slot <strong>#${payload.slotOrderNumber + 1} ${payload.slotTitle}</strong> - Request failed`
          })
        } else {
          console.error('editMissionSlot', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to edit slot <strong>#${payload.slotOrderNumber + 1} ${payload.slotTitle}</strong> - Something failed...`
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
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully deleted slot <strong>#${payload.slotOrderNumber + 1} ${payload.slotTitle}</strong>`
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
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to delete slot <strong>#${payload.slotOrderNumber + 1} ${payload.slotTitle}</strong> - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('deleteMissionSlot', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to delete slot <strong>#${payload.slotOrderNumber + 1} ${payload.slotTitle}</strong> - Request failed`
          })
        } else {
          console.error('deleteMissionSlot', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to delete slot <strong>#${payload.slotOrderNumber + 1} ${payload.slotTitle}</strong> - Something failed...`
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

        commit({
          type: 'clearMissionDetails'
        })

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully deleted mission <strong>${payload.missionTitle}</strong>`
        })

        router.push({ name: 'missionList' })
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
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully unregistered from slot <strong>#${payload.slotOrderNumber + 1} ${payload.slotTitle}</strong>`
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
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to unregister from slot <strong>#${payload.slotOrderNumber + 1} ${payload.slotTitle}</strong> - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('unregisterFromMissionSlot', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to unregister from slot <strong>#${payload.slotOrderNumber + 1} ${payload.slotTitle}</strong> - Request failed`
          })
        } else {
          console.error('unregisterFromMissionSlot', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to unregister from slot <strong>#${payload.slotOrderNumber + 1} ${payload.slotTitle}</strong> - Something failed...`
          })
        }
      })
  },
  showMissionSlotCreate({ commit }, payload) {
    commit({
      type: 'showMissionSlotCreate',
      slotDetails: payload
    })
  },
  clearMissionSlotCreate({ commit }) {
    commit({
      type: 'clearMissionSlotCreate'
    })
  },
  createMissionSlot({ commit, dispatch }, payload) {
    commit({
      type: 'startCreatingMissionSlot'
    })

    return MissionsApi.createMissionSlot(payload.missionSlug, payload.slotDetails)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw "Creating mission slot failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (_.isNil(response.data.slots) || !_.isArray(response.data.slots) || _.isEmpty(response.data.slots)) {
          console.error(response)
          throw "Received invalid mission slot"
        }

        commit({
          type: 'finishCreatingMissionSlot'
        })

        dispatch('getMissionSlotlist', payload.missionSlug)

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully created slot <strong>#${payload.slotDetails.orderNumber + 1} ${payload.slotDetails.title}</strong>`
        })
      }).catch((error) => {
        commit({
          type: 'finishCreatingMissionSlot'
        })

        if (error.response) {
          console.error('createMissionSlot', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to create slot <strong>#${payload.slotDetails.orderNumber + 1} ${payload.slotDetails.title}</strong> - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('createMissionSlot', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to create slot <strong>#${payload.slotDetails.orderNumber + 1} ${payload.slotDetails.title}</strong> - Request failed`
          })
        } else {
          console.error('createMissionSlot', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to create slot <strong>#${payload.slotDetails.orderNumber + 1} ${payload.slotDetails.title}</strong> - Something failed...`
          })
        }
      })
  },
  checkMissionSlugAvailability({ commit, dispatch }, payload) {
    commit({
      type: 'startCheckingMissionSlugAvailability'
    })

    return MissionsApi.checkMissionSlugAvailability(payload)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw "Checking mission slug availability failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (_.isNil(response.data.available)) {
          console.error(response)
          throw "Received invalid mission slug availability status"
        }

        commit({
          type: 'setMissionSlugAvailability',
          available: response.data.available
        })
      }).catch((error) => {
        commit({
          type: 'setMissionSlugAvailability',
          available: false
        })

        if (error.response) {
          console.error('checkMissionSlugAvailability', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to check availability of mission slug <strong>${payload}</strong> - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('checkMissionSlugAvailability', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to check availability of mission slug <strong>${payload}</strong> - Request failed`
          })
        } else {
          console.error('checkMissionSlugAvailability', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to check availability of mission slug <strong>${payload}</strong> - Something failed...`
          })
        }
      })
  },
  createMission({ commit, dispatch }, payload) {
    commit({
      type: 'startCreatingMission'
    })

    return MissionsApi.createMission(payload)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw "Creating mission failed"
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
          type: 'finishCreatingMission'
        })

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully created mission <strong>${payload.title}</strong>`
        })

        router.push({
          name: 'missionDetails',
          params: { missionSlug: response.data.mission.slug }
        })
      }).catch((error) => {
        commit({
          type: 'finishCreatingMission'
        })

        if (error.response) {
          console.error('createMission', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to create mission <strong>${payload.title}</strong> - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('createMission', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to create mission <strong>${payload.title}</strong> - Request failed`
          })
        } else {
          console.error('createMission', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to create mission <strong>${payload.title}</strong> - Something failed...`
          })
        }
      })
  },
  getMissionSlotRegistrations({ commit, dispatch }, payload) {
    return MissionsApi.getMissionSlotRegistrations(payload.missionSlug, payload.slotUid)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw "Retrieving mission slot registrations failed"
        }


        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (_.isNil(response.data.registrations) || !_.isArray(response.data.registrations)) {
          console.error(response)
          throw "Received invalid mission slot registrations"
        }

        commit({
          type: 'setMissionSlotRegistrations',
          registrations: response.data.registrations
        })
      }).catch((error) => {
        if (error.response) {
          console.error('registerForMissionSlot', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to retrieve registrations for slot <strong>#${payload.slotOrderNumber + 1} ${payload.slotTitle}</strong> - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('registerForMissionSlot', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to register for slot <strong>#${payload.slotOrderNumber + 1} ${payload.slotTitle}</strong> - Request failed`
          })
        } else {
          console.error('registerForMissionSlot', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to register for slot <strong>#${payload.slotOrderNumber + 1} ${payload.slotTitle}</strong> - Something failed...`
          })
        }
      })
  },
  clearMissionSlotRegistrations({ commit }) {
    commit({
      type: 'clearMissionSlotRegistrations'
    })
  },
  showMissionSlotRegistrationConfirmation({ commit }, payload) {
    commit({
      type: 'showMissionSlotRegistrationConfirmation',
      registration: payload.registration,
      assign: payload.assign
    })
  },
  clearMissionSlotRegistrationConfirmation({ commit }) {
    commit({
      type: 'clearMissionSlotRegistrationConfirmation'
    })
  },
  modifyMissionSlotRegistration({ commit, dispatch }, payload) {
    commit({
      type: "startModifyingMissionSlotRegistration"
    })

    return MissionsApi.modifyMissionSlotRegistration(payload.missionSlug, payload.slotUid, payload.registrationUid, payload.confirm)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw "Modifying mission slot registration failed"
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
          type: "finishModifyingMissionSlotRegistration"
        })

        dispatch('getMissionSlotlist', payload.missionSlug)

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully modified slot registration`
        })
      }).catch((error) => {
        commit({
          type: 'finishModifyingMissionSlotRegistration'
        })

        if (error.response) {
          console.error('modifyMissionSlotRegistration', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to modify slot registration - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('modifyMissionSlotRegistration', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to modify slot registration - Request failed`
          })
        } else {
          console.error('modifyMissionSlotRegistration', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to modify slot registration - Something failed...`
          })
        }
      })
  },
  filterMissionSlotlist({ commit }, payload) {
    commit({
      type: 'setMissionSlotlistFilter',
      missionSlotlistFilter: payload
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
  startEditingMissionSlot(state) {
    state.editingMissionSlot = true
  },
  finishEditingMissionSlot(state) {
    state.editingMissionSlot = false
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
  },
  showMissionSlotCreate(state) {
    state.showMissionSlotCreate = true
  },
  clearMissionSlotCreate(state) {
    state.showMissionSlotCreate = false
  },
  startCreatingMissionSlot(state) {
    state.creatingMissionSlot = true
  },
  finishCreatingMissionSlot(state) {
    state.creatingMissionSlot = false
  },
  startCheckingMissionSlugAvailability(state) {
    state.checkingMissionSlugAvailability = true
  },
  setMissionSlugAvailability(state, payload) {
    state.checkingMissionSlugAvailability = false
    state.missionSlugAvailable = payload.available
  },
  startCreatingMission(state) {
    state.creatingMission = true
  },
  finishCreatingMission(state) {
    state.creatingMission = false
  },
  setMissionSlotRegistrations(state, payload) {
    state.missionSlotRegistrations = payload.registrations
  },
  clearMissionSlotRegistrations(state) {
    state.missionSlotRegistrations = []
  },
  showMissionSlotRegistrationConfirmation(state, payload) {
    state.missionSlotRegistration = payload.registration
    state.showMissionSlotRegistrationConfirmation = true
    state.showMissionSlotRegistrationConfirmationAssign = payload.assign
  },
  clearMissionSlotRegistrationConfirmation(state) {
    state.missionSlotRegistration = {}
    state.showMissionSlotRegistrationConfirmation = false
    state.showMissionSlotRegistrationConfirmationAssign = false
  },
  startModifyingMissionSlotRegistration(state) {
    state.modifyingMissionSlotRegistration = true
  },
  finishModifyingMissionSlotRegistration(state) {
    state.modifyingMissionSlotRegistration = false
  },
  setMissionSlotlistFilter(state, payload) {
    const filter = {};
    _.each(payload.missionSlotlistFilter, (f) => {
      filter[f] = true
    });

    state.missionSlotlistFilter = filter
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
