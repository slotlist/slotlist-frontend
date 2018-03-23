import { i18n } from '../../app'
import * as _ from 'lodash'
import utils from '../../utils'
import router from '../../router'
import Raven from 'raven-js'
import moment from 'moment-timezone'

import MissionsApi from '../../api/missions'

const limits = {
  missionAccesses: 10,
  missionPermissions: 10,
  missions: 10,
  missionSlotRegistrations: 10
}

const intervals = {
  missionsRefresh: 300000,
  missionsForCalendarRefresh: 300000
}

const state = {
  checkingMissionSlugAvailability: false,
  missionAccesses: null,
  missionCalendarCurrentMonth: null,
  missionDetails: null,
  missionListFilter: {},
  missionListRequiredDLCsFilter: [],
  missionPermissions: null,
  missionToken: null,
  missions: null,
  missionsForCalendar: null,
  missionsForCalendarRefreshSetInterval: null,
  missionSlotDetails: null,
  missionSlotGroupDetails: null,
  missionSlotGroups: null,
  missionSlotlistFilter: {},
  missionSlotlistRequiredDLCsFilter: [],
  missionSlotRegistrationDetails: null,
  missionSlotRegistrations: null,
  missionSlotRegistrationSuppressNotifications: false,
  missionSlotSelection: [],
  missionSlugAvailable: false,
  missionsRefreshSetInterval: null,
  refreshingMissions: false,
  refreshingMissionsForCalendar: false,
  searchingMissions: false,
  totalMissionAccesses: 0,
  totalMissionPermissions: 0,
  totalMissions: 0,
  totalMissionSlotRegistrations: 0
}

const getters = {
  checkingMissionSlugAvailability() {
    return state.checkingMissionSlugAvailability
  },
  missionAccesses() {
    return state.missionAccesses
  },
  missionAccessesPageCount() {
    return Math.ceil(state.totalMissionAccesses / limits.missionAccesses)
  },
  missionCalendarCurrentMonth() {
    return state.missionCalendarCurrentMonth
  },
  missionDetails() {
    return state.missionDetails
  },
  missionListFilter() {
    return _.keys(state.missionListFilter)
  },
  missionListRequiredDLCsFilter() {
    return state.missionListRequiredDLCsFilter
  },
  missionPermissions() {
    return state.missionPermissions
  },
  missionPermissionsPageCount() {
    return Math.ceil(state.totalMissionPermissions / limits.missionPermissions)
  },
  missions() {
    if ((_.isEmpty(_.keys(state.missionListFilter)) ||
      (_.keys(state.missionListFilter).length === 1 && _.has(state.missionListFilter, 'ended'))) &&
      _.isEmpty(state.missionListRequiredDLCsFilter)) {
      return state.missions
    }

    function missionListFilter(mission) {
      if (_.isEmpty(_.keys(state.missionListFilter)) || (_.keys(state.missionListFilter).length === 1 && _.has(state.missionListFilter, 'ended'))) {
        return true
      }

      if (_.has(state.missionListFilter, 'assigned') && mission.isAssignedToAnySlot) {
        return true
      } else if (_.has(state.missionListFilter, 'registered') && mission.isRegisteredForAnySlot) {
        return true
      }

      return false
    }

    function missionListRequiredDLCsFilter(mission) {
      if (_.isEmpty(state.missionListRequiredDLCsFilter)) {
        return true
      }

      if (_.isEmpty(mission.requiredDLCs)) {
        return false
      }

      return _.every(state.missionListRequiredDLCsFilter, (filter) => {
        return _.indexOf(mission.requiredDLCs, filter) >= 0
      })
    }

    const filteredMissions = []
    _.each(state.missions, (mission) => {
      if (missionListFilter(mission) && missionListRequiredDLCsFilter(mission)) {
        filteredMissions.push(mission)
      }
    })

    return filteredMissions
  },
  missionsForCalendar() {
    return state.missionsForCalendar
  },
  missionsForCalendarRefreshSetInterval() {
    return state.missionsForCalendarRefreshSetInterval
  },
  missionSlotDetails() {
    return state.missionSlotDetails
  },
  missionSlotGroupDetails() {
    return state.missionSlotGroupDetails
  },
  missionSlotGroups() {
    if (_.isEmpty(_.keys(state.missionSlotlistFilter)) && _.isEmpty(state.missionSlotlistRequiredDLCsFilter)) {
      return state.missionSlotGroups
    }

    function slotlistFilter(slot) {
      if (_.isEmpty(_.keys(state.missionSlotlistFilter))) {
        return true
      }

      if (_.has(state.missionSlotlistFilter, 'assigned') && (!_.isNil(slot.assignee) || !_.isNil(slot.externalAssignee))) {
        return true
      } else if (_.has(state.missionSlotlistFilter, 'hasRegistrations') && _.isNil(slot.assignee) && slot.registrationCount > 0) {
        return true
      } else if (_.has(state.missionSlotlistFilter, 'open') && _.isNil(slot.assignee) && slot.registrationCount <= 0 && !slot.blocked) {
        return true
      } else if (_.has(state.missionSlotlistFilter, 'blocked') && slot.blocked) {
        return true
      } else if (_.has(state.missionSlotlistFilter, 'restricted') && !_.isNil(slot.restrictedCommunity)) {
        return true
      }

      return false
    }

    function slotlistRequiredDLCsFilter(slot) {
      if (_.isEmpty(state.missionSlotlistRequiredDLCsFilter)) {
        return true
      }

      if (_.isEmpty(slot.requiredDLCs)) {
        return false
      }

      return _.every(state.missionSlotlistRequiredDLCsFilter, (filter) => {
        return _.indexOf(slot.requiredDLCs, filter) >= 0
      })
    }

    const filteredSlotGroups = []
    _.each(state.missionSlotGroups, (slotGroup) => {
      const filteredSlots = []

      _.each(slotGroup.slots, (slot) => {
        if (slotlistFilter(slot) && slotlistRequiredDLCsFilter(slot)) {
          filteredSlots.push(slot)
        }
      })

      filteredSlotGroups.push(_.defaults({
        slots: filteredSlots
      }, slotGroup))
    })

    return filteredSlotGroups
  },
  missionSlotlistFilter() {
    return _.keys(state.missionSlotlistFilter)
  },
  missionSlotlistRequiredDLCsFilter() {
    return state.missionSlotlistRequiredDLCsFilter
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
  missionSlotRegistrationSuppressNotifications() {
    return state.missionSlotRegistrationSuppressNotifications
  },
  missionSlotSelection() {
    return state.missionSlotSelection
  },
  missionSlugAvailable() {
    return state.missionSlugAvailable
  },
  missionsPageCount() {
    return Math.ceil(state.totalMissions / limits.missions)
  },
  missionToken() {
    return state.missionToken
  },
  refreshingMissions() {
    return state.refreshingMissions
  },
  refreshingMissionsForCalendar() {
    return state.refreshingMissionsForCalendar
  },
  searchingMissions() {
    return state.searchingMissions
  },
  selectedMissionSlots() {
    const slots = []

    _.each(state.missionSlotGroups, (slotGroup) => {
      const matchedSlots = _.filter(slotGroup.slots, (slot) => _.indexOf(state.missionSlotSelection, slot.uid) >= 0)

      if (!_.isEmpty(matchedSlots)) {
        slots.push(...matchedSlots)
      }
    })

    return slots
  },
  unfilteredMissionSlotGroups() {
    return state.missionSlotGroups
  }
}

const actions = {
  addMissionAccess({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.addMissionAccess'))

    return MissionsApi.addMissionAccess(payload.missionSlug, payload.missionAccessDetails)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Creating mission access failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.access) || !_.isObject(response.data.access)) {
          console.error(response)
          throw 'Received invalid mission access'
        }

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.addMissionAccess.success')}`
        })

        dispatch('getMissionAccesses', { missionSlug: payload.missionSlug })

        dispatch('stopWorking', i18n.t('store.addMissionAccess'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.addMissionAccess'))

        if (error.response) {
          console.error('addMissionAccess', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.addMissionAccess.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'addMissionAccess' } }) : null
          console.error('addMissionAccess', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.addMissionAccess.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'addMissionAccess' } }) : null
          console.error('addMissionAccess', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.addMissionAccess.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  addMissionPermission({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.addMissionPermission'))

    if (_.isNil(payload.suppressNotifications)) {
      payload.suppressNotifications = false
    }

    return MissionsApi.addMissionPermission(payload.missionSlug, payload.permissionDetails, payload.suppressNotifications)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Creating mission permission failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.permission) || !_.isObject(response.data.permission)) {
          console.error(response)
          throw 'Received invalid mission permission'
        }

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.addMissionPermission.success')}`
        })

        dispatch('getMissionPermissions', { missionSlug: payload.missionSlug })

        dispatch('stopWorking', i18n.t('store.addMissionPermission'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.addMissionPermission'))

        if (error.response) {
          console.error('addMissionPermission', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.addMissionPermission.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'addMissionPermission' } }) : null
          console.error('addMissionPermission', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.addMissionPermission.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'addMissionPermission' } }) : null
          console.error('addMissionPermission', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.addMissionPermission.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  applySlotTemplateToMission({ dispatch, commit }, payload) {
    dispatch('startWorking', i18n.t('store.applySlotTemplateToMission'))

        return MissionsApi.applySlotTemplateToMission(payload.missionSlug, payload.slotTemplateUid, payload.insertAfter)
          .then((response) => {
            if (response.status !== 200) {
              console.error(response)
              throw 'Applying slot template to mission failed'
            }

            if (_.isEmpty(response.data)) {
              console.error(response)
              throw 'Received empty response'
            }

            if (_.isNil(response.data.slotGroups) || !_.isArray(response.data.slotGroups)) {
              console.error(response)
              throw 'Received invalid slot template application'
            }

            dispatch('showAlert', {
              showAlert: true,
              alertVariant: 'success',
              alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.applySlotTemplateToMission.success')}`
            })

            commit({
              type: 'setMissionSlotlist',
              slotGroups: response.data.slotGroups
            })

            dispatch('stopWorking', i18n.t('store.applySlotTemplateToMission'))
          }).catch((error) => {
            dispatch('stopWorking', i18n.t('store.applySlotTemplateToMission'))

            if (error.response) {
              console.error('applySlotTemplateToMission', error.response)
              dispatch('showAlert', {
                showAlert: true,
                alertVariant: 'danger',
                alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.applySlotTemplateToMission.error')} - ${error.response.data.message}`
              })
            } else if (error.request) {
              error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'applySlotTemplateToMission' } }) : null
              console.error('applySlotTemplateToMission', error.request)
              dispatch('showAlert', {
                showAlert: true,
                alertVariant: 'danger',
                alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.applySlotTemplateToMission.error')} - ${i18n.t('failed.request')}`
              })
            } else {
              error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'applySlotTemplateToMission' } }) : null
              console.error('applySlotTemplateToMission', error.message)
              dispatch('showAlert', {
                showAlert: true,
                alertVariant: 'danger',
                alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.applySlotTemplateToMission.error')} - ${i18n.t('failed.something')}`
              })
            }
          })
  },
  assignMissionSlot({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.assignMissionSlot'))

    if (_.isNil(payload.suppressNotifications)) {
      payload.suppressNotifications = false
    }

    return MissionsApi.assignMissionSlot(payload.missionSlug, payload.slotUid, payload.userUid, payload.force, payload.suppressNotifications)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Assigning mission slot failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.slot) || !_.isObject(response.data.slot)) {
          console.error(response)
          throw 'Received invalid mission slot assignment'
        }

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.assignMissionSlot.success')}`
        })

        dispatch('getMissionSlotlist', { missionSlug: payload.missionSlug })

        dispatch('stopWorking', i18n.t('store.assignMissionSlot'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.assignMissionSlot'))

        if (error.response) {
          console.error('assignMissionSlot', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.assignMissionSlot.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'assignMissionSlot' } }) : null
          console.error('assignMissionSlot', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.assignMissionSlot.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'assignMissionSlot' } }) : null
          console.error('assignMissionSlot', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.assignMissionSlot.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  changeMissionCalendarCurrentMonth({ commit }, payload) {
    commit({
      type: 'setMissionCalendarCurrentMonth',
      currentMonth: payload
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
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.checkMissionSlugAvailability', { slug: payload })} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'setMissionSlugAvailability' } }) : null
          console.error('checkMissionSlugAvailability', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.checkMissionSlugAvailability', { slug: payload })} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'setMissionSlugAvailability' } }) : null
          console.error('checkMissionSlugAvailability', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.checkMissionSlugAvailability', { slug: payload })} - ${i18n.t('failed.something')}`
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
  clearMissionSlotSelection({ commit }) {
    commit({
      type: 'clearMissionSlotSelection'
    })
  },
  createMission({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.createMission'))

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

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.createMission.success', { title: payload.title })}`,
          persistentAlert: true
        })

        router.push({
          name: 'missionDetails',
          params: { missionSlug: response.data.mission.slug }
        })

        dispatch('stopWorking', i18n.t('store.createMission'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.createMission'))

        if (error.response) {
          console.error('createMission', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.createMission.error', { title: payload.title })} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'createMission' } }) : null
          console.error('createMission', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.createMission.error', { title: payload.title })} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'createMission' } }) : null
          console.error('createMission', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.createMission.error', { title: payload.title })} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  createMissionSlot({ dispatch }, payload) {
    const slotCount = _.isArray(payload.slotDetails) ? payload.slotDetails.length : 1

    dispatch('startWorking', i18n.tc('store.createMissionSlot', slotCount, { count: slotCount }))

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

        dispatch('getMissionSlotlist', { missionSlug: payload.missionSlug })

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.tc('store.createMissionSlot.success', slotCount, { count: slotCount })}`
        })

        dispatch('stopWorking', i18n.tc('store.createMissionSlot', slotCount, { count: slotCount }))
      }).catch((error) => {
        dispatch('stopWorking', i18n.tc('store.createMissionSlot', slotCount, { count: slotCount }))

        if (error.response) {
          console.error('createMissionSlot', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.tc('store.createMissionSlot.error', slotCount, { count: slotCount })} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'createMissionSlot' } }) : null
          console.error('createMissionSlot', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.tc('store.createMissionSlot.error', slotCount, { count: slotCount })} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'createMissionSlot' } }) : null
          console.error('createMissionSlot', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.tc('store.createMissionSlot.error', slotCount, { count: slotCount })} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  createMissionSlotGroup({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.createMissionSlotGroup'))

    return MissionsApi.createMissionSlotGroup(payload.missionSlug, payload.slotGroupDetails)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Creating mission slot group failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.slotGroup) || !_.isObject(response.data.slotGroup)) {
          console.error(response)
          throw 'Received invalid mission slot group'
        }

        dispatch('getMissionSlotlist', { missionSlug: payload.missionSlug })

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.createMissionSlotGroup.success', { slotInfo: `#${payload.slotGroupDetails.orderNumber} ${payload.slotGroupDetails.title}` })}`
        })

        dispatch('stopWorking', i18n.t('store.createMissionSlotGroup'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.createMissionSlotGroup'))

        if (error.response) {
          console.error('createMissionSlotGroup', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.createMissionSlotGroup.error', { slotInfo: `#${payload.slotGroupDetails.orderNumber} ${payload.slotGroupDetails.title}` })} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'createMissionSlotGroup' } }) : null
          console.error('createMissionSlotGroup', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.createMissionSlotGroup.error', { slotInfo: `#${payload.slotGroupDetails.orderNumber} ${payload.slotGroupDetails.title}` })} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'createMissionSlotGroup' } }) : null
          console.error('createMissionSlotGroup', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.createMissionSlotGroup.error', { slotInfo: `#${payload.slotGroupDetails.orderNumber} ${payload.slotGroupDetails.title}` })} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  deleteMission({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.deleteMission'))

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

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.deleteMission.success', { title: payload.missionTitle })}`,
          persistentAlert: true
        })

        dispatch('getMissions', { autoRefresh: true })

        router.push({ name: 'missionList' })

        dispatch('stopWorking', i18n.t('store.deleteMission'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.deleteMission'))

        if (error.response) {
          console.error('deleteMission', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMission.error', { title: payload.missionTitle })} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'deleteMission' } }) : null
          console.error('deleteMission', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMission.error', { title: payload.missionTitle })} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'deleteMission' } }) : null
          console.error('deleteMission', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMission.error', { title: payload.missionTitle })} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  deleteMissionAccess({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.deleteMissionAccess'))

    return MissionsApi.deleteMissionAccess(payload.missionSlug, payload.missionAccessUid)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Deleting mission access failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (response.data.success !== true) {
          console.error(response)
          throw 'Received invalid mission access deletion'
        }

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.deleteMissionAccess.success')}`
        })

        dispatch('getMissionAccesses', { missionSlug: payload.missionSlug })

        dispatch('stopWorking', i18n.t('store.deleteMissionAccess'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.deleteMissionAccess'))

        if (error.response) {
          console.error('deleteMissionAccess', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionAccess.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'deleteMissionAccess' } }) : null
          console.error('deleteMissionAccess', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionAccess.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'deleteMissionAccess' } }) : null
          console.error('deleteMissionAccess', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionAccess.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  deleteMissionBannerImage({ dispatch, commit, state }, payload) {
    dispatch('startWorking', i18n.t('store.deleteMissionBannerImage'))

    return MissionsApi.deleteMissionBannerImage(payload.missionSlug)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Deleting mission banner image failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (response.data.success !== true) {
          console.error(response)
          throw 'Received invalid mission banner image deletion'
        }

        const updatedMissionDetails = state.missionDetails
        updatedMissionDetails.bannerImageUrl = null

        commit({
          type: 'setMissionDetails',
          mission: updatedMissionDetails
        })

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.deleteMissionBannerImage.success')}`,
          scrollToTop: true
        })

        dispatch('stopWorking', i18n.t('store.deleteMissionBannerImage'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.deleteMissionBannerImage'))

        if (error.response) {
          console.error('deleteMissionBannerImage', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionBannerImage.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'deleteMissionBannerImage' } }) : null
          console.error('deleteMissionBannerImage', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionBannerImage.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'deleteMissionBannerImage' } }) : null
          console.error('deleteMissionBannerImage', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionBannerImage.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  deleteMissionPermission({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.deleteMissionPermission'))

    return MissionsApi.deleteMissionPermission(payload.missionSlug, payload.permissionUid)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Deleting mission permission failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (response.data.success !== true) {
          console.error(response)
          throw 'Received invalid mission permission deletion'
        }

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.deleteMissionPermission.success')}`
        })

        dispatch('getMissionPermissions', { missionSlug: payload.missionSlug })

        dispatch('stopWorking', i18n.t('store.deleteMissionPermission'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.deleteMissionPermission'))

        if (error.response) {
          console.error('deleteMissionPermission', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionPermission.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'deleteMissionPermission' } }) : null
          console.error('deleteMissionPermission', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionPermission.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'deleteMissionPermission' } }) : null
          console.error('deleteMissionPermission', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionPermission.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  deleteMissionSlot({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.deleteMissionSlot'))

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

        dispatch('getMissionSlotlist', { missionSlug: payload.missionSlug })

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.deleteMissionSlot.success', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })}`
        })

        dispatch('stopWorking', i18n.t('store.deleteMissionSlot'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.deleteMissionSlot'))

        if (error.response) {
          console.error('deleteMissionSlot', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionSlot.error', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'deleteMissionSlot' } }) : null
          console.error('deleteMissionSlot', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionSlot.error', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'deleteMissionSlot' } }) : null
          console.error('deleteMissionSlot', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionSlot.error', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  deleteMissionSlotGroup({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.deleteMissionSlotGroup'))

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

        dispatch('getMissionSlotlist', { missionSlug: payload.missionSlug })

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.deleteMissionSlotGroup.success', { title: payload.slotGroupTitle })}`
        })

        dispatch('stopWorking', i18n.t('store.deleteMissionSlotGroup'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.deleteMissionSlotGroup'))

        if (error.response) {
          console.error('deleteMissionSlotGroup', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionSlotGroup.error', { title: payload.slotGroupTitle })} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'deleteMissionSlotGroup' } }) : null
          console.error('deleteMissionSlotGroup', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionSlotGroup.error', { title: payload.slotGroupTitle })} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'deleteMissionSlotGroup' } }) : null
          console.error('deleteMissionSlotGroup', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionSlotGroup.error', { title: payload.slotGroupTitle })} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  deleteMissionToken({ dispatch, commit }, payload) {
    dispatch('startWorking', i18n.t('store.deleteMissionToken'))

    return MissionsApi.deleteMissionToken(payload.missionSlug)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Deleting mission token failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (response.data.success !== true) {
          console.error(response)
          throw 'Received invalid mission token deletion'
        }

        commit({
          type: 'clearMissionToken'
        })

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.deleteMissionToken.success')}`
        })

        dispatch('stopWorking', i18n.t('store.deleteMissionToken'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.deleteMissionToken'))

        if (error.response) {
          console.error('deleteMissionToken', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionToken.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'deleteMissionToken' } }) : null
          console.error('deleteMissionToken', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionToken.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'deleteMissionToken' } }) : null
          console.error('deleteMissionToken', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionToken.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  deleteSelectedMissionSlots({ dispatch, state }, payload) {
    const selectedSlotCount = state.missionSlotSelection.length

    dispatch('startWorking', i18n.tc('store.deleteSelectedMissionSlots', selectedSlotCount, { count: selectedSlotCount }))

    return Promise.each(state.missionSlotSelection, (slotUid) => {
      return MissionsApi.deleteMissionSlot(payload.missionSlug, slotUid)
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
        })
    }).then(() => {
      dispatch('clearMissionSlotSelection')

      dispatch('getMissionSlotlist', { missionSlug: payload.missionSlug })

      dispatch('showAlert', {
        showAlert: true,
        alertVariant: 'success',
        alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.tc('store.deleteSelectedMissionSlots.success', selectedSlotCount, { count: selectedSlotCount })}`
      })

      dispatch('stopWorking', i18n.tc('store.deleteSelectedMissionSlots', selectedSlotCount, { count: selectedSlotCount }))
    }).catch((error) => {
      dispatch('stopWorking', i18n.tc('store.deleteSelectedMissionSlots', selectedSlotCount, { count: selectedSlotCount }))

      if (error.response) {
        console.error('deleteSelectedMissionSlots', error.response)
        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'danger',
          alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteSelectedMissionSlots.error')} - ${error.response.data.message}`
        })
      } else if (error.request) {
        error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'deleteSelectedMissionSlots' } }) : null
        console.error('deleteSelectedMissionSlots', error.request)
        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'danger',
          alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteSelectedMissionSlots.error')} - ${i18n.t('failed.request')}`
        })
      } else {
        error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'deleteSelectedMissionSlots' } }) : null
        console.error('deleteSelectedMissionSlots', error.message)
        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'danger',
          alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteSelectedMissionSlots.error')} - ${i18n.t('failed.something')}`
        })
      }
    })
  },
  duplicateMission({ dispatch, commit }, payload) {
    dispatch('startWorking', i18n.t('store.duplicateMission'))

    return MissionsApi.duplicateMission(payload.missionSlug, payload.missionDuplicatePayload)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Duplicating mission failed'
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
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.duplicateMission.success')}`,
          scrollToTop: true,
          persistentAlert: true
        })

        router.push({
          name: 'missionDetails',
          params: { missionSlug: response.data.mission.slug }
        })

        commit({
          type: 'setMissionDetails',
          mission: response.data.mission
        })

        dispatch('stopWorking', i18n.t('store.duplicateMission'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.duplicateMission'))

        if (error.response) {
          console.error('duplicateMission', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.duplicateMission.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'duplicateMission' } }) : null
          console.error('duplicateMission', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.duplicateMission.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'duplicateMission' } }) : null
          console.error('duplicateMission', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.duplicateMission.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  duplicateMissionSlotGroup({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.duplicateMissionSlotGroup'))

    const slotGroupDetails = {
      description: payload.missionSlotGroup.description,
      title: payload.missionSlotGroup.title,
      insertAfter: payload.missionSlotGroup.orderNumber
    }

    return MissionsApi.createMissionSlotGroup(payload.missionSlug, slotGroupDetails)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Creating mission slot group failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.slotGroup) || !_.isObject(response.data.slotGroup)) {
          console.error(response)
          throw 'Received invalid mission slot group'
        }

        const slotGroupUid = response.data.slotGroup.uid

        const slotDetails = _.map(payload.missionSlotGroup.slots, (slot) => {
          return {
            detailedDescription: slot.detailedDescription,
            difficulty: slot.difficulty,
            reserve: slot.reserve,
            blocked: slot.blocked,
            restrictedCommunityUid: _.isNil(slot.restrictedCommunity) ? null : slot.restrictedCommunity.uid,
            description: slot.description,
            title: slot.title,
            autoAssignable: slot.autoAssignable,
            requiredDLCs: slot.requiredDLCs,
            insertAfter: _.max([slot.orderNumber - 1, 0]),
            slotGroupUid,
            duplicate: true
          }
        })

        return dispatch('createMissionSlot', { missionSlug: payload.missionSlug, slotDetails })
      }).then(() => {
        dispatch('getMissionSlotlist', { missionSlug: payload.missionSlug })

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.duplicateMissionSlotGroup.success', { slotGroupInfo: `#${payload.missionSlotGroup.orderNumber} ${payload.missionSlotGroup.title}` })}`
        })

        dispatch('stopWorking', i18n.t('store.duplicateMissionSlotGroup'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.duplicateMissionSlotGroup'))

        if (error.response) {
          console.error('duplicateMissionSlotGroup', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.duplicateMissionSlotGroup.error', { slotGroupInfo: `#${payload.missionSlotGroup.orderNumber} ${payload.missionSlotGroup.title}` })} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'duplicateMissionSlotGroup' } }) : null
          console.error('duplicateMissionSlotGroup', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.duplicateMissionSlotGroup.error', { slotGroupInfo: `#${payload.missionSlotGroup.orderNumber} ${payload.missionSlotGroup.title}` })} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'duplicateMissionSlotGroup' } }) : null
          console.error('duplicateMissionSlotGroup', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.duplicateMissionSlotGroup.error', { slotGroupInfo: `#${payload.missionSlotGroup.orderNumber} ${payload.missionSlotGroup.title}` })} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  deleteMissionSlotRegistration({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.deleteMissionSlotRegistration'))

    return MissionsApi.unregisterFromMissionSlot(payload.missionSlug, payload.slotUid, payload.registrationUid)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Deleting mission slot registration failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (response.data.success !== true) {
          console.error(response)
          throw 'Received invalid mission slot registration deletion'
        }

        dispatch('getMissionSlotRegistrations', {
          missionSlug: payload.missionSlug,
          slotUid: payload.slotUid,
          slotOrderNumber: payload.slotOrderNumber,
          slotTitle: payload.slotTitle
        })

        dispatch('getMissionSlotlist', { missionSlug: payload.missionSlug })

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.deleteMissionSlotRegistration.success')}`
        })

        dispatch('stopWorking', i18n.t('store.deleteMissionSlotRegistration'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.deleteMissionSlotRegistration'))

        if (error.response) {
          console.error('deleteMissionSlotRegistration', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionSlotRegistration.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'deleteMissionSlotRegistration' } }) : null
          console.error('deleteMissionSlotRegistration', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionSlotRegistration.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'deleteMissionSlotRegistration' } }) : null
          console.error('deleteMissionSlotRegistration', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionSlotRegistration.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  editMission({ commit, dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.editMission'))

    if (_.isNil(payload.suppressNotifications)) {
      payload.suppressNotifications = false
    }

    return MissionsApi.editMission(payload.missionSlug, payload.updatedMissionDetails, payload.suppressNotifications)
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
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.editMission.success', { title: payload.missionTitle })}`
        })

        commit({
          type: 'setMissionDetails',
          mission: response.data.mission
        })

        dispatch('stopWorking', i18n.t('store.editMission'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.editMission'))

        if (error.response) {
          console.error('editMission', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editMission.error', { title: payload.missionTitle })} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'editMission' } }) : null
          console.error('editMission', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editMission.error', { title: payload.missionTitle })} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'editMission' } }) : null
          console.error('editMission', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editMission.error', { title: payload.missionTitle })} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  editMissionSlot({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.editMissionSlot'))

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

        dispatch('getMissionSlotlist', { missionSlug: payload.missionSlug })

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.editMissionSlot.success', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })}`
        })

        dispatch('stopWorking', i18n.t('store.editMissionSlot'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.editMissionSlot'))

        if (error.response) {
          console.error('editMissionSlot', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editMissionSlot.error', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'editMissionSlot' } }) : null
          console.error('editMissionSlot', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editMissionSlot.error', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'editMissionSlot' } }) : null
          console.error('editMissionSlot', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editMissionSlot.error', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  editMissionSlotGroup({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.editMissionSlotGroup'))

    return MissionsApi.editMissionSlotGroup(payload.missionSlug, payload.slotGroupUid, payload.updatedSlotGroupDetails)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Editing mission slot group failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.slotGroup) || !_.isObject(response.data.slotGroup)) {
          console.error(response)
          throw 'Received invalid mission slot group'
        }

        dispatch('getMissionSlotlist', { missionSlug: payload.missionSlug })

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.editMissionSlotGroup.success')}`
        })

        dispatch('stopWorking', i18n.t('store.editMissionSlotGroup'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.editMissionSlotGroup'))

        if (error.response) {
          console.error('editMissionSlotGroup', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editMissionSlotGroup.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'editMissionSlotGroup' } }) : null
          console.error('editMissionSlotGroup', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editMissionSlotGroup.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'editMissionSlotGroup' } }) : null
          console.error('editMissionSlotGroup', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editMissionSlotGroup.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  editSelectedMissionSlots({ dispatch, state }, payload) {
    const selectedSlotCount = state.missionSlotSelection.length

    dispatch('startWorking', i18n.tc('store.editSelectedMissionSlots', selectedSlotCount, { count: selectedSlotCount }))

    return Promise.each(state.missionSlotSelection, (slotUid) => {
      return MissionsApi.editMissionSlot(payload.missionSlug, slotUid, payload.updatedMissionSlotDetails)
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
      })
    }).then(() => {
      dispatch('getMissionSlotlist', { missionSlug: payload.missionSlug })

      dispatch('showAlert', {
        showAlert: true,
        alertVariant: 'success',
        alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.tc('store.editSelectedMissionSlots.success', selectedSlotCount, { count: selectedSlotCount })}`
      })

      dispatch('stopWorking', i18n.tc('store.editSelectedMissionSlots', selectedSlotCount, { count: selectedSlotCount }))
    }).catch((error) => {
      dispatch('stopWorking', i18n.tc('store.editSelectedMissionSlots', selectedSlotCount, { count: selectedSlotCount }))

      if (error.response) {
        console.error('editSelectedMissionSlots', error.response)
        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'danger',
          alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editSelectedMissionSlots.error')} - ${error.response.data.message}`
        })
      } else if (error.request) {
        error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'editSelectedMissionSlots' } }) : null
        console.error('editSelectedMissionSlots', error.request)
        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'danger',
          alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editSelectedMissionSlots.error')} - ${i18n.t('failed.request')}`
        })
      } else {
        error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'editSelectedMissionSlots' } }) : null
        console.error('editSelectedMissionSlots', error.message)
        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'danger',
          alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editSelectedMissionSlots.error')} - ${i18n.t('failed.something')}`
        })
      }
    })
  },
  filterMissionList({ commit, dispatch, state }, payload) {
    const hadEndedFilter = _.has(state.missionListFilter, 'ended')

    commit({
      type: 'setMissionListFilter',
      missionListFilter: payload
    })

    const hasEndedFilter = _.has(state.missionListFilter, 'ended')
    if ((hadEndedFilter && !hasEndedFilter) || (!hadEndedFilter && hasEndedFilter)) {
      dispatch('getMissions')
    }
  },
  filterMissionListRequiredDLCs({ commit }, payload) {
    commit({
      type: 'setMissionListRequiredDLCsFilter',
      missionListRequiredDLCsFilter: payload
    })
  },
  filterMissionSlotlist({ commit }, payload) {
    commit({
      type: 'setMissionSlotlistFilter',
      missionSlotlistFilter: payload
    })
  },
  filterMissionSlotlistRequiredDLCs({ commit }, payload) {
    commit({
      type: 'setMissionSlotlistRequiredDLCsFilter',
      missionSlotlistRequiredDLCsFilter: payload
    })
  },
  generateMissionToken({ commit, dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.generateMissionToken'))

    return MissionsApi.generateMissionToken(payload.missionSlug)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Generating mission token failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.missionToken) || !_.isString(response.data.missionToken)) {
          console.error(response)
          throw 'Received invalid mission token'
        }

        commit({
          type: 'setMissionToken',
          missionToken: response.data.missionToken
        })

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.generateMissionToken.success')}`
        })

        dispatch('stopWorking', i18n.t('store.generateMissionToken'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.generateMissionToken'))

        if (error.response) {
          console.error('generateMissionToken', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.generateMissionToken.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'generateMissionToken' } }) : null
          console.error('generateMissionToken', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.generateMissionToken.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'generateMissionToken' } }) : null
          console.error('generateMissionToken', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.generateMissionToken.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  getMissionAccesses({ commit, dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.getMissionAccesses'))

    if (_.isNil(payload.page)) {
      payload.page = 1
    }

    return MissionsApi.getMissionAccesses(payload.missionSlug, limits.missionAccesses, (payload.page - 1) * limits.missionAccesses)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw 'Retrieving mission accesses failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.accesses) || !_.isArray(response.data.accesses)) {
          console.error(response)
          throw 'Received invalid mission accesses'
        }

        commit({
          type: 'setMissionAccesses',
          accesses: response.data.accesses,
          total: response.data.total
        })

        dispatch('stopWorking', i18n.t('store.getMissionAccesses'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.getMissionAccesses'))

        if (error.response) {
          console.error('getMissionAccesses', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionAccesses.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'getMissionAccesses' } }) : null
          console.error('getMissionAccesses', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionAccesses.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'getMissionAccesses' } }) : null
          console.error('getMissionAccesses', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionAccesses.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  getMissionDetails({ commit, dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.getMissionDetails'))

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

        dispatch('stopWorking', i18n.t('store.getMissionDetails'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.getMissionDetails'))

        if (error.response) {
          console.error('getMissionDetails', error.response)

          if (error.response.status === 404) {
            dispatch('showAlert', {
              showAlert: true,
              alertVariant: 'warning',
              alertMessage: `<i class="fa fa-question" aria-hidden="true"></i> ${i18n.t('store.getMissionDetails.error.notFound', { slug: payload.missionSlug })}`,
              persistentAlert: true
            })

            return router.push({ name: 'missionList' })
          }

          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionDetails.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'getMissionDetails' } }) : null
          console.error('getMissionDetails', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionDetails.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'getMissionDetails' } }) : null
          console.error('getMissionDetails', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionDetails.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  getMissionPermissions({ commit, dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.getMissionPermissions'))

    if (_.isNil(payload.page)) {
      payload.page = 1
    }

    return MissionsApi.getMissionPermissions(payload.missionSlug, limits.missionPermissions, (payload.page - 1) * limits.missionPermissions)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw 'Retrieving mission permissions failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.permissions) || !_.isArray(response.data.permissions)) {
          console.error(response)
          throw 'Received invalid mission permissions'
        }

        commit({
          type: 'setMissionPermissions',
          permissions: response.data.permissions,
          total: response.data.total
        })

        dispatch('stopWorking', i18n.t('store.getMissionPermissions'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.getMissionPermissions'))

        if (error.response) {
          console.error('getMissionPermissions', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionPermissions.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'getMissionPermissions' } }) : null
          console.error('getMissionPermissions', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionPermissions.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'getMissionPermissions' } }) : null
          console.error('getMissionPermissions', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionPermissions.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  getMissions({ commit, dispatch, state }, payload) {
    commit({
      type: 'refreshingMissions',
      refreshing: true
    })

    if (_.isNil(payload)) {
      payload = { page: 1, silent: false, autoRefresh: false }
    }
    if (_.isNil(payload.page)) {
      payload.page = 1
    }
    if (_.isNil(payload.silent)) {
      payload.silent = false
    }
    if (_.isNil(payload.autoRefresh)) {
      payload.autoRefresh = false
    }

    if (!payload.silent) {
      dispatch('startWorking', i18n.t('store.getMissions'))
    }

    const includeEnded = _.has(state.missionListFilter, 'ended')

    return MissionsApi.getMissions(limits.missions, (payload.page - 1) * limits.missions, includeEnded)
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

        if (!payload.silent) {
          dispatch('stopWorking', i18n.t('store.getMissions'))
        }

        commit({
          type: 'refreshingMissions',
          refreshing: false
        })

        if (payload.autoRefresh) {
          if (!_.isNil(state.missionsRefreshSetInterval)) {
            clearInterval(state.missionsRefreshSetInterval)
          }

          state.missionsRefreshSetInterval = setInterval(() => {
            dispatch('getMissions', { silent: true })
          }, intervals.missionsRefresh)
        }
      }).catch((error) => {
        commit({
          type: 'refreshingMissions',
          refreshing: false
        })

        if (!payload.silent) {
          dispatch('stopWorking', i18n.t('store.getMissions'))
        }

        if (error.response) {
          console.error('getMissions', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissions.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'getMissions' } }) : null
          console.error('getMissions', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissions.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'getMissions' } }) : null
          console.error('getMissions', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissions.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  getMissionsForCalendar({ commit, dispatch, state }, payload) {
    commit({
      type: 'refreshingMissionsForCalendar',
      refreshing: true
    })

    if (_.isNil(payload)) {
      payload = { autoRefresh: false, startDate: moment().startOf('month'), endDate: moment().endOf('month') }
    }
    if (_.isNil(payload.autoRefresh)) {
      payload.autoRefresh = false
    }
    if (_.isNil(payload.startDate)) {
      payload.startDate = moment().startOf('month')
    }
    if (_.isNil(payload.endDate)) {
      payload.endDate = moment().endOf('month')
    }

    return MissionsApi.getMissionsForCalendar(payload.startDate.valueOf(), payload.endDate.valueOf())
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw 'Retrieving missions for calendar failed'
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
          type: 'setMissionsForCalendar',
          missions: response.data.missions
        })

        commit({
          type: 'refreshingMissionsForCalendar',
          refreshing: false
        })

        if (payload.autoRefresh) {
          if (!_.isNil(state.missionsForCalendarRefreshSetInterval)) {
            clearInterval(state.missionsForCalendarRefreshSetInterval)
          }

          state.missionsForCalendarRefreshSetInterval = setInterval(() => {
            dispatch('getMissionsForCalendar', { startDate: payload.startDate, endDate: payload.endDate })
          }, intervals.missionsForCalendarRefresh)
        }
      }).catch((error) => {
        commit({
          type: 'refreshingMissionsForCalendar',
          refreshing: false
        })

        if (error.response) {
          console.error('getMissionsForCalendar', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionsForCalendar.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'getMissionsForCalendar' } }) : null
          console.error('getMissionsForCalendar', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionsForCalendar.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'getMissionsForCalendar' } }) : null
          console.error('getMissionsForCalendar', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionsForCalendar.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  getMissionSlotlist({ commit, dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.getMissionSlotlist'))

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

        if (_.isNil(response.data.slotGroups) || !_.isArray(response.data.slotGroups)) {
          console.error(response)
          throw 'Received invalid mission slotlist'
        }

        commit({
          type: 'setMissionSlotlist',
          slotGroups: response.data.slotGroups
        })

        dispatch('stopWorking', i18n.t('store.getMissionSlotlist'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.getMissionSlotlist'))

        if (error.response) {
          console.error('getMissionSlotlist', error.response)

          if (error.response.status === 404) {
            // Redirect + alert is handled by getMissionDetails endpoint
            return
          }

          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionSlotlist.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'getMissionSlotlist' } }) : null
          console.error('getMissionSlotlist', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionSlotlist.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'getMissionSlotlist' } }) : null
          console.error('getMissionSlotlist', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionSlotlist.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  getMissionSlotRegistrations({ commit, dispatch }, payload) {
    if (_.isNil(payload.page)) {
      payload.page = 1
    } else if (_.isNil(payload.silent)) {
      payload.silent = false
    }

    if (!payload.silent) {
      dispatch('startWorking', i18n.t('store.getMissionSlotRegistrations'))
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

        if (!payload.silent) {
          dispatch('stopWorking', i18n.t('store.getMissionSlotRegistrations'))
        }
      }).catch((error) => {
        if (!payload.silent) {
          dispatch('stopWorking', i18n.t('store.getMissionSlotRegistrations'))
        }

        if (error.response) {
          console.error('getMissionSlotRegistrations', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionSlotRegistrations.error', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'getMissionSlotRegistrations' } }) : null
          console.error('getMissionSlotRegistrations', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionSlotRegistrations.error', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'getMissionSlotRegistrations' } }) : null
          console.error('getMissionSlotRegistrations', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionSlotRegistrations.error', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  getMissionToken({ commit, dispatch }, payload) {
    if (_.isNil(payload.silent)) {
      payload.silent = false
    }

    if (!payload.silent) {
      dispatch('startWorking', i18n.t('store.getMissionToken'))
    }

    return MissionsApi.getMissionToken(payload.missionSlug)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Retrieving mission token failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (!_.isString(response.data.missionToken) && !_.isNull(response.data.missionToken)) {
          console.error(response)
          throw 'Received invalid mission token'
        }

        commit({
          type: 'setMissionToken',
          missionToken: response.data.missionToken
        })

        if (!payload.silent) {
          dispatch('stopWorking', i18n.t('store.getMissionToken'))
        }
      }).catch((error) => {
        if (!payload.silent) {
          dispatch('stopWorking', i18n.t('store.getMissionToken'))
        }

        if (error.response) {
          console.error('getMissionToken', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionToken.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'getMissionToken' } }) : null
          console.error('getMissionToken', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionToken.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'getMissionToken' } }) : null
          console.error('getMissionToken', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionToken.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  modifyMissionSlotRegistration({ dispatch, state }, payload) {
    dispatch('startWorking', i18n.t('store.modifyMissionSlotRegistration'))

    if (_.isNil(payload.suppressNotifications)) {
      payload.suppressNotifications = _.isNil(state.missionSlotRegistrationSuppressNotifications) ? false : state.missionSlotRegistrationSuppressNotifications
    }

    return MissionsApi.modifyMissionSlotRegistration(payload.missionSlug, payload.slotUid, payload.registrationUid, payload.confirm, payload.suppressNotifications)
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

        dispatch('getMissionSlotlist', { missionSlug: payload.missionSlug })
        dispatch('getMissionSlotRegistrations', {
          missionSlug: payload.missionSlug,
          slotUid: state.missionSlotDetails.uid,
          slotOrderNumber: state.missionSlotDetails.orderNumber,
          slotTitle: state.missionSlotDetails.title
        })

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.modifyMissionSlotRegistration.success')}`
        })

        dispatch('stopWorking', i18n.t('store.modifyMissionSlotRegistration'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.modifyMissionSlotRegistration'))

        if (error.response) {
          console.error('modifyMissionSlotRegistration', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.modifyMissionSlotRegistration.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'modifyMissionSlotRegistration' } }) : null
          console.error('modifyMissionSlotRegistration', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.modifyMissionSlotRegistration.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'modifyMissionSlotRegistration' } }) : null
          console.error('modifyMissionSlotRegistration', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.modifyMissionSlotRegistration.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  registerForMissionSlot({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.registerForMissionSlot'))

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

        dispatch('getMissionSlotlist', { missionSlug: payload.missionSlug })

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.registerForMissionSlot.success', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })}`,
          scrollToTop: true
        })

        dispatch('stopWorking', i18n.t('store.registerForMissionSlot'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.registerForMissionSlot'))

        if (error.response) {
          console.error('registerForMissionSlot', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.registerForMissionSlot.error', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'registerForMissionSlot' } }) : null
          console.error('registerForMissionSlot', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.registerForMissionSlot.error', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'registerForMissionSlot' } }) : null
          console.error('registerForMissionSlot', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.registerForMissionSlot.error', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  searchMissions({ dispatch, commit }, payload) {
    commit({
      type: 'searchingMissions',
      searching: true
    })

    return MissionsApi.searchMissions(payload)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Searching missions failed"
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
          type: 'searchingMissions',
          searching: false
        })

        const missions = _.map(response.data.missions, (mission) => {
          return {
            title: `[${moment(mission.startTime).format('L LT')}] ${mission.title} (${mission.creator.nickname})`,
            value: mission
          }
        })

        return missions
      }).catch((error) => {
        commit({
          type: 'searchingMissions',
          searching: false
        })

        if (error.response) {
          console.error('searchMissions', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.searchMissions.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'searchMissions' } }) : null
          console.error('searchMissions', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.searchMissions.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'searchMissions' } }) : null
          console.error('searchMissions', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.searchMissions.error')} - ${i18n.t('failed.something')}`
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
  setMissionSlotRegistrationSuppressNotifications({ commit }, payload) {
    commit({
      type: 'setMissionSlotRegistrationSuppressNotifications',
      suppressNotifications: payload.suppressNotifications
    })
  },
  toggleMissionSlotSelection({ commit }, payload) {
    commit({
      type: 'toggleMissionSlotSelection',
      missionSlotUid: payload.missionSlotUid
    })
  },
  unassignSelectedMissionSlots({ dispatch, state }, payload) {
    const selectedSlotCount = state.missionSlotSelection.length

    dispatch('startWorking', i18n.tc('store.unassignSelectedMissionSlots', selectedSlotCount, { count: selectedSlotCount }))

    return Promise.each(state.missionSlotSelection, (slotUid) => {
      let missionSlot = null

      _.each(state.missionSlotGroups, (missionSlotGroup) => {
        const slot = _.find(missionSlotGroup.slots, { uid: slotUid })
        if (!_.isNil(slot)) {
          if (_.isNil(slot.assignee) && _.isNil(slot.externalAssignee)) {
            return
          }

          missionSlot = slot
          return false
        }

        return
      })

      if (_.isNil(missionSlot)) {
        return Promise.resolve()
      }

      return MissionsApi.unassignMissionSlot(payload.missionSlug, slotUid)
        .then((response) => {
          if (response.status !== 200) {
            console.error(response)
            throw 'Unassigning mission slot failed'
          }

          if (_.isEmpty(response.data)) {
            console.error(response)
            throw 'Received empty response'
          }

          if (_.isNil(response.data.slot) || !_.isObject(response.data.slot)) {
            console.error(response)
            throw 'Received invalid mission slot'
          }
        })
    }).then(() => {
      dispatch('clearMissionSlotSelection')

      dispatch('getMissionSlotlist', { missionSlug: payload.missionSlug })

      dispatch('showAlert', {
        showAlert: true,
        alertVariant: 'success',
        alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.tc('store.unassignSelectedMissionSlots.success', selectedSlotCount, { count: selectedSlotCount })}`
      })

      dispatch('stopWorking', i18n.tc('store.unassignSelectedMissionSlots', selectedSlotCount, { count: selectedSlotCount }))
    }).catch((error) => {
      dispatch('stopWorking', i18n.tc('store.unassignSelectedMissionSlots', selectedSlotCount, { count: selectedSlotCount }))

      if (error.response) {
        console.error('unassignSelectedMissionSlots', error.response)
        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'danger',
          alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.unassignSelectedMissionSlots.error')} - ${error.response.data.message}`
        })
      } else if (error.request) {
        error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'unassignSelectedMissionSlots' } }) : null
        console.error('unassignSelectedMissionSlots', error.request)
        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'danger',
          alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.unassignSelectedMissionSlots.error')} - ${i18n.t('failed.request')}`
        })
      } else {
        error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'unassignSelectedMissionSlots' } }) : null
        console.error('unassignSelectedMissionSlots', error.message)
        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'danger',
          alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.unassignSelectedMissionSlots.error')} - ${i18n.t('failed.something')}`
        })
      }
    })
  },
  unregisterFromMissionSlot({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.unregisterFromMissionSlot'))

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

        dispatch('getMissionSlotlist', { missionSlug: payload.missionSlug })

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.unregisterFromMissionSlot.success', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })}`,
          scrollToTop: true
        })

        dispatch('stopWorking', i18n.t('store.unregisterFromMissionSlot'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.unregisterFromMissionSlot'))

        if (error.response) {
          console.error('unregisterFromMissionSlot', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.unregisterFromMissionSlot.error', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'unregisterFromMissionSlot' } }) : null
          console.error('unregisterFromMissionSlot', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.unregisterFromMissionSlot.error', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'unregisterFromMissionSlot' } }) : null
          console.error('unregisterFromMissionSlot', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.unregisterFromMissionSlot.error', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  uploadMissionBannerImage({ dispatch, commit }, payload) {
    dispatch('startWorking', i18n.t('store.uploadMissionBannerImage'))

    return MissionsApi.uploadMissionBannerImage(payload.missionSlug, payload.imageType, payload.imageData)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Uploading mission banner image failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.mission) || !_.isObject(response.data.mission)) {
          console.error(response)
          throw 'Received invalid mission banner image upload'
        }

        commit({
          type: 'setMissionDetails',
          mission: response.data.mission
        })

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.uploadMissionBannerImage.success')}`,
          scrollToTop: true
        })

        dispatch('stopWorking', i18n.t('store.uploadMissionBannerImage'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.uploadMissionBannerImage'))

        if (error.response) {
          console.error('uploadMissionBannerImage', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.uploadMissionBannerImage.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'uploadMissionBannerImage' } }) : null
          console.error('uploadMissionBannerImage', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.uploadMissionBannerImage.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missions', function: 'uploadMissionBannerImage' } }) : null
          console.error('uploadMissionBannerImage', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.uploadMissionBannerImage.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  }
}

const mutations = {
  clearMissions(state) {
    state.missions = null
    state.totalMissions = 0
    state.refreshingMissions = false

    if (!_.isNil(state.missionsRefreshSetInterval)) {
      clearInterval(state.missionsRefreshSetInterval)
    }
    state.missionsRefreshSetInterval = null

  },
  clearMissionDetails(state) {
    state.missionAccesses = null
    state.missionDetails = null
    state.missionPermissions = null
    state.missionSlotDetails = null
    state.missionSlotGroupDetails = null
    state.missionSlotGroups = null
    state.missionSlotRegistrations = null
    state.missionSlotRegistrationSuppressNotifications = false
    state.missionSlotSelection = []
    state.missionToken = null
    state.totalMissionAccesses = 0
    state.totalMissionPermissions = 0
    state.totalMissionSlotRegistrations = 0
  },
  clearMissionSlotDetails(state) {
    state.missionSlotDetails = null
  },
  clearMissionSlotGroupDetails(state) {
    state.missionSlotGroupDetails = null
  },
  clearMissionSlotSelection(state) {
    state.missionSlotSelection = []
  },
  clearMissionToken(state) {
    state.missionToken = null
  },
  refreshingMissions(state, payload) {
    state.refreshingMissions = payload.refreshing
  },
  refreshingMissionsForCalendar(state, payload) {
    state.refreshingMissionsForCalendar = payload.refreshing
  },
  searchingMissions(state, payload) {
    state.searchingMissions = payload.searching
  },
  setMissionAccesses(state, payload) {
    state.missionAccesses = payload.accesses
    state.totalMissionAccesses = payload.total
  },
  setMissionBannerImageUrl(state, payload) {
    if (_.isNil(state.missionDetails)) {
      console.warn('setMissionBannerImageUrl', 'Somehow lost mission details while uploading banner image... Oh well')
      return
    }

    state.missionDetails.bannerImageUrl = payload.bannerImageUrl
  },
  setMissionCalendarCurrentMonth(state, payload) {
    state.missionCalendarCurrentMonth = payload.currentMonth
    state.missionsForCalendar = null
    state.refreshingMissionsForCalendar = false

    if (!_.isNil(state.missionsForCalendarRefreshSetInterval)) {
      clearInterval(state.missionsForCalendarRefreshSetInterval)
    }
  },
  setMissionDetails(state, payload) {
    state.missionDetails = payload.mission
    utils.setTitle(`${i18n.t('mission')} ${state.missionDetails.title}`)
  },
  setMissionPermissions(state, payload) {
    state.missionPermissions = payload.permissions
    state.totalMissionPermissions = payload.total
  },
  setMissions(state, payload) {
    state.missions = payload.missions
    state.totalMissions = payload.total
  },
  setMissionsForCalendar(state, payload) {
    state.missionsForCalendar = payload.missions
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
  setMissionListFilter(state, payload) {
    const filter = {}
    _.each(payload.missionListFilter, (f) => {
      filter[f] = true
    })

    state.missionListFilter = filter
  },
  setMissionListRequiredDLCsFilter(state, payload) {
    state.missionListRequiredDLCsFilter = payload.missionListRequiredDLCsFilter
  },
  setMissionSlotlistFilter(state, payload) {
    const filter = {}
    _.each(payload.missionSlotlistFilter, (f) => {
      filter[f] = true
    })

    state.missionSlotlistFilter = filter
  },
  setMissionSlotlistRequiredDLCsFilter(state, payload) {
    state.missionSlotlistRequiredDLCsFilter = payload.missionSlotlistRequiredDLCsFilter
  },
  setMissionSlotRegistrations(state, payload) {
    state.missionSlotRegistrations = payload.registrations
    state.totalMissionSlotRegistrations = payload.total
  },
  setMissionSlotRegistrationSuppressNotifications(state, payload) {
    state.missionSlotRegistrationSuppressNotifications = payload.suppressNotifications
  },
  setMissionToken(state, payload) {
    state.missionToken = payload.missionToken
  },
  startCheckingMissionSlugAvailability(state) {
    state.checkingMissionSlugAvailability = true
  },
  toggleMissionSlotSelection(state, payload) {
    if (_.indexOf(state.missionSlotSelection, payload.missionSlotUid) >= 0) {
      state.missionSlotSelection = _.without(state.missionSlotSelection, payload.missionSlotUid)
    } else {
      state.missionSlotSelection.push(payload.missionSlotUid)
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
