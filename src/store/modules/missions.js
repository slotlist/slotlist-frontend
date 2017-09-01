import * as _ from 'lodash'
import utils from '../../utils'
import router from '../../router'

import MissionsApi from '../../api/missions'

const limits = {
  missions: 10,
  missionSlotRegistrations: 10
}

const state = {
  checkingMissionSlugAvailability: false,
  missionDetails: null,
  missions: null,
  missionSlotDetails: null,
  missionSlotGroupDetails: null,
  missionSlotGroups: null,
  missionSlotlistFilter: {},
  missionSlotRegistrationDetails: null,
  missionSlotRegistrations: null,
  missionSlugAvailable: false,
  totalMissions: 0,
  totalMissionSlotRegistrations: 0
}

const getters = {
  checkingMissionSlugAvailability() {
    return state.checkingMissionSlugAvailability
  },
  missionDetails() {
    return state.missionDetails
  },
  missions() {
    return state.missions
  },
  missionSlotDetails() {
    return state.missionSlotDetails
  },
  missionSlotGroupDetails() {
    return state.missionSlotGroupDetails
  },
  missionSlotGroups() {
    if (_.isEmpty(_.keys(state.missionSlotlistFilter))) {
      return state.missionSlotGroups
    }

    const filteredSlotGroups = []
    _.each(state.missionSlotGroups, (slotGroup) => {
      const filteredSlots = []
      _.each(slotGroup.slots, (slot) => {
        if (_.has(state.missionSlotlistFilter, 'assigned') && !_.isNil(slot.assignee)) {
          filteredSlots.push(slot)
        } else if (_.has(state.missionSlotlistFilter, 'hasRegistrations') && _.isNil(slot.assignee) && slot.registrationCount > 0) {
          filteredSlots.push(slot)
        } else if (_.has(state.missionSlotlistFilter, 'open') && _.isNil(slot.assignee) && slot.registrationCount <= 0) {
          filteredSlots.push(slot)
        }
      })

      filteredSlotGroups.push(_.defaults({
        slots: filteredSlots
      }, slotGroup))
    })

    return filteredSlotGroups
  },
  missionSlotRegistrationDetails() {
    return state.missionSlotRegistrationDetails
  },
  missionSlotRegistrations() {
    return state.missionSlotRegistrations
  },
  missionSlotRegistrationsPageCount() {
    return Math.ceil(state.totalMissionSlotRegistrations / limits.missionSlotRegistrations)
  },
  missionSlugAvailable() {
    return state.missionSlugAvailable
  },
  missionsPageCount() {
    return Math.ceil(state.totalMissions / limits.missions)
  }
}

const actions = {
  checkMissionSlugAvailability({ commit, dispatch }, payload) {
    commit({
      type: 'startCheckingMissionSlugAvailability'
    })

    return MissionsApi.checkMissionSlugAvailability(payload)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Checking mission slug availability failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.available)) {
          console.error(response)
          throw 'Received invalid mission slug availability status'
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
  clearMissionDetails({ commit }) {
    commit({
      type: 'clearMissionDetails'
    })
  },
  clearMissions({ commit }) {
    commit({
      type: 'clearMissions'
    })
  },
  clearMissionSlotDetails({ commit }) {
    commit({
      type: 'clearMissionSlotDetails'
    })
  },
  clearMissionSlotGroupDetails({ commit }) {
    commit({
      type: 'clearMissionSlotGroupDetails'
    })
  },
  createMission({ dispatch }, payload) {
    dispatch('startWorking', 'Creating missions...')

    return MissionsApi.createMission(payload)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Creating mission failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.mission) || !_.isObject(response.data.mission)) {
          console.error(response)
          throw 'Received invalid mission'
        }

        dispatch('stopWorking')

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
        dispatch('stopWorking')

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
  createMissionSlot({ dispatch }, payload) {
    dispatch('startWorking', 'Creating slot...')

    return MissionsApi.createMissionSlot(payload.missionSlug, payload.slotDetails)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Creating mission slot failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.slots) || !_.isArray(response.data.slots) || _.isEmpty(response.data.slots)) {
          console.error(response)
          throw 'Received invalid mission slot'
        }

        dispatch('getMissionSlotlist', payload.missionSlug)

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully created slot <strong>#${payload.slotDetails.orderNumber + 1} ${payload.slotDetails.title}</strong>`
        })
      }).catch((error) => {
        dispatch('stopWorking')

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
  deleteMission({ dispatch }, payload) {
    dispatch('startWorking', 'Deleting mission...')

    return MissionsApi.deleteMission(payload.missionSlug)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Deleting mission failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (response.data.success !== true) {
          console.error(response)
          throw 'Received invalid mission deletion'
        }

        dispatch('stopWorking')

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully deleted mission <strong>${payload.missionTitle}</strong>`
        })

        router.push({ name: 'missionList' })
      }).catch((error) => {
        dispatch('stopWorking')

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
  deleteMissionSlot({ dispatch }, payload) {
    dispatch('startWorking', 'Deleting slot...')

    return MissionsApi.deleteMissionSlot(payload.missionSlug, payload.slotUid)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Deleting mission slot failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (response.data.success !== true) {
          console.error(response)
          throw 'Received invalid mission slot deletion'
        }

        dispatch('getMissionSlotlist', payload.missionSlug)

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully deleted slot <strong>#${payload.slotOrderNumber} ${payload.slotTitle}</strong>`
        })
      }).catch((error) => {
        dispatch('stopWorking')

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
  deleteMissionSlotGroup({ dispatch }, payload) {
    dispatch('startWorking', 'Deleting slot group...')

    return MissionsApi.deleteMissionSlotGroup(payload.missionSlug, payload.slotGroupUid)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Deleting mission slot group failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (response.data.success !== true) {
          console.error(response)
          throw 'Received invalid mission slot group deletion'
        }

        dispatch('getMissionSlotlist', payload.missionSlug)

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully deleted slot group <strong>${payload.slotGroupTitle}</strong>`
        })
      }).catch((error) => {
        dispatch('stopWorking')

        if (error.response) {
          console.error('deleteMissionSlotGroup', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to delete slot group <strong>${payload.slotGroupTitle}</strong> - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('deleteMissionSlotGroup', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to delete slot group <strong>${payload.slotGroupTitle}</strong> - Request failed`
          })
        } else {
          console.error('deleteMissionSlotGroup', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to delete slot group <strong>${payload.slotGroupTitle}</strong> - Something failed...`
          })
        }
      })
  },
  editMission({ commit, dispatch }, payload) {
    dispatch('startWorking', 'Editing mission...')

    return MissionsApi.editMission(payload.missionSlug, payload.updatedMissionDetails)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Editing mission failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.mission) || !_.isObject(response.data.mission)) {
          console.error(response)
          throw 'Received invalid mission'
        }

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully edited mission <strong>${payload.missionTitle}</strong>`
        })

        dispatch('stopWorking')

        commit({
          type: 'setMissionDetails',
          mission: response.data.mission
        })
      }).catch((error) => {
        dispatch('stopWorking')

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
  editMissionSlot({ dispatch }, payload) {
    dispatch('startWorking', 'Editing slot...')

    return MissionsApi.editMissionSlot(payload.missionSlug, payload.slotUid, payload.updatedSlotDetails)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Editing mission slot failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.slot) || !_.isObject(response.data.slot)) {
          console.error(response)
          throw 'Received invalid mission slot'
        }

        dispatch('getMissionSlotlist', payload.missionSlug)

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully edited slot <strong>#${payload.slotOrderNumber} ${payload.slotTitle}</strong>`
        })
      }).catch((error) => {
        dispatch('stopWorking')

        if (error.response) {
          console.error('editMissionSlot', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to edit slot <strong>#${payload.slotOrderNumber} ${payload.slotTitle}</strong> - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('editMissionSlot', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to edit slot <strong>#${payload.slotOrderNumber} ${payload.slotTitle}</strong> - Request failed`
          })
        } else {
          console.error('editMissionSlot', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to edit slot <strong>#${payload.slotOrderNumber} ${payload.slotTitle}</strong> - Something failed...`
          })
        }
      })
  },
  filterMissionSlotlist({ commit }, payload) {
    commit({
      type: 'setMissionSlotlistFilter',
      missionSlotlistFilter: payload
    })
  },
  getMissionDetails({ commit, dispatch }, payload) {
    dispatch('startWorking', 'Loading mission details...')

    return MissionsApi.getMissionDetails(payload.missionSlug)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw 'Retrieving mission details failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.mission) || !_.isObject(response.data.mission)) {
          console.error(response)
          throw 'Received invalid mission'
        }

        commit({
          type: 'setMissionDetails',
          mission: response.data.mission
        })

        dispatch('stopWorking')
      }).catch((error) => {
        dispatch('stopWorking')

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
  getMissions({ commit, dispatch }, payload) {
    dispatch('startWorking', 'Loading missions...')

    if (_.isNil(payload)) {
      payload = { page: 1 }
    } else if (_.isNil(payload.page)) {
      payload.page = 1
    }

    return MissionsApi.getMissions(limits.missions, (payload.page - 1) * limits.missions)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw 'Retrieving missions failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.missions) || !_.isArray(response.data.missions)) {
          console.error(response)
          throw 'Received invalid missions'
        }

        commit({
          type: 'setMissions',
          missions: response.data.missions,
          total: response.data.total
        })

        dispatch('stopWorking')
      }).catch((error) => {
        dispatch('stopWorking')

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
  getMissionSlotlist({ commit, dispatch }, payload) {
    dispatch('startWorking', 'Loading mission slotlist...')

    return MissionsApi.getMissionSlotlist(payload.missionSlug)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw 'Retrieving mission slotlist failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.slotGroups) || !_.isObject(response.data.slotGroups)) {
          console.error(response)
          throw 'Received invalid mission slotlist'
        }

        commit({
          type: 'setMissionSlotlist',
          slotGroups: response.data.slotGroups
        })

        dispatch('stopWorking')
      }).catch((error) => {
        dispatch('stopWorking')

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
  getMissionSlotRegistrations({ commit, dispatch }, payload) {
    dispatch('startWorking', 'Loading slot registrations...')

    if (_.isNil(payload.page)) {
      payload.page = 1
    }

    return MissionsApi.getMissionSlotRegistrations(payload.missionSlug, payload.slotUid, limits.missionSlotRegistrations, (payload.page - 1) * limits.missionSlotRegistrations)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Retrieving mission slot registrations failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.registrations) || !_.isArray(response.data.registrations)) {
          console.error(response)
          throw 'Received invalid mission slot registrations'
        }

        commit({
          type: 'setMissionSlotRegistrations',
          registrations: response.data.registrations,
          total: response.data.total
        })

        dispatch('stopWorking')
      }).catch((error) => {
        dispatch('stopWorking')

        if (error.response) {
          console.error('getMissionSlotRegistrations', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to retrieve registrations for slot <strong>#${payload.slotOrderNumber} ${payload.slotTitle}</strong> - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('getMissionSlotRegistrations', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to register for slot <strong>#${payload.slotOrderNumber} ${payload.slotTitle}</strong> - Request failed`
          })
        } else {
          console.error('getMissionSlotRegistrations', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to register for slot <strong>#${payload.slotOrderNumber} ${payload.slotTitle}</strong> - Something failed...`
          })
        }
      })
  },
  modifyMissionSlotRegistration({ dispatch }, payload) {
    dispatch('startWorking', 'Editing slot registration...')

    return MissionsApi.modifyMissionSlotRegistration(payload.missionSlug, payload.slotUid, payload.registrationUid, payload.confirm)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Modifying mission slot registration failed'
        }


        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.registration) || !_.isObject(response.data.registration)) {
          console.error(response)
          throw 'Received invalid mission slot registration'
        }

        dispatch('getMissionSlotlist', payload.missionSlug)

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully modified slot registration`
        })
      }).catch((error) => {
        dispatch('stopWorking')

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
  registerForMissionSlot({ dispatch }, payload) {
    dispatch('startWorking', 'Registering for slot...')

    const comment = _.isNil(payload.comment) || _.isEmpty(payload.comment) ? null : payload.comment

    return MissionsApi.registerForMissionSlot(payload.missionSlug, payload.slotUid, comment)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Registering for mission slot failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.registration) || !_.isObject(response.data.registration)) {
          console.error(response)
          throw 'Received invalid mission slot registration'
        }

        dispatch('getMissionSlotlist', payload.missionSlug)

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully registered for slot <strong>#${payload.slotOrderNumber} ${payload.slotTitle}</strong>`
        })
      }).catch((error) => {
        dispatch('stopWorking')

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
  setMissionSlotDetails({ commit }, payload) {
    commit({
      type: 'setMissionSlotDetails',
      slotDetails: payload
    })
  },
  setMissionSlotGroupDetails({ commit }, payload) {
    commit({
      type: 'setMissionSlotGroupDetails',
      slotGroupDetails: payload
    })
  },
  unregisterFromMissionSlot({ dispatch }, payload) {
    dispatch('startWorking', 'Unregistering from slot...')

    return MissionsApi.unregisterFromMissionSlot(payload.missionSlug, payload.slotUid, payload.registrationUid)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Unregistering from mission slot failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (response.data.success !== true) {
          console.error(response)
          throw 'Received invalid mission slot registration deletion'
        }

        dispatch('getMissionSlotlist', payload.missionSlug)

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully unregistered from slot <strong>#${payload.slotOrderNumber} ${payload.slotTitle}</strong>`
        })
      }).catch((error) => {
        dispatch('stopWorking')

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
  clearMissions(state) {
    state.missions = null
    state.totalMissions = 0
  },
  clearMissionDetails(state) {
    state.missionDetails = null
    state.missionSlotDetails = null
    state.missionSlotGroupDetails = null
    state.missionSlotGroups = null
    state.missionSlotRegistrations = null
    state.totalMissionSlotRegistrations = 0
  },
  clearMissionSlotDetails(state) {
    state.missionSlotDetails = null
  },
  clearMissionSlotGroupDetails(state) {
    state.missionSlotGroupDetails = null
  },
  setMissionDetails(state, payload) {
    state.missionDetails = payload.mission
    utils.setTitle(`Mission ${state.missionDetails.title}`)
  },
  setMissions(state, payload) {
    state.missions = payload.missions
    state.totalMissions = payload.total
  },
  setMissionSlugAvailability(state, payload) {
    state.checkingMissionSlugAvailability = false
    state.missionSlugAvailable = payload.available
  },
  setMissionSlotDetails(state, payload) {
    state.missionSlotDetails = payload.slotDetails
  },
  setMissionSlotGroupDetails(state, payload) {
    state.missionSlotGroupDetails = payload.slotGroupDetails
  },
  setMissionSlotlist(state, payload) {
    state.missionSlotGroups = payload.slotGroups
  },
  setMissionSlotlistFilter(state, payload) {
    const filter = {}
    _.each(payload.missionSlotlistFilter, (f) => {
      filter[f] = true
    })

    state.missionSlotlistFilter = filter
  },
  setMissionSlotRegistrations(state, payload) {
    state.missionSlotRegistrations = payload.registrations
    state.totalMissionSlotRegistrations = payload.total
  },
  startCheckingMissionSlugAvailability(state) {
    state.checkingMissionSlugAvailability = true
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
