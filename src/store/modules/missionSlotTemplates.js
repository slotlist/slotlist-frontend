import { i18n } from '../../app'
import * as _ from 'lodash'
import utils from '../../utils'
import router from '../../router'
import Raven from 'raven-js'

import MissionSlotTemplatesApi from '../../api/missionSlotTemplates'

const limits = {
  missionSlotTemplates: 10
}

const intervals = {
  missionSlotTemplatesRefresh: 300000
}

const state = {
  missionSlotTemplateDetails: null,
  missionSlotTemplates: null,
  missionSlotTemplateSlotDetails: null,
  missionSlotTemplateSlotGroupDetails: null,
  missionSlotTemplatesRefreshSetInterval: null,
  missionSlotTemplateUnsavedChanges: false,
  refreshingMissionSlotTemplates: false,
  totalMissionSlotTemplates: 0
}

const getters = {
  missionSlotTemplateDetails() {
    return state.missionSlotTemplateDetails
  },
  missionSlotTemplates() {
    return state.missionSlotTemplates
  },
  missionSlotTemplateSlotDetails() {
    return state.missionSlotTemplateSlotDetails
  },
  missionSlotTemplateSlotGroupDetails() {
    return state.missionSlotTemplateSlotGroupDetails
  },
  missionSlotTemplatesPageCount() {
    return Math.ceil(state.totalMissionSlotTemplates / limits.missionSlotTemplates)
  },
  missionSlotTemplatesRefreshSetInterval() {
    return state.missionSlotTemplatesRefreshSetInterval
  },
  missionSlotTemplateUnsavedChanges() {
    return state.missionSlotTemplateUnsavedChanges
  },
  refreshingMissionSlotTemplates() {
    return state.refreshingMissionSlotTemplates
  }
}

const actions = {
  addMissionSlotTemplateSlot({ commit, state }, payload) {
    let slotGroups = _.clone(state.missionSlotTemplateDetails.slotGroups)
    const slotGroupIndex = _.findIndex(slotGroups, (g) => g.orderNumber === state.missionSlotTemplateSlotGroupDetails.orderNumber)
    if (slotGroupIndex < 0) {
      console.error(`Did not find mission slot template slot group with order number ${state.missionSlotTemplateSlotGroupDetails.orderNumber}, aborting slot addition`)
      return
    }
    const slotGroup = slotGroups[slotGroupIndex]

    const slotsToIncrement = _.slice(slotGroup.slots, payload.insertAfter)
    _.each(slotsToIncrement, (slot) => {
      slot.orderNumber += 1
    })

    slotGroup.slots.splice(payload.insertAfter, 0, {
      orderNumber: payload.insertAfter + 1,
      title: payload.title,
      description: payload.description,
      detailedDescription: payload.detailedDescription,
      difficulty: payload.difficulty,
      blocked: payload.blocked,
      reserve: payload.reserve
    })

    commit({
      type: 'setMissionSlotTemplateSlotlist',
      slotGroups
    })
  },
  addMissionSlotTemplateSlotGroup({ commit, state }, payload) {
    let slotGroups = _.clone(state.missionSlotTemplateDetails.slotGroups)

    const slotGroupsToIncrement = _.slice(slotGroups, payload.insertAfter)
    _.each(slotGroupsToIncrement, (slotGroup) => {
      slotGroup.orderNumber += 1
    })

    slotGroups.splice(payload.insertAfter, 0, {
      orderNumber: payload.insertAfter + 1,
      title: payload.title,
      description: payload.description,
      slots: _.isNil(payload.slots) ? [] : payload.slots
    })

    commit({
      type: 'setMissionSlotTemplateSlotlist',
      slotGroups
    })
  },
  clearMissionSlotTemplateDetails({ commit }) {
    commit({
      type: 'clearMissionSlotTemplateDetails'
    })
  },
  clearMissionSlotTemplates({ commit }) {
    commit({
      type: 'clearMissionSlotTemplates'
    })
  },
  createMissionSlotTemplate({ dispatch, commit }, payload) {
    dispatch('startWorking', i18n.t('store.createMissionSlotTemplate'))

    return MissionSlotTemplatesApi.createMissionSlotTemplate(payload)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Creating mission slot template failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.slotTemplate) || !_.isObject(response.data.slotTemplate)) {
          console.error(response)
          throw 'Received invalid mission slot template'
        }

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.createMissionSlotTemplate.success', { title: payload.title })}`,
          persistentAlert: true
        })

        router.push({
          name: 'missionSlotTemplateDetails',
          params: { missionSlotTemplateUid: response.data.slotTemplate.uid }
        })

        commit({
          type: 'setMissionSlotTemplateDetails',
          slotTemplate: response.data.slotTemplate
        })

        dispatch('stopWorking', i18n.t('store.createMissionSlotTemplate'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.createMissionSlotTemplate'))

        if (error.response) {
          console.error('createMissionSlotTemplate', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.createMissionSlotTemplate.error', { title: payload.title })} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missionSlotTemplates', function: 'createMissionSlotTemplate' } }) : null
          console.error('createMissionSlotTemplate', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.createMissionSlotTemplate.error', { title: payload.title })} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missionSlotTemplates', function: 'createMissionSlotTemplate' } }) : null
          console.error('createMissionSlotTemplate', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.createMissionSlotTemplate.error', { title: payload.title })} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  deleteMissionSlotTemplate({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.deleteMissionSlotTemplate'))

    return MissionSlotTemplatesApi.deleteMissionSlotTemplate(payload.missionSlotTemplateUid)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Deleting mission slot template failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (response.data.success !== true) {
          console.error(response)
          throw 'Received invalid mission slot template deletion'
        }

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.deleteMissionSlotTemplate.success', { title: payload.missionSlotTemplateTitle })}`,
          persistentAlert: true
        })

        dispatch('getMissionSlotTemplates', { autoRefresh: true })

        router.push({ name: 'missionSlotTemplateList' })

        dispatch('stopWorking', i18n.t('store.deleteMissionSlotTemplate'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.deleteMissionSlotTemplate'))

        if (error.response) {
          console.error('deleteMissionSlotTemplate', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionSlotTemplate.error', { title: payload.missionSlotTemplateTitle })} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missionSlotTemplates', function: 'deleteMissionSlotTemplate' } }) : null
          console.error('deleteMissionSlotTemplate', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionSlotTemplate.error', { title: payload.missionSlotTemplateTitle })} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missionSlotTemplates', function: 'deleteMissionSlotTemplate' } }) : null
          console.error('deleteMissionSlotTemplate', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionSlotTemplate.error', { title: payload.missionSlotTemplateTitle })} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  editMissionSlotTemplate({ commit, dispatch }, payload) {
    if (_.isNil(payload.silent)) {
      payload.silent = false
    }

    if (!payload.silent) {
      dispatch('startWorking', i18n.t('store.editMissionSlotTemplate'))
    }

    return MissionSlotTemplatesApi.editMissionSlotTemplate(payload.missionSlotTemplateUid, payload.updatedMissionSlotTemplateDetails)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Editing mission slot template failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.slotTemplate) || !_.isObject(response.data.slotTemplate)) {
          console.error(response)
          throw 'Received invalid mission slot template '
        }

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.editMissionSlotTemplate.success', { title: payload.missionSlotTemplateTitle })}`
        })

        commit({
          type: 'setMissionSlotTemplateDetails',
          slotTemplate: response.data.slotTemplate
        })

        if (!payload.silent) {
          dispatch('stopWorking', i18n.t('store.editMissionSlotTemplate'))
        }
      }).catch((error) => {
        if (!payload.silent) {
          dispatch('stopWorking', i18n.t('store.editMissionSlotTemplate'))
        }

        if (error.response) {
          console.error('editMissionSlotTemplate', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editMissionSlotTemplate.error', { title: payload.missionSlotTemplateTitle })} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missionSlotTemplates', function: 'editMissionSlotTemplate' } }) : null
          console.error('editMissionSlotTemplate', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editMissionSlotTemplate.error', { title: payload.missionSlotTemplateTitle })} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missionSlotTemplates', function: 'editMissionSlotTemplate' } }) : null
          console.error('editMissionSlotTemplate', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editMissionSlotTemplate.error', { title: payload.missionSlotTemplateTitle })} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  editMissionSlotTemplateSlot({ commit, state }, payload) {
    let slotGroups = _.clone(state.missionSlotTemplateDetails.slotGroups)
    const slotGroupIndex = _.findIndex(slotGroups, (g) => g.orderNumber === state.missionSlotTemplateSlotGroupDetails.orderNumber)
    if (slotGroupIndex < 0) {
      console.error(`Did not find mission slot template slot group with order number ${state.missionSlotTemplateSlotGroupDetails.orderNumber}, aborting slot editing`)
      return
    }
    const slotGroup = slotGroups[slotGroupIndex]

    const slotIndex = _.findIndex(slotGroup.slots, (s) => s.orderNumber === payload.slotOrderNumber)
    if (slotGroupIndex < 0) {
      console.error(`Did not find mission slot template slot with order number ${payload.slotOrderNumber}, aborting slot editing`)
      return
    }

    slotGroup.slots[slotIndex] = payload.slotPayload

    if (payload.moveAfter >= -1) {
      const oldOrderNumber = slotGroup.slots[slotIndex].orderNumber
      const increment = payload.moveAfter < oldOrderNumber
      const orderNumber = increment ? payload.moveAfter + 1 : payload.moveAfter

      _.each(slotGroup.slots, (slot) => {
        if (slot.orderNumber === oldOrderNumber) {
          return
        }

        if (increment && slot.orderNumber >= orderNumber && slot.orderNumber < oldOrderNumber) {
          slot.orderNumber += 1
        } else if (!increment && slot.orderNumber <= orderNumber && slot.orderNumber > oldOrderNumber) {
          slot.orderNumber -= 1
        }
      })

      slotGroup.slots[slotIndex].orderNumber = orderNumber
    }

    commit({
      type: 'setMissionSlotTemplateSlotlist',
      slotGroups
    })
  },
  editMissionSlotTemplateSlotGroup({ commit, state }, payload) {
    let slotGroups = _.clone(state.missionSlotTemplateDetails.slotGroups)
    const slotGroupIndex = _.findIndex(slotGroups, (g) => g.orderNumber === state.missionSlotTemplateSlotGroupDetails.orderNumber)
    if (slotGroupIndex < 0) {
      console.error(`Did not find mission slot template slot group with order number ${state.missionSlotTemplateSlotGroupDetails.orderNumber}, aborting slot editing`)
      return
    }

    slotGroups[slotGroupIndex].title = payload.slotGroupPayload.title
    slotGroups[slotGroupIndex].description = payload.slotGroupPayload.description

    if (payload.moveAfter >= -1) {
      const oldOrderNumber = slotGroups[slotGroupIndex].orderNumber
      const increment = payload.moveAfter < oldOrderNumber
      const orderNumber = increment ? payload.moveAfter + 1 : payload.moveAfter

      _.each(slotGroups, (slotGroup) => {
        if (slotGroup.orderNumber === oldOrderNumber) {
          return
        }

        if (increment && slotGroup.orderNumber >= orderNumber && slotGroup.orderNumber < oldOrderNumber) {
          slotGroup.orderNumber += 1
        } else if (!increment && slotGroup.orderNumber <= orderNumber && slotGroup.orderNumber > oldOrderNumber) {
          slotGroup.orderNumber -= 1
        }
      })

      slotGroups[slotGroupIndex].orderNumber = orderNumber
    }

    commit({
      type: 'setMissionSlotTemplateSlotlist',
      slotGroups
    })
  },
  getMissionSlotTemplateDetails({ commit, dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.getMissionSlotTemplateDetails'))

    return MissionSlotTemplatesApi.getMissionSlotTemplateDetails(payload.missionSlotTemplateUid)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw 'Retrieving mission slot template details failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.slotTemplate) || !_.isObject(response.data.slotTemplate)) {
          console.error(response)
          throw 'Received invalid mission slot template'
        }

        commit({
          type: 'setMissionSlotTemplateDetails',
          slotTemplate: response.data.slotTemplate
        })

        dispatch('stopWorking', i18n.t('store.getMissionSlotTemplateDetails'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.getMissionSlotTemplateDetails'))

        if (error.response) {
          console.error('getMissionSlotTemplateDetails', error.response)

          if (error.response.status === 404) {
            dispatch('showAlert', {
              showAlert: true,
              alertVariant: 'warning',
              alertMessage: `<i class="fa fa-question" aria-hidden="true"></i> ${i18n.t('store.getMissionSlotTemplateDetails.error.notFound', { slug: payload.missionSlug })}`
            })

            return router.push({ name: 'missionSlotTemplateList' })
          }

          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionSlotTemplateDetails.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missionSlotTemplates', function: 'getMissionSlotTemplateDetails' } }) : null
          console.error('getMissionSlotTemplateDetails', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionSlotTemplateDetails.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missionSlotTemplates', function: 'getMissionSlotTemplateDetails' } }) : null
          console.error('getMissionSlotTemplateDetails', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionSlotTemplateDetails.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  getMissionSlotTemplates({ commit, dispatch, state }, payload) {
    commit({
      type: 'refreshingMissionSlotTemplates',
      refreshing: true
    })

    if (_.isNil(payload)) {
      payload = { page: 1, limit: limits.missionSlotTemplates, silent: false, autoRefresh: false }
    }
    if (_.isNil(payload.page)) {
      payload.page = 1
    }
    if (_.isNil(payload.limit)) {
      payload.limit = limits.missionSlotTemplates
    }
    if (_.isNil(payload.silent)) {
      payload.silent = false
    }
    if (_.isNil(payload.autoRefresh)) {
      payload.autoRefresh = false
    }

    if (!payload.silent) {
      dispatch('startWorking', i18n.t('store.getMissionSlotTemplates'))
    }

    return MissionSlotTemplatesApi.getMissionSlotTemplates(payload.limit, (payload.page - 1) * payload.limit)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw 'Retrieving mission slot templates failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.slotTemplates) || !_.isArray(response.data.slotTemplates)) {
          console.error(response)
          throw 'Received invalid mission slot templates'
        }

        commit({
          type: 'setMissionSlotTemplates',
          slotTemplates: response.data.slotTemplates,
          total: response.data.total
        })

        if (!payload.silent) {
          dispatch('stopWorking', i18n.t('store.getMissionSlotTemplates'))
        }

        commit({
          type: 'refreshingMissionSlotTemplates',
          refreshing: false
        })

        if (payload.autoRefresh) {
          if (!_.isNil(state.missionSlotTemplatesRefreshSetInterval)) {
            clearInterval(state.missionSlotTemplatesRefreshSetInterval)
          }

          state.missionSlotTemplatesRefreshSetInterval = setInterval(() => {
            dispatch('getMissionSlotTemplates', { silent: true })
          }, intervals.missionSlotTemplatesRefresh)
        }
      }).catch((error) => {
        commit({
          type: 'refreshingMissionSlotTemplates',
          refreshing: false
        })

        if (!payload.silent) {
          dispatch('stopWorking', i18n.t('store.getMissionSlotTemplates'))
        }

        if (error.response) {
          console.error('getMissionSlotTemplates', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionSlotTemplates.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missionSlotTemplates', function: 'getMissionSlotTemplates' } }) : null
          console.error('getMissionSlotTemplates', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionSlotTemplates.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'missionSlotTemplates', function: 'getMissionSlotTemplates' } }) : null
          console.error('getMissionSlotTemplates', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionSlotTemplates.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  moveMissionSlotTemplateSlotGroup({ commit, state }, payload) {
    const slotGroups = _.clone(state.missionSlotTemplateDetails.slotGroups)
    if (_.isNil(slotGroups[payload.index])) {
      console.error(`Did not find mission slot template slot group at index ${payload.index}, aborting move`)
      return
    }

    const destinationIndex = payload.index + payload.direction
    if (destinationIndex >= slotGroups.length || destinationIndex < 0) {
      console.error(`Destination index ${destinationIndex} for mission slot template slot group at index ${payload.index} is invalid, aborting move`)
      return
    }

    let tmpGroup = slotGroups[destinationIndex]
    slotGroups[destinationIndex] = slotGroups[payload.index]
    slotGroups[payload.index] = tmpGroup
    let tmpOrderNumber = slotGroups[destinationIndex].orderNumber
    slotGroups[destinationIndex].orderNumber = slotGroups[payload.index].orderNumber
    slotGroups[payload.index].orderNumber = tmpOrderNumber

    commit({
      type: 'setMissionSlotTemplateSlotlist',
      slotGroups
    })
  },
  removeMissionSlotTemplateSlot({ commit, state }, payload) {
    let slotGroups = _.clone(state.missionSlotTemplateDetails.slotGroups)
    const slotGroupIndex = _.findIndex(slotGroups, (g) => g.orderNumber === payload.slotGroupOrderNumber)
    if (slotGroupIndex < 0) {
      console.error(`Did not find mission slot template slot group with order number ${payload.slotGroupOrderNumber}, aborting slot deletion`)
      return
    }
    const slotGroup = slotGroups[slotGroupIndex]

    slotGroup.slots.splice(payload.index, 1)

    commit({
      type: 'setMissionSlotTemplateSlotlist',
      slotGroups
    })
  },
  removeMissionSlotTemplateSlotGroup({ commit, state }, payload) {
    let slotGroups = _.clone(state.missionSlotTemplateDetails.slotGroups)

    slotGroups.splice(payload.index, 1)

    commit({
      type: 'setMissionSlotTemplateSlotlist',
      slotGroups
    })
  },
  setMissionSlotTemplateSlotDetails({ commit }, payload) {
    commit({
      type: 'setMissionSlotTemplateSlotDetails',
      slotDetails: payload
    })
  },
  setMissionSlotTemplateSlotGroupDetails({ commit }, payload) {
    commit({
      type: 'setMissionSlotTemplateSlotGroupDetails',
      slotGroupDetails: payload
    })
  },
  setMissionSlotTemplateUnsavedChanges({ commit }, payload) {
    commit({
      type: 'setMissionSlotTemplateUnsavedChanges',
      unsavedChanges: payload
    })
  }
}

const mutations = {
  clearMissionSlotTemplateDetails(state) {
    state.missionSlotTemplateDetails = null
    state.missionSlotTemplateSlotDetails = null
    state.missionSlotTemplateSlotGroupDetails = null
    state.missionSlotTemplateUnsavedChanges = false
  },
  clearMissionSlotTemplates(state) {
    state.missionSlotTemplates = null
    state.totalMissionSlotTemplates = 0
    state.refreshingMissionSlotTemplates = false

    if (!_.isNil(state.missionSlotTemplatesRefreshSetInterval)) {
      clearInterval(state.missionSlotTemplatesRefreshSetInterval)
    }
    state.missionSlotTemplatesRefreshSetInterval = null

  },
  refreshingMissionSlotTemplates(state, payload) {
    state.refreshingMissionSlotTemplates = payload.refreshing
  },
  setMissionSlotTemplateDetails(state, payload) {
    state.missionSlotTemplateDetails = payload.slotTemplate
    state.missionSlotTemplateUnsavedChanges = false
    utils.setTitle(`${i18n.t('mission.slotTemplate')} ${state.missionSlotTemplateDetails.title}`)
  },
  setMissionSlotTemplates(state, payload) {
    state.missionSlotTemplates = payload.slotTemplates
    state.totalMissionSlotTemplates = payload.total
  },
  setMissionSlotTemplateSlotDetails(state, payload) {
    state.missionSlotTemplateSlotDetails = payload.slotDetails
  },
  setMissionSlotTemplateSlotGroupDetails(state, payload) {
    state.missionSlotTemplateSlotGroupDetails = payload.slotGroupDetails
  },
  setMissionSlotTemplateSlotlist(state, payload) {
    payload.slotGroups = _.orderBy(payload.slotGroups, ['orderNumber'], ['asc'])

    let slotGroupOrderNumber = 1
    let slotOrderNumber = 1
    _.each(payload.slotGroups, (slotGroup) => {
      slotGroup.orderNumber = slotGroupOrderNumber
      slotGroup.slots = _.orderBy(slotGroup.slots, ['orderNumber'], ['asc'])

      _.each(slotGroup.slots, (slot) => {
        slot.orderNumber = slotOrderNumber

        slotOrderNumber += 1
      })

      slotGroupOrderNumber += 1
    })

    state.missionSlotTemplateDetails.slotGroups = payload.slotGroups
    state.missionSlotTemplateUnsavedChanges = true
  },
  setMissionSlotTemplateUnsavedChanges(state, payload) {
    state.missionSlotTemplateUnsavedChanges = payload.unsavedChanges
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
