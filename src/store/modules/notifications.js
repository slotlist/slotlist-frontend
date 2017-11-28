import { i18n } from '../../app'
import * as _ from 'lodash'
import Raven from 'raven-js'

import NotificationsApi from '../../api/notifications'

const intervals = {
  unseenNotificationCountRefresh: 300000
}

const state = {
  notifications: null,
  unseenNotificationCount: 0,
  unseenNotificationCountSetInterval: null
}

const getters = {
  notifications() {
    return state.notifications
  },
  pollingUnseenNotifications() {
    return !_.isNil(state.unseenNotificationCountSetInterval)
  },
  unseenNotificationCount() {
    return state.unseenNotificationCount
  }
}

const actions = {
  getNotifications({ commit, dispatch }) {
    dispatch('startWorking', i18n.t('store.getNotifications'))

    return NotificationsApi.getNotifications()
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw 'Retrieving notifications failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.notifications) || !_.isArray(response.data.notifications)) {
          console.error(response)
          throw 'Received invalid notifications'
        }

        commit({
          type: 'setNotifications',
          notifications: response.data.notifications
        })

        dispatch('stopWorking', i18n.t('store.getNotifications'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.getNotifications'))

        if (error.response) {
          console.error('getNotifications', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getNotifications.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          Raven.captureException(error, { extra: { module: 'notifications', function: 'getNotifications' } })
          console.error('getNotifications', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getNotifications.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          Raven.captureException(error, { extra: { module: 'notifications', function: 'getNotifications' } })
          console.error('getNotifications', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getNotifications.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  getUnseenNotificationCount({ commit, dispatch }, payload) {
    if (_.isNil(payload)) {
      payload = { autoRefresh: false }
    }
    if (_.isNil(payload.autoRefresh)) {
      payload.autoRefresh = false
    }

    return NotificationsApi.getUnseenNotificationCount()
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw 'Retrieving unseen notification count failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.unseen) || !_.isFinite(response.data.unseen)) {
          console.error(response)
          throw 'Received invalid unseen notification count'
        }

        commit({
          type: 'setUnseenNotificationCount',
          unseen: response.data.unseen
        })

        if (payload.autoRefresh) {
          if (!_.isNil(state.unseenNotificationCountSetInterval)) {
            clearInterval(state.unseenNotificationCountSetInterval)
          }

          state.unseenNotificationCountSetInterval = setInterval(() => {
            dispatch('getUnseenNotificationCount')
          }, intervals.unseenNotificationCountRefresh)
        }
      }).catch((error) => {
        if (error.response) {
          console.error('getUnseenNotificationCount', error.response)

          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getUnseenNotificationCount.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          Raven.captureException(error, { extra: { module: 'notifications', function: 'getUnseenNotificationCount' } })
          console.error('getUnseenNotificationCount', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getUnseenNotificationCount.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          Raven.captureException(error, { extra: { module: 'notifications', function: 'getUnseenNotificationCount' } })
          console.error('getUnseenNotificationCount', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getUnseenNotificationCount.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  stopNotificationPolling({ state }) {
    if (!_.isNil(state.unseenNotificationCountSetInterval)) {
      clearInterval(state.unseenNotificationCountSetInterval)
    }
  }
}

const mutations = {
  clearNotifications(state) {
    state.notifications = null
  },
  setNotifications(state, payload) {
    state.notifications = payload.notifications
  },
  setUnseenNotificationCount(state, payload) {
    state.unseenNotificationCount = payload.unseen
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
