import * as _ from 'lodash'

import CommunitiesApi from '../../api/communities'

const state = {
  communities: null,
  communityDetails: null,
  communityMembers: null
}

const getters = {
  communities() {
    return state.communities
  },
  communityDetails() {
    return state.communityDetails
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
  }
}

const actions = {
  getCommunities({ commit, dispatch, state }) {
    commit({
      type: 'startWorking',
      message: 'Loading communities...'
    })

    return CommunitiesApi.getCommunities(state.communityLimit, state.communityOffset)
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
          offset: response.data.moreAvailable === true ? (response.data.offset + response.data.count) : 0
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
  removeCommunityMember({ commit, dispatch }, payload) {
    commit({
      type: 'startWorking',
      message: `Removing community member...`
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
          alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> Successfully removed community member <strong>${payload.memberNickname}</strong>`
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
  setCommunities(state, payload) {
    state.communities = payload.communities
    state.communityOffset = payload.offset
  },
  clearCommunities(state) {
    state.communities = null
    state.communityOffset = 0
  },
  setCommunityDetails(state, payload) {
    state.communityDetails = payload.communityDetails
    state.communityMembers = null // force community member refresh
  },
  clearCommunityDetails(state) {
    state.communityDetails = null
    state.communityMembers = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
