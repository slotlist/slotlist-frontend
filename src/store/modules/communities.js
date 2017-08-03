import * as _ from 'lodash'

import CommunitiesApi from '../../api/communities'

const state = {
  working: null,
  communities: null
}

const getters = {
  working() {
    return state.working
  },
  communities() {
    return state.communities
  }
}

const actions = {
  getCommunities({ commit, dispatch, state }) {
    commit({
      type: 'working',
      active: true,
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
          type: 'working',
          active: false
        })
      }).catch((error) => {
        commit({
          type: 'working',
          active: false
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
  }
}

const mutations = {
  working(state, payload) {
    if (!payload.active) {
      state.working = null
      return
    }

    state.working = _.isString(payload.message) && !_.isEmpty(payload.message) ? payload.message : 'Doing <em>something</em>...'
  },
  setCommunities(state, payload) {
    state.communities = payload.communities
    state.communityOffset = payload.offset
  },
  clearCommunities(state) {
    state.communities = null
    state.communityOffset = 0
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
