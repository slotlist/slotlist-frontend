import { i18n } from '../../app'
import * as _ from 'lodash'
import utils from '../../utils'
import router from '../../router'
import Raven from 'raven-js'

import UsersApi from '../../api/users'

const limits = {
  userMissions: 10,
  users: 10
}

const intervals = {
  usersRefresh: 300000
}

const state = {
  refreshingUsers: false,
  searchingUsers: false,
  totalUserMissions: 0,
  totalUsers: 0,
  userDetails: null,
  userMissions: null,
  users: null,
  usersRefreshSetInterval: null
}

const getters = {
  searchingUsers() {
    return state.searchingUsers
  },
  userDetails() {
    return state.userDetails
  },
  userMissions() {
    return state.userMissions
  },
  userMissionsPageCount() {
    return Math.ceil(state.totalUserMissions / limits.users)
  },
  users() {
    return state.users
  },
  usersPageCount() {
    return Math.ceil(state.totalUsers / limits.users)
  },
  refreshingUsers() {
    return state.refreshingUsers
  }
}

const actions = {
  clearUserDetails({ commit }) {
    commit({
      type: 'clearUserDetails'
    })
  },
  deleteUser({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.deleteUser'))

    return UsersApi.deleteUser(payload.userUid)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Deleting user failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (response.data.success !== true) {
          console.error(response)
          throw 'Received invalid user deletion'
        }

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.deleteUser.success')}`,
          persistentAlert: true
        })

        router.push({ name: 'home' })

        dispatch('stopWorking', i18n.t('store.deleteUser'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.deleteUser'))

        if (error.response) {
          console.error('deleteUser', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteUser.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'users', function: 'deleteUser' } }) : null
          console.error('deleteUser', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteUser.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'users', function: 'deleteUser' } }) : null
          console.error('deleteUser', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteUser.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  editUser({ commit, dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.editUser'))

    return UsersApi.editUser(payload.userUid, payload.updatedUserDetails)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Updating user details failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (_.isNil(response.data.user) || !_.isObject(response.data.user)) {
          console.error(response)
          throw "Received invalid user"
        }

        commit({
          type: 'setUserDetails',
          userDetails: response.data.user
        })

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.editUser.success')}`
        })

        dispatch('stopWorking', i18n.t('store.editUser'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.editUser'))

        if (error.response) {
          console.error('editUser', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editUser.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'users', function: 'editUser' } }) : null
          console.error('editUser', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editUser.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'users', function: 'editUser' } }) : null
          console.error('editUser', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editUser.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  getUserDetails({ commit, dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.getUserDetails'))

    return UsersApi.getUserDetails(payload)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Retrieving user details failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (_.isNil(response.data.user) || !_.isObject(response.data.user)) {
          console.error(response)
          throw "Received invalid user"
        }

        commit({
          type: 'setUserDetails',
          userDetails: response.data.user
        })

        dispatch('stopWorking', i18n.t('store.getUserDetails'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.getUserDetails'))

        if (error.response) {
          console.error('getUserDetails', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getUserDetails.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'users', function: 'getUserDetails' } }) : null
          console.error('getUserDetails', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getUserDetails.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'users', function: 'getUserDetails' } }) : null
          console.error('getUserDetails', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getUserDetails.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  getUsers({ commit, dispatch, state }, payload) {
    commit({
      type: 'refreshingUsers',
      refreshing: true
    })

    if (_.isNil(payload)) {
      payload = { page: 1, limit: limits.users, silent: false, autoRefresh: false }
    }
    if (_.isNil(payload.page)) {
      payload.page = 1
    }
    if (_.isNil(payload.limit)) {
      payload.limit = limits.users
    }
    if (_.isNil(payload.silent)) {
      payload.silent = false
    }
    if (_.isNil(payload.autoRefresh)) {
      payload.autoRefresh = false
    }

    if (!payload.silent) {
      dispatch('startWorking', i18n.t('store.getUsers'))
    }

    return UsersApi.getUsers(payload.limit, (payload.page - 1) * payload.limit)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw 'Retrieving users failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.users) || !_.isArray(response.data.users)) {
          console.error(response)
          throw 'Received invalid users'
        }

        commit({
          type: 'setUsers',
          users: response.data.users,
          total: response.data.total
        })

        if (!payload.silent) {
          dispatch('stopWorking', i18n.t('store.getUsers'))
        }

        commit({
          type: 'refreshingUsers',
          refreshing: false
        })

        if (payload.autoRefresh) {
          if (!_.isNil(state.usersRefreshSetInterval)) {
            clearInterval(state.usersRefreshSetInterval)
          }

          state.usersRefreshSetInterval = setInterval(() => {
            dispatch('getUsers', { silent: true })
          }, intervals.usersRefresh)
        }
      }).catch((error) => {
        commit({
          type: 'refreshingUsers',
          refreshing: false
        })

        if (!payload.silent) {
          dispatch('stopWorking', i18n.t('store.getUsers'))
        }

        if (error.response) {
          console.error('getUsers', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getUsers.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'users', function: 'getUsers' } }) : null
          console.error('getUsers', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getUsers.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'users', function: 'getUsers' } }) : null
          console.error('getUsers', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getUsers.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  getUserMissions({ commit, dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.getUserMissions'))

    if (_.isNil(payload.page)) {
      payload.page = 1
    }

    // TODO remove default value once filter has been implemented
    const includeEnded = false

    return UsersApi.getUserMissions(payload.userUid, limits.userMissions, (payload.page - 1) * limits.userMissions, includeEnded)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Retrieving user missions failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (_.isNil(response.data.missions) || !_.isArray(response.data.missions)) {
          console.error(response)
          throw "Received invalid user missions"
        }

        commit({
          type: 'setUserMissions',
          userMissions: response.data.missions,
          total: response.data.total
        })

        dispatch('stopWorking', i18n.t('store.getUserMissions'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.getUserMissions'))

        if (error.response) {
          console.error('getUserMissions', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getUserMissions.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'users', function: 'getUserMissions' } }) : null
          console.error('getUserMissions', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getUserMissions.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'users', function: 'getUserMissions' } }) : null
          console.error('getUserMissions', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getUserMissions.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  searchUsers({ dispatch, commit }, payload) {
    commit({
      type: 'searchingUsers',
      searching: true
    })

    return UsersApi.searchUsers(payload)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Searching users failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (_.isNil(response.data.users) || !_.isArray(response.data.users)) {
          console.error(response)
          throw "Received invalid users"
        }

        commit({
          type: 'searchingUsers',
          searching: false
        })

        const users = _.map(response.data.users, (user) => {
          return {
            title: _.isNil(user.community) ? user.nickname : `[${user.community.tag}] ${user.nickname}`,
            value: user
          }
        })

        return users
      }).catch((error) => {
        commit({
          type: 'searchingUsers',
          searching: false
        })

        if (error.response) {
          console.error('searchUsers', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.searchUsers.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'users', function: 'searchUsers' } }) : null
          console.error('searchUsers', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.searchUsers.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          error.message !== "Network Error" ? Raven.captureException(error, { extra: { module: 'users', function: 'searchUsers' } }) : null
          console.error('searchUsers', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.searchUsers.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  }
}

const mutations = {
  clearUserDetails(state) {
    state.totalUserMissions = 0
    state.userDetails = null
    state.userMissions = null
  },
  refreshingUsers(state, payload) {
    state.refreshingUsers = payload.refreshing
  },
  searchingUsers(state, payload) {
    state.searchingUsers = payload.searching
  },
  setUserDetails(state, payload) {
    state.userDetails = payload.userDetails

    utils.setTitle(`${i18n.t('user')} ${state.userDetails.nickname}`)
  },
  setUserMissions(state, payload) {
    state.userMissions = payload.userMissions
    state.totalUserMissions = payload.total
  },
  setUsers(state, payload) {
    state.users = payload.users
    state.totalUsers = payload.total
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
