import { i18n } from '../../app'
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
  missionListFilter: {},
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
    if (_.isEmpty(_.keys(state.missionListFilter))) {
      return state.missions
    }

    const filteredMissions = []
    _.each(state.missions, (mission) => {
      if (_.has(state.missionListFilter, 'assigned') && mission.isAssignedToAnySlot) {
        filteredMissions.push(mission)
      } else if (_.has(state.missionListFilter, 'registered') && mission.isRegisteredForAnySlot) {
        filteredMissions.push(mission)
      }
    })

    return filteredMissions
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
        } else if (_.has(state.missionSlotlistFilter, 'restricted') && !_.isNil(slot.restrictedCommunity)) {
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
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.checkMissionSlugAvailability', { slug: payload })} - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('checkMissionSlugAvailability', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.checkMissionSlugAvailability', { slug: payload })} - ${i18n.t('failed.request')}`
          })
        } else {
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
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.createMission.success', { title: payload.title })}`
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
          console.error('createMission', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.createMission.error', { title: payload.title })} - ${i18n.t('failed.request')}`
          })
        } else {
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
          console.error('createMissionSlot', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.tc('store.createMissionSlot.error', slotCount, { count: slotCount })} - ${i18n.t('failed.request')}`
          })
        } else {
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
          console.error('createMissionSlotGroup', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.createMissionSlotGroup.error', { slotInfo: `#${payload.slotGroupDetails.orderNumber} ${payload.slotGroupDetails.title}` })} - ${i18n.t('failed.request')}`
          })
        } else {
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
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.deleteMission.success', { title: payload.missionTitle })}`
        })

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
          console.error('deleteMission', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMission.error', { title: payload.missionTitle })} - ${i18n.t('failed.request')}`
          })
        } else {
          console.error('deleteMission', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMission.error', { title: payload.missionTitle })} - ${i18n.t('failed.something')}`
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
          console.error('deleteMissionBannerImage', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionBannerImage.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          console.error('deleteMissionBannerImage', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionBannerImage.error')} - ${i18n.t('failed.something')}`
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
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.deleteMissionSlot.success', { slotInfo: `${payload.slotOrderNumber} ${payload.slotTitle}` })}`
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
          console.error('deleteMissionSlot', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionSlot.error', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })} - ${i18n.t('failed.request')}`
          })
        } else {
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
          console.error('deleteMissionSlotGroup', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionSlotGroup.error', { title: payload.slotGroupTitle })} - ${i18n.t('failed.request')}`
          })
        } else {
          console.error('deleteMissionSlotGroup', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionSlotGroup.error', { title: payload.slotGroupTitle })} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  duplicateMissionSlotGroup({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.duplicateMissionSlotGroup'))

    const slotGroupDetails = {
      description: payload.missionSlotGroup.description,
      orderNumber: payload.missionSlotGroup.orderNumber + 1,
      title: payload.missionSlotGroup.title
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
            orderNumber: slot.orderNumber,
            reserve: slot.reserve,
            restrictedCommunityUid: _.isNil(slot.restrictedCommunity) ? null : slot.restrictedCommunity.uid,
            description: slot.description,
            title: slot.title,
            slotGroupUid
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
          console.error('duplicateMissionSlotGroup', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.duplicateMissionSlotGroup.error', { slotGroupInfo: `#${payload.missionSlotGroup.orderNumber} ${payload.missionSlotGroup.title}` })} - ${i18n.t('failed.request')}`
          })
        } else {
          console.error('duplicateMissionSlotGroup', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.duplicateMissionSlotGroup.error', { slotGroupInfo: `#${payload.missionSlotGroup.orderNumber} ${payload.missionSlotGroup.title}` })} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  editMission({ commit, dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.editMission'))

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
          console.error('editMission', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editMission.error', { title: payload.missionTitle })} - ${i18n.t('failed.request')}`
          })
        } else {
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
          console.error('editMissionSlot', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editMissionSlot.error', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })} - ${i18n.t('failed.request')}`
          })
        } else {
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
          console.error('editMissionSlotGroup', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editMissionSlotGroup.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          console.error('editMissionSlotGroup', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editMissionSlotGroup.error')} - ${i18n.t('failed.something')}`
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

    if (hadEndedFilter || _.has(state.missionListFilter, 'ended')) {
      dispatch('getMissions')
    }
  },
  filterMissionSlotlist({ commit }, payload) {
    commit({
      type: 'setMissionSlotlistFilter',
      missionSlotlistFilter: payload
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
              alertMessage: `<i class="fa fa-question" aria-hidden="true"></i> ${i18n.t('store.getMissionDetails.error.notFound', { slug: payload.missionSlug })}`
            })

            return router.push({ name: 'missionList' })
          }

          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionDetails.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('getMissionDetails', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionDetails.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          console.error('getMissionDetails', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionDetails.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  getMissions({ commit, dispatch, state }, payload) {
    dispatch('startWorking', i18n.t('store.getMissions'))

    if (_.isNil(payload)) {
      payload = { page: 1 }
    } else if (_.isNil(payload.page)) {
      payload.page = 1
    }

    let includeEnded = _.has(state.missionListFilter, 'ended')

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

        dispatch('stopWorking', i18n.t('store.getMissions'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.getMissions'))

        if (error.response) {
          console.error('getMissions', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissions.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('getMissions', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissions.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          console.error('getMissions', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissions.error')} - ${i18n.t('failed.something')}`
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

        if (_.isNil(response.data.slotGroups) || !_.isObject(response.data.slotGroups)) {
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
          console.error('getMissionSlotlist', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionSlotlist.error')} - ${i18n.t('failed.request')}`
          })
        } else {
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
    dispatch('startWorking', i18n.t('store.getMissionSlotRegistrations'))

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

        dispatch('stopWorking', i18n.t('store.getMissionSlotRegistrations'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.getMissionSlotRegistrations'))

        if (error.response) {
          console.error('getMissionSlotRegistrations', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionSlotRegistrations.error', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })} - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('getMissionSlotRegistrations', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionSlotRegistrations.error', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })} - ${i18n.t('failed.request')}`
          })
        } else {
          console.error('getMissionSlotRegistrations', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionSlotRegistrations.error', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  modifyMissionSlotRegistration({ dispatch, state }, payload) {
    dispatch('startWorking', i18n.t('store.modifyMissionSlotRegistration'))

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
          console.error('modifyMissionSlotRegistration', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.modifyMissionSlotRegistration.error')} - ${i18n.t('failed.request')}`
          })
        } else {
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
          console.error('registerForMissionSlot', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.registerForMissionSlot.error', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })} - ${i18n.t('failed.request')}`
          })
        } else {
          console.error('registerForMissionSlot', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.registerForMissionSlot.error', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })} - ${i18n.t('failed.something')}`
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
          console.error('unregisterFromMissionSlot', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.unregisterFromMissionSlot.error', { slotInfo: `#${payload.slotOrderNumber} ${payload.slotTitle}` })} - ${i18n.t('failed.request')}`
          })
        } else {
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
          console.error('uploadMissionBannerImage', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.uploadMissionBannerImage.error')} - ${i18n.t('failed.request')}`
          })
        } else {
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
  setMissionBannerImageUrl(state, payload) {
    if (_.isNil(state.missionDetails)) {
      console.warn('setMissionBannerImageUrl', 'Somehow lost mission details while uploading banner image... Oh well')
      return
    }

    state.missionDetails.bannerImageUrl = payload.bannerImageUrl
  },
  setMissionDetails(state, payload) {
    state.missionDetails = payload.mission
    utils.setTitle(`${i18n.t('mission')} ${state.missionDetails.title}`)
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
  setMissionListFilter(state, payload) {
    const filter = {}
    _.each(payload.missionListFilter, (f) => {
      filter[f] = true
    })

    state.missionListFilter = filter
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
