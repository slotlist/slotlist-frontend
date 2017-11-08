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
  missionSlotTemplateUnsavedChanges() {
    return state.missionSlotTemplateUnsavedChanges
  },
  refreshingMissionSlotTemplates() {
    return state.refreshingMissionSlotTemplates
  }
}

const actions = {
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
  createMissionSlotTemplate({ dispatch }, payload) {
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
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.createMissionSlotTemplate.success', { title: payload.title })}`
        })

        router.push({
          name: 'missionSlotTemplateDetails',
          params: { missionSlotTemplateUid: response.data.slotTemplate.uid }
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
          Raven.captureException(error, { extra: { module: 'missionSlotTemplates', function: 'createMissionSlotTemplate' } })
          console.error('createMissionSlotTemplate', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.createMissionSlotTemplate.error', { title: payload.title })} - ${i18n.t('failed.request')}`
          })
        } else {
          Raven.captureException(error, { extra: { module: 'missionSlotTemplates', function: 'createMissionSlotTemplate' } })
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
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.deleteMissionSlotTemplate.success', { title: payload.missionSlotTemplateTitle })}`
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
          Raven.captureException(error, { extra: { module: 'missionSlotTemplates', function: 'deleteMissionSlotTemplate' } })
          console.error('deleteMissionSlotTemplate', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteMissionSlotTemplate.error', { title: payload.missionSlotTemplateTitle })} - ${i18n.t('failed.request')}`
          })
        } else {
          Raven.captureException(error, { extra: { module: 'missionSlotTemplates', function: 'deleteMissionSlotTemplate' } })
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
          Raven.captureException(error, { extra: { module: 'missionSlotTemplates', function: 'editMissionSlotTemplate' } })
          console.error('editMissionSlotTemplate', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editMissionSlotTemplate.error', { title: payload.missionSlotTemplateTitle })} - ${i18n.t('failed.request')}`
          })
        } else {
          Raven.captureException(error, { extra: { module: 'missionSlotTemplates', function: 'editMissionSlotTemplate' } })
          console.error('editMissionSlotTemplate', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editMissionSlotTemplate.error', { title: payload.missionSlotTemplateTitle })} - ${i18n.t('failed.something')}`
          })
        }
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
          Raven.captureException(error, { extra: { module: 'missionSlotTemplates', function: 'getMissionSlotTemplateDetails' } })
          console.error('getMissionSlotTemplateDetails', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionSlotTemplateDetails.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          Raven.captureException(error, { extra: { module: 'missionSlotTemplates', function: 'getMissionSlotTemplateDetails' } })
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
      dispatch('startWorking', i18n.t('store.getMissionSlotTemplates'))
    }

    return MissionSlotTemplatesApi.getMissionSlotTemplates(limits.missionSlotTemplates, (payload.page - 1) * limits.missionSlotTemplates)
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
          Raven.captureException(error, { extra: { module: 'missionSlotTemplates', function: 'getMissionSlotTemplates' } })
          console.error('getMissionSlotTemplates', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getMissionSlotTemplates.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          Raven.captureException(error, { extra: { module: 'missionSlotTemplates', function: 'getMissionSlotTemplates' } })
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
