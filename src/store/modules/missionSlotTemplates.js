import { i18n } from '../../app'
import * as _ from 'lodash'
import Raven from 'raven-js'

import MissionSlotTemplatesApi from '../../api/missionSlotTemplates'

const limits = {
  missionSlotTemplates: 10
}

const intervals = {
  missionSlotTemplatesRefresh: 300000
}

const state = {
  missionSlotTemplates: null,
  missionSlotTemplatesRefreshSetInterval: null,
  refreshingMissionSlotTemplates: false,
  totalMissionSlotTemplates: 0
}

const getters = {
  missionSlotTemplates() {
    return state.missionSlotTemplates
  },
  missionSlotTemplatesPageCount() {
    return Math.ceil(state.totalMissionSlotTemplates / limits.missionSlotTemplates)
  },
  refreshingMissionSlotTemplates() {
    return state.refreshingMissionSlotTemplates
  }
}

const actions = {
  clearMissionSlotTemplates({ commit }) {
    commit({
      type: 'clearMissionSlotTemplates'
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
  }
}

const mutations = {
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
  setMissionSlotTemplates(state, payload) {
    state.missionSlotTemplates = payload.slotTemplates
    state.totalMissionSlotTemplates = payload.total
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
