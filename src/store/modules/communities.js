import * as _ from 'lodash'
import utils from '../../utils'
import router from '../../router'

import CommunitiesApi from '../../api/communities'

const communityListLimit = 10

const state = {
  checkingCommunitySlugAvalability: false,
  communities: null,
  communityApplications: null,
  communityDetails: null,
  communityMembers: null,
  communityMissions: null,
  communitySlugAvailable: false,
  totalCommunities: 0
}

const getters = {
  checkingCommunitySlugAvalability() {
    return state.checkingCommunitySlugAvalability
  },
  communities() {
    return state.communities
  },
  communityApplications() {
    return state.communityApplications
  },
  communityDetails() {
    return state.communityDetails
  },
  communityListPageCount() {
    return Math.ceil(state.totalCommunities / communityListLimit)
  },
  communityMembers() {
    if (!_.isNil(state.communityMembers)) {
      return state.communityMembers
    }

    if (_.isNil(state.communityDetails)) {
      return null
    }
    if (!_.isArray(state.communityDetails.members) || !_.isArray(state.communityDetails.leaders)) {
      return null
    }

    const members = []
    _.each(state.communityDetails.leaders, (leader) => {
      members.push(_.defaults(leader, { leader: true }))
    })
    _.each(state.communityDetails.members, (member) => {
      members.push(member)
    })

    state.communityMembers = _.sortBy(members, [(m) => m.nickname.toUpperCase()])

    return state.communityMembers
  },
  communityMissions() {
    return state.communityMissions
  },
  communitySlugAvailable() {
    return state.communitySlugAvailable
  }
}

const actions = {
  applyToCommunity({ commit, dispatch }, payload) {
    commit({
      type: 'startWorking',
      message: 'Applying to community...'
    })

    return CommunitiesApi.applyToCommunity(payload)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Processing community application failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (response.data.status !== "submitted") {
          console.error(response)
          throw "Received invalid community application status"
        }

        commit({
          type: 'stopWorking'
        })

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully applied to community`
        })
      }).catch((error) => {
        commit({
          type: 'stopWorking'
        })

        if (error.response) {
          console.error('applyToCommunity', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to apply to community - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('applyToCommunity', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to apply to community - Request failed`
          })
        } else {
          console.error('applyToCommunity', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to apply to community - Something failed...`
          })
        }
      })
  },
  checkCommunitySlugAvailability({ commit, dispatch }, payload) {
    commit({
      type: 'startCheckingCommunitySlugAvailability'
    })

    return CommunitiesApi.checkCommunitySlugAvailability(payload)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw "Checking community slug availability failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (_.isNil(response.data.available)) {
          console.error(response)
          throw "Received invalid community slug availability status"
        }

        commit({
          type: 'setCommunitySlugAvailability',
          available: response.data.available
        })
      }).catch((error) => {
        commit({
          type: 'setCommunitySlugAvailability',
          available: false
        })

        if (error.response) {
          console.error('checkingCommunitySlugAvalability', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to check availability of community slug <strong>${payload}</strong> - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('checkingCommunitySlugAvalability', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to check availability of community slug <strong>${payload}</strong> - Request failed`
          })
        } else {
          console.error('checkingCommunitySlugAvalability', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to check availability of community slug <strong>${payload}</strong> - Something failed...`
          })
        }
      })
  },
  clearCommunities({ commit }) {
    commit({
      type: 'clearCommunities'
    })
  },
  clearCommunityDetails({ commit }) {
    commit({
      type: 'clearCommunityDetails'
    })
  },
  clearCommunitySlugAvailability({ commit }) {
    commit({
      type: 'clearCommunitySlugAvailability'
    })
  },
  createCommunity({ commit, dispatch }, payload) {
    commit({
      type: 'startWorking',
      message: 'Creating community...'
    })

    return CommunitiesApi.createCommunity(payload)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Creatomg community failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (_.isNil(response.data.community) || !_.isObject(response.data.community)) {
          console.error(response)
          throw "Received invalid community"
        }

        commit({
          type: 'stopWorking',
        })

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully created community`
        })

        router.push({
          name: 'communityDetails',
          params: { communitySlug: response.data.community.slug }
        })
      }).catch((error) => {
        commit({
          type: 'stopWorking'
        })

        if (error.response) {
          console.error('createCommunity', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to create community - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('createCommunity', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to create community - Request failed`
          })
        } else {
          console.error('createCommunity', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to create community - Something failed...`
          })
        }
      })
  },
  deleteCommunity({ commit, dispatch }, payload) {
    commit({
      type: 'startWorking',
      message: 'Deleting community...'
    })

    return CommunitiesApi.deleteCommunity(payload.communitySlug)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Deleting community failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (response.data.success !== true) {
          console.error(response)
          throw "Received invalid community deletion"
        }

        commit({
          type: 'stopWorking',
        })

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully deleted community <strong>${payload.communityName}</strong>`
        })

        router.push({ name: 'communityList' })
      }).catch((error) => {
        commit({
          type: 'stopWorking'
        })

        if (error.response) {
          console.error('deleteCommunity', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to delete community <strong>${payload.communityName}</strong> - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('deleteCommunity', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to delete community <strong>${payload.communityName}</strong> - Request failed`
          })
        } else {
          console.error('deleteCommunity', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to delete community <strong>${payload.communityName}</strong> - Something failed...`
          })
        }
      })
  },
  editCommunity({ commit, dispatch }, payload) {
    commit({
      type: 'startWorking',
      message: 'Updating community details...'
    })

    return CommunitiesApi.editCommunity(payload.communitySlug, payload.updatedCommunityDetails)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Updating community details failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (_.isNil(response.data.community) || !_.isObject(response.data.community)) {
          console.error(response)
          throw "Received invalid community"
        }

        commit({
          type: 'setCommunityDetails',
          communityDetails: response.data.community
        })

        commit({
          type: 'stopWorking',
        })

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully updated community details`
        })
      }).catch((error) => {
        commit({
          type: 'stopWorking'
        })

        if (error.response) {
          console.error('editCommunity', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to update community details - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('editCommunity', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to update community details - Request failed`
          })
        } else {
          console.error('editCommunity', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to update community details - Something failed...`
          })
        }
      })
  },
  getCommunities({ commit, dispatch }, payload) {
    commit({
      type: 'startWorking',
      message: 'Loading communities...'
    })

    if (_.isNil(payload)) {
      payload = { page: 1 }
    } else if (_.isNil(payload.page)) {
      payload.page = 1
    }

    return CommunitiesApi.getCommunities(communityListLimit, (payload.page - 1) * communityListLimit)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Retrieving communities failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (_.isNil(response.data.communities) || !_.isArray(response.data.communities)) {
          console.error(response)
          throw "Received invalid communities"
        }

        commit({
          type: 'setCommunities',
          communities: response.data.communities,
          total: response.data.total
        })

        commit({
          type: 'stopWorking'
        })
      }).catch((error) => {
        commit({
          type: 'stopWorking'
        })

        if (error.response) {
          console.error('getCommunities', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load communities - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('getCommunities', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load communities - Request failed`
          })
        } else {
          console.error('getCommunities', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load communities - Something failed...`
          })
        }
      })
  },
  getCommunityApplications({ commit, dispatch }, payload) {
    commit({
      type: 'startWorking',
      message: 'Loading community applications...'
    })

    return CommunitiesApi.getCommunityApplications(payload)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Retrieving community applications failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (_.isNil(response.data.applications) || !_.isArray(response.data.applications)) {
          console.error(response)
          throw "Received invalid community applications"
        }

        commit({
          type: 'setCommunityApplications',
          communityApplications: response.data.applications
        })

        commit({
          type: 'stopWorking'
        })
      }).catch((error) => {
        commit({
          type: 'stopWorking'
        })

        if (error.response) {
          console.error('getCommunityApplications', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load community applications - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('getCommunityApplications', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load community applications - Request failed`
          })
        } else {
          console.error('getCommunityApplications', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load community applications - Something failed...`
          })
        }
      })
  },
  getCommunityDetails({ commit, dispatch }, payload) {
    commit({
      type: 'startWorking',
      message: 'Loading community details...'
    })

    return CommunitiesApi.getCommunityDetails(payload)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Retrieving community details failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (_.isNil(response.data.community) || !_.isObject(response.data.community)) {
          console.error(response)
          throw "Received invalid community"
        }

        commit({
          type: 'setCommunityDetails',
          communityDetails: response.data.community
        })

        commit({
          type: 'stopWorking'
        })
      }).catch((error) => {
        commit({
          type: 'stopWorking'
        })

        if (error.response) {
          console.error('getCommunityDetails', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load community details - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('getCommunityDetails', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load community details - Request failed`
          })
        } else {
          console.error('getCommunityDetails', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load community details - Something failed...`
          })
        }
      })
  },
  getCommunityMissions({ commit, dispatch }, payload) {
    commit({
      type: 'startWorking',
      message: 'Loading community missions...'
    })

    return CommunitiesApi.getCommunityMissions(payload)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Retrieving community missions failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (_.isNil(response.data.missions) || !_.isArray(response.data.missions)) {
          console.error(response)
          throw "Received invalid community missions"
        }

        commit({
          type: 'setCommunityMissions',
          communityMissions: response.data.missions
        })

        commit({
          type: 'stopWorking'
        })
      }).catch((error) => {
        commit({
          type: 'stopWorking'
        })

        if (error.response) {
          console.error('getCommunityMissions', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load community missions - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('getCommunityMissions', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load community missions - Request failed`
          })
        } else {
          console.error('getCommunityMissions', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load community missions - Something failed...`
          })
        }
      })
  },
  processCommunityApplication({ commit, dispatch }, payload) {
    commit({
      type: 'startWorking',
      message: 'Processing community application...'
    })

    return CommunitiesApi.processCommunityApplication(payload.communitySlug, payload.applicationUid, payload.accepted)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Processing community application failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (_.isNil(response.data.application) || !_.isObject(response.data.application)) {
          console.error(response)
          throw "Received invalid community application"
        }

        dispatch('getCommunityDetails', payload.communitySlug)
        dispatch('getCommunityApplications', payload.communitySlug)

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully ${payload.accepted ? 'accepted' : 'denied'} community application for user <strong>${payload.applicationUserNickname}</strong>`
        })
      }).catch((error) => {
        commit({
          type: 'stopWorking'
        })

        if (error.response) {
          console.error('processCommunityApplication', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to ${payload.accepted ? 'accept' : 'deny'} community application for user <strong>${payload.applicationUserNickname}</strong> - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('processCommunityApplication', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to ${payload.accepted ? 'accept' : 'deny'} community application for user <strong>${payload.applicationUserNickname}</strong> - Request failed`
          })
        } else {
          console.error('processCommunityApplication', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to ${payload.accepted ? 'accept' : 'deny'} community application for user <strong>${payload.applicationUserNickname}</strong> - Something failed...`
          })
        }
      })
  },
  removeCommunityMember({ commit, dispatch }, payload) {
    commit({
      type: 'startWorking',
      message: 'Removing community member...'
    })

    return CommunitiesApi.removeCommunityMember(payload.communitySlug, payload.memberUid)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Removing community member failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (response.data.success !== true) {
          console.error(response)
          throw "Received invalid community member removal"
        }

        dispatch('getCommunityDetails', payload.communitySlug)

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> Successfully removed community member <strong>${payload.memberNickname}</strong>`
        })
      }).catch((error) => {
        commit({
          type: 'stopWorking'
        })

        if (error.response) {
          console.error('removeCommunityMember', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to remove community member <strong>${payload.memberNickname}</strong> - ${error.response.data.message}`
          })
        } else if (error.request) {
          console.error('removeCommunityMember', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load community details <strong>${payload.memberNickname}</strong> - Request failed`
          })
        } else {
          console.error('removeCommunityMember', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Failed to load community details <strong>${payload.memberNickname}</strong> - Something failed...`
          })
        }
      })
  }
}

const mutations = {
  clearCommunities(state) {
    state.communities = null
    state.communityOffset = 0
  },
  clearCommunityDetails(state) {
    state.communityApplications = null
    state.communityDetails = null
    state.communityMembers = null
    state.communityMissions = null
  },
  clearCommunitySlugAvailability(state) {
    state.checkingCommunitySlugAvalability = false
    state.communitySlug = false
  },
  setCommunities(state, payload) {
    state.communities = payload.communities
    state.totalCommunities = payload.total
  },
  setCommunityApplications(state, payload) {
    state.communityApplications = payload.communityApplications
  },
  setCommunityDetails(state, payload) {
    state.communityDetails = payload.communityDetails
    state.communityMembers = null // force community member refresh

    utils.setTitle(`Community ${state.communityDetails.name}`)
  },
  setCommunityMissions(state, payload) {
    state.communityMissions = payload.communityMissions
  },
  setCommunitySlugAvailability(state, payload) {
    state.checkCommunitySlugAvailability = false
    state.communitySlugAvailable = payload.available
  },
  startCheckingCommunitySlugAvailability(state) {
    state.checkingCommunitySlugAvalability = true
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
