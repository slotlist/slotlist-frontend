import { i18n } from '../../app'
import router from '../../router'
import * as _ from 'lodash'
import Raven from 'raven-js'

import AnnouncementsApi from '../../api/announcements'

const limits = {
  announcements: 10
}

const intervals = {
  unseenAnnouncementCountRefresh: 60000
}

const state = {
  announcementDetails: null,
  announcements: null,
  announcementsPage: 1,
  refreshingAnnouncements: false,
  totalAnnouncements: 0
}

const getters = {
  announcementDetails() {
    return state.announcementDetails
  },
  announcementsPageCount() {
    return Math.ceil(state.totalAnnouncements / limits.announcements)
  },
  announcements() {
    if (!_.isArray(state.announcements)) {
      return null
    }

    return state.announcements
  },
  refreshingAnnouncements() {
    return state.refreshingAnnouncements
  }
}

const actions = {
  clearAnnouncementDetails({ commit }) {
    commit({
      type: 'clearAnnouncementDetails'
    })
  },
  clearAnnouncements({ commit }) {
    commit({
      type: 'clearAnnouncements'
    })
  },
  createAnnouncement({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.createAnnouncement'))

    return AnnouncementsApi.createAnnouncement(payload.announcementDetails)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Creating announcement failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.announcement) || !_.isObject(response.data.announcement)) {
          console.error(response)
          throw 'Received invalid announcement'
        }

        dispatch('getAnnouncements')

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.createAnnouncement.success')}`
        })

        router.push({
          name: 'announcementList',
          query: { uid: response.data.announcement.uid }
        })

        dispatch('stopWorking', i18n.t('store.createAnnouncement'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.createAnnouncement'))

        if (error.response) {
          console.error('createAnnouncement', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.createAnnouncement.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'announcements', function: 'createAnnouncement' } }) : null
          console.error('createAnnouncement', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.createAnnouncement.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'announcements', function: 'createAnnouncement' } }) : null
          console.error('createAnnouncement', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.createAnnouncement.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  deleteAnnouncement({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.deleteAnnouncement'))

    return AnnouncementsApi.deleteAnnouncement(payload.announcementUid)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Deleting announcement failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (response.data.success !== true) {
          console.error(response)
          throw 'Received invalid announcement deletion'
        }

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.deleteAnnouncement.success', { title: payload.announcementTitle })}`,
          persistentAlert: true
        })

        dispatch('getAnnouncements')

        dispatch('stopWorking', i18n.t('store.deleteAnnouncement'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.deleteAnnouncement'))

        if (error.response) {
          console.error('deleteAnnouncement', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteAnnouncement.error', { title: payload.announcementTitle })} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'announcements', function: 'deleteAnnouncement' } }) : null
          console.error('deleteAnnouncement', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteAnnouncement.error', { title: payload.announcementTitle })} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'announcements', function: 'deleteAnnouncement' } }) : null
          console.error('deleteAnnouncement', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteAnnouncement.error', { title: payload.announcementTitle })} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  editAnnouncement({ commit, dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.editAnnouncement'))

    return AnnouncementsApi.editAnnouncement(payload.announcementUid, payload.updatedAnnouncementDetails)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Editing announcement failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.announcement) || !_.isObject(response.data.announcement)) {
          console.error(response)
          throw 'Received invalid announcement'
        }

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.editAnnouncement.success')}`
        })

        dispatch('getAnnouncements')

        dispatch('stopWorking', i18n.t('store.editAnnouncement'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.editAnnouncement'))

        if (error.response) {
          console.error('editAnnouncement', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editAnnouncement.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'announcements', function: 'editAnnouncement' } }) : null
          console.error('editAnnouncement', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editAnnouncement.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'announcements', function: 'editAnnouncement' } }) : null
          console.error('editAnnouncement', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editAnnouncement.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  getAnnouncements({ commit, dispatch, state }, payload) {
    commit({
      type: 'refreshingAnnouncements',
      refreshing: true
    })

    if (_.isNil(payload)) {
      payload = { page: 1, limit: limits.announcements, silent: false }
    }
    if (_.isNil(payload.page)) {
      payload.page = 1
    }
    if (_.isNil(payload.limit)) {
      payload.limit = limits.announcements
    }
    if (_.isNil(payload.silent)) {
      payload.silent = false
    }

    if (!payload.silent) {
      dispatch('startWorking', i18n.t('store.getAnnouncements'))
    }

    return AnnouncementsApi.getAnnouncements(payload.limit, (payload.page - 1) * payload.limit)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw 'Retrieving announcements failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.announcements) || !_.isArray(response.data.announcements)) {
          console.error(response)
          throw 'Received invalid announcements'
        }

        commit({
          type: 'setAnnouncements',
          announcements: response.data.announcements,
          total: _.isNil(response.data.total) ? response.data.announcements.length : response.data.total
        })

        if (!payload.silent) {
          dispatch('stopWorking', i18n.t('store.getAnnouncements'))
        }

        commit({
          type: 'refreshingAnnouncements',
          refreshing: false
        })
      }).catch((error) => {
        commit({
          type: 'refreshingAnnouncements',
          refreshing: false
        })

        if (!payload.silent) {
          dispatch('stopWorking', i18n.t('store.getAnnouncements'))
        }

        if (error.response) {
          console.error('getAnnouncements', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getAnnouncements.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'announcements', function: 'getAnnouncements' } }) : null
          console.error('getAnnouncements', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getAnnouncements.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'announcements', function: 'getAnnouncements' } }) : null
          console.error('getAnnouncements', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getAnnouncements.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  paginateAnnouncements( { commit }, payload) {
    commit({
      type: 'setAnnouncementsPage',
      page: payload.page
    })
  },
  setAnnouncementDetails({ commit }, payload) {
    commit({
      type: 'setAnnouncementDetails',
      announcementDetails: payload
    })
  }
}

const mutations = {
  clearAnnouncementDetails(state) {
    state.announcementDetails = null
  },
  clearAnnouncements(state) {
    state.announcements = null
    state.announcementsPage = 1
    state.refreshingAnnouncements = false
    state.totalAnnouncements = 0
  },
  refreshingAnnouncements(state, payload) {
    state.refreshingAnnouncements = payload.refreshing
  },
  setAnnouncementDetails(state, payload) {
    state.announcementDetails = payload.announcementDetails
  },
  setAnnouncements(state, payload) {
    state.announcements = payload.announcements
    state.totalAnnouncements = payload.total
  },
  setAnnouncementsPage(state, payload) {
    state.announcementsPage = payload.page
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
