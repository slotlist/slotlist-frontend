import { i18n } from '../../app'
import * as _ from 'lodash'
import Raven from 'raven-js'

import NotificationsApi from '../../api/notifications'

const limits = {
  notifications: 10
}

const intervals = {
  unseenNotificationCountRefresh: 60000
}

const state = {
  notificationListFilter: {},
  notifications: null,
  notificationsPage: 1,
  refreshingNotifications: false,
  totalNotifications: 0,
  unseenNotificationCount: 0,
  unseenNotificationCountSetInterval: null
}

const getters = {
  notificationListFilter() {
    return _.keys(state.notificationListFilter)
  },
  notificationsPageCount() {
    return Math.ceil(state.totalNotifications / limits.notifications)
  },
  notifications() {
    if (!_.isArray(state.notifications)) {
      return null
    }

    if (_.has(state.notificationListFilter, 'seen')) {
      return state.notifications
    }

    const start = _.min([((state.notificationsPage - 1) * limits.notifications), state.notifications.length])
    const end = _.min([(start + limits.notifications), state.notifications.length])

    return _.slice(state.notifications, start, end)
  },
  pollingUnseenNotifications() {
    return !_.isNil(state.unseenNotificationCountSetInterval)
  },
  refreshingNotifications() {
    return state.refreshingNotifications
  },
  unseenNotificationCount() {
    return state.unseenNotificationCount
  }
}

const actions = {
  clearNotifications({ commit }) {
    commit({
      type: 'clearNotifications'
    })
  },
  filterNotificationList({ commit, dispatch, state }, payload) {
    const hadSeenFilter = _.has(state.notificationListFilter, 'seen')

    commit({
      type: 'setNotificationListFilter',
      notificationListFilter: payload
    })

    const hasSeenFilter = _.has(state.notificationListFilter, 'seen')
    if ((hadSeenFilter && !hasSeenFilter) || (!hadSeenFilter && hasSeenFilter)) {
      dispatch('getNotifications')
    }
  },
  getNotifications({ commit, dispatch, state }, payload) {
    commit({
      type: 'refreshingNotifications',
      refreshing: true
    })

    if (_.isNil(payload)) {
      payload = { page: 1, limit: limits.notifications, silent: false }
    }
    if (_.isNil(payload.page)) {
      payload.page = 1
    }
    if (_.isNil(payload.limit)) {
      payload.limit = limits.notifications
    }
    if (_.isNil(payload.silent)) {
      payload.silent = false
    }

    if (!payload.silent) {
      dispatch('startWorking', i18n.t('store.getNotifications'))
    }

    const includeSeen = _.has(state.notificationListFilter, 'seen')

    return NotificationsApi.getNotifications(payload.limit, (payload.page - 1) * payload.limit, includeSeen)
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
          notifications: response.data.notifications,
          total: _.isNil(response.data.total) ? response.data.notifications.length : response.data.total
        })

        if (!payload.silent) {
          dispatch('stopWorking', i18n.t('store.getNotifications'))
        }

        commit({
          type: 'refreshingNotifications',
          refreshing: false
        })
      }).catch((error) => {
        commit({
          type: 'refreshingNotifications',
          refreshing: false
        })

        if (!payload.silent) {
          dispatch('stopWorking', i18n.t('store.getNotifications'))
        }

        if (error.response) {
          console.error('getNotifications', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getNotifications.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'notifications', function: 'getNotifications' } }) : null
          console.error('getNotifications', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getNotifications.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'notifications', function: 'getNotifications' } }) : null
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
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'notifications', function: 'getUnseenNotificationCount' } }) : null
          console.error('getUnseenNotificationCount', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getUnseenNotificationCount.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'notifications', function: 'getUnseenNotificationCount' } }) : null
          console.error('getUnseenNotificationCount', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getUnseenNotificationCount.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  paginateNotifications( { commit }, payload) {
    commit({
      type: 'setNotificationsPage',
      page: payload.page
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
    state.notificationsPage = 1
    state.refreshingNotifications = false
    state.totalNotifications = 0
  },
  refreshingNotifications(state, payload) {
    state.refreshingNotifications = payload.refreshing
  },
  setNotificationListFilter(state, payload) {
    const filter = {}
    _.each(payload.notificationListFilter, (f) => {
      filter[f] = true
    })

    state.notificationListFilter = filter
  },
  setNotifications(state, payload) {
    state.notifications = payload.notifications
    state.totalNotifications = payload.total
  },
  setNotificationsPage(state, payload) {
    state.notificationsPage = payload.page
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
