import * as _ from 'lodash'
import utils from '../../utils'

import UsersApi from '../../api/users'

const state = {
  userDetails: null,
  userMissions: null
}

const getters = {
  userDetails() {
    return state.userDetails
  },
  userMissions() {
    return state.userMissions
  }
}

const actions = {
  clearUserDetails({ commit }) {
    commit({
      type: 'clearUserDetails'
    })
  },
  getUserDetails({ commit, dispatch }, payload) {
    commit({
      type: 'startWorking',
      message: 'Loading user details...'
    })

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

        commit({
          type: 'stopWorking'
        })
      }).catch((error) => {
        commit({
          type: 'stopWorking'
        })

        if (error.response) {
          console.error('getUserDetails', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load user details - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('getUserDetails', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load user details - Request failed`
          })
        } else {
          console.error('getUserDetails', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load user details - Something failed...`
          })
        }
      })
  },
  getUserMissions({ commit, dispatch }, payload) {
    commit({
      type: 'startWorking',
      message: 'Loading user missions...'
    })

    return UsersApi.getUserMissions(payload)
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
          userMissions: response.data.missions
        })

        commit({
          type: 'stopWorking'
        })
      }).catch((error) => {
        commit({
          type: 'stopWorking'
        })

        if (error.response) {
          console.error('getUserMissions', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load user missions - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('getUserMissions', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load user missions - Request failed`
          })
        } else {
          console.error('getUserMissions', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load user missions - Something failed...`
          })
        }
      })
  }
}

const mutations = {
  clearUserDetails(state) {
    state.userDetails = null
    state.userMissions = null
  },
  setUserDetails(state, payload) {
    state.userDetails = payload.userDetails
    state.userMissions = payload.userDetails.missions

    utils.setTitle(`User ${state.userDetails.nickname}`)
  },
  setUserMissions(state, payload) {
    state.userMissions = payload.userMissions
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
