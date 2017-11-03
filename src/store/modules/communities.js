import { i18n } from '../../app'
import * as _ from 'lodash'
import utils from '../../utils'
import router from '../../router'
import Raven from 'raven-js'

import CommunitiesApi from '../../api/communities'

const limits = {
  communities: 10,
  communityApplications: 10,
  communityMissions: 10,
  communityPermissions: 10
}

const state = {
  checkingCommunitySlugAvalability: false,
  communities: null,
  communityApplications: null,
  communityApplicationsFilter: {},
  communityApplicationStatus: null,
  communityDetails: null,
  communityMembers: null,
  communityMissions: null,
  communityPermissions: null,
  communitySlugAvailable: false,
  searchingCommunities: false,
  totalCommunities: 0,
  totalCommunityApplications: 0,
  totalCommunityMissions: 0,
  totalCommunityPermissions: 0
}

const getters = {
  checkingCommunitySlugAvalability() {
    return state.checkingCommunitySlugAvalability
  },
  communities() {
    return state.communities
  },
  communityApplications() {
    if (_.isEmpty(_.keys(state.communityApplicationsFilter)) || (_.keys(state.communityApplicationsFilter).length === 1 && _.has(state.communityApplicationsFilter, 'processed'))) {
      return state.communityApplications
    }

    const filteredApplications = []
    _.each(state.communityApplications, (application) => {
      if (_.has(state.communityApplicationsFilter, 'accepted') && application.status === 'accepted') {
        filteredApplications.push(application)
      } else if (_.has(state.communityApplicationsFilter, 'denied') && application.status === 'denied') {
        filteredApplications.push(application)
      }
    })

    return filteredApplications
  },
  communityApplicationsPageCount() {
    return Math.ceil(state.totalCommunityApplications / limits.communityApplications)
  },
  communityApplicationStatus() {
    return state.communityApplicationStatus
  },
  communityDetails() {
    return state.communityDetails
  },
  communityListPageCount() {
    return Math.ceil(state.totalCommunities / limits.communities)
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
  communityMissionsPageCount() {
    return Math.ceil(state.totalCommunityMissions / limits.communityMissions)
  },
  communityPermissions() {
    return state.communityPermissions
  },
  communityPermissionsPageCount() {
    return Math.ceil(state.totalCommunityPermissions / limits.communityPermissions)
  },
  communitySlugAvailable() {
    return state.communitySlugAvailable
  },
  searchingCommunities() {
    return state.searchingCommunities
  }
}

const actions = {
  applyToCommunity({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.applyToCommunity'))

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

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.applyToCommunity.success')}`,
          scrollToTop: true
        })

        dispatch('getCommunityApplicationStatus', payload)

        dispatch('stopWorking', i18n.t('store.applyToCommunity'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.applyToCommunity'))

        if (error.response) {
          console.error('applyToCommunity', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.applyToCommunity.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          Raven.captureException(error, { extra: { module: 'communities', function: 'applyToCommunity' } })
          console.error('applyToCommunity', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.applyToCommunity.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          Raven.captureException(error, { extra: { module: 'communities', function: 'applyToCommunity' } })
          console.error('applyToCommunity', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.applyToCommunity.error')} - ${i18n.t('failed.something')}`
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
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.checkCommunitySlugAvailability.error')} <strong>${payload}</strong> - ${error.response.data.message}`
          })
        } else if (error.request) {
          Raven.captureException(error, { extra: { module: 'communities', function: 'checkCommunitySlugAvailability' } })
          console.error('checkingCommunitySlugAvalability', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.checkCommunitySlugAvailability.error')} <strong>${payload}</strong> - ${i18n.t('failed.request')}`
          })
        } else {
          Raven.captureException(error, { extra: { module: 'communities', function: 'checkCommunitySlugAvailability' } })
          console.error('checkingCommunitySlugAvalability', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.checkCommunitySlugAvailability.error')} <strong>${payload}</strong> - ${i18n.t('failed.something')}`
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
  createCommunity({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.createCommunity'))

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

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.createCommunity.success')}`
        })

        router.push({
          name: 'communityDetails',
          params: { communitySlug: response.data.community.slug }
        })

        dispatch('stopWorking', i18n.t('store.createCommunity'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.createCommunity'))

        if (error.response) {
          console.error('createCommunity', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.createCommunity.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          Raven.captureException(error, { extra: { module: 'communities', function: 'createCommunity' } })
          console.error('createCommunity', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.createCommunity.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          Raven.captureException(error, { extra: { module: 'communities', function: 'createCommunity' } })
          console.error('createCommunity', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.createCommunity.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  createCommunityPermission({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.createCommunityPermission'))

    return CommunitiesApi.createCommunityPermission(payload.communitySlug, payload.permissionDetails)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Creating community permission failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.permission) || !_.isObject(response.data.permission)) {
          console.error(response)
          throw 'Received invalid community permission'
        }

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.createCommunityPermission.success')}`
        })

        dispatch('getCommunityPermissions', { communitySlug: payload.communitySlug })
        dispatch('getCommunityDetails', payload.communitySlug)

        dispatch('stopWorking', i18n.t('store.createCommunityPermission'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.createCommunityPermission'))

        if (error.response) {
          console.error('createCommunityPermission', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.createCommunityPermission.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          Raven.captureException(error, { extra: { module: 'communities', function: 'createCommunityPermission' } })
          console.error('createCommunityPermission', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.createCommunityPermission.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          Raven.captureException(error, { extra: { module: 'communities', function: 'createCommunityPermission' } })
          console.error('createCommunityPermission', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.createCommunityPermission.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  deleteCommunity({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.deleteCommunity'))

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

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.deleteCommunity.success')} <strong>${payload.communityName}</strong>`
        })

        router.push({ name: 'communityList' })

        dispatch('stopWorking', i18n.t('store.deleteCommunity'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.deleteCommunity'))

        if (error.response) {
          console.error('deleteCommunity', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteCommunity.error')} <strong>${payload.communityName}</strong> - ${error.response.data.message}`
          })
        } else if (error.request) {
          Raven.captureException(error, { extra: { module: 'communities', function: 'deleteCommunity' } })
          console.error('deleteCommunity', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteCommunity.error')} <strong>${payload.communityName}</strong> - ${i18n.t('failed.request')}`
          })
        } else {
          Raven.captureException(error, { extra: { module: 'communities', function: 'deleteCommunity' } })
          console.error('deleteCommunity', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteCommunity.error')} <strong>${payload.communityName}</strong> - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  deleteCommunityPermission({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.deleteCommunityPermission'))

    return CommunitiesApi.deleteCommunityPermission(payload.communitySlug, payload.permissionUid)
      .then((response) => {
        if (response.status !== 200) {
          console.error(response)
          throw 'Deleting community permission failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (response.data.success !== true) {
          console.error(response)
          throw 'Received invalid community permission deletion'
        }

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.deleteCommunityPermission.success')}`
        })

        dispatch('getCommunityPermissions', { communitySlug: payload.communitySlug })
        dispatch('getCommunityDetails', payload.communitySlug)

        dispatch('stopWorking', i18n.t('store.deleteCommunityPermission'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.deleteCommunityPermission'))

        if (error.response) {
          console.error('deleteCommunityPermission', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteCommunityPermission.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          Raven.captureException(error, { extra: { module: 'communities', function: 'deleteCommunityPermission' } })
          console.error('deleteCommunityPermission', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteCommunityPermission.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          Raven.captureException(error, { extra: { module: 'communities', function: 'deleteCommunityPermission' } })
          console.error('deleteCommunityPermission', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.deleteCommunityPermission.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  editCommunity({ commit, dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.editCommunity'))

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

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.editCommunity.success')}`
        })

        dispatch('stopWorking', i18n.t('store.editCommunity'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.editCommunity'))

        if (error.response) {
          console.error('editCommunity', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editCommunity.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          Raven.captureException(error, { extra: { module: 'communities', function: 'editCommunity' } })
          console.error('editCommunity', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editCommunity.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          Raven.captureException(error, { extra: { module: 'communities', function: 'editCommunity' } })
          console.error('editCommunity', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.editCommunity.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  filterCommunityApplications({ commit, dispatch, state }, payload) {
    const hadProcessFilter = _.has(state.communityApplicationsFilter, 'processed')

    if (!hadProcessFilter && (_.indexOf(payload.filter, 'accepted') >= 0 || _.indexOf(payload.filter, 'denied') >= 0)) {
      payload.filter.push('processed')
    }

    commit({
      type: 'setCommunityApplicationsFilter',
      communityApplicationsFilter: payload.filter
    })

    const hasProcessFilter = _.has(state.communityApplicationsFilter, 'processed')
    if ((hadProcessFilter && !hasProcessFilter) || (!hadProcessFilter && hasProcessFilter)) {
      dispatch('getCommunityApplications', { communitySlug: payload.communitySlug })
    }
  },
  getCommunities({ commit, dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.getCommunities'))

    if (_.isNil(payload)) {
      payload = { page: 1 }
    } else if (_.isNil(payload.page)) {
      payload.page = 1
    }

    return CommunitiesApi.getCommunities(limits.communities, (payload.page - 1) * limits.communities)
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

        dispatch('stopWorking', i18n.t('store.getCommunities'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.getCommunities'))

        if (error.response) {
          console.error('getCommunities', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getCommunities.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          Raven.captureException(error, { extra: { module: 'communities', function: 'getCommunities' } })
          console.error('getCommunities', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getCommunities.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          Raven.captureException(error, { extra: { module: 'communities', function: 'getCommunities' } })
          console.error('getCommunities', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getCommunities.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  getCommunityApplications({ commit, dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.getCommunityApplications'))

    if (_.isNil(payload.page)) {
      payload.page = 1
    }

    let includeProcessed = _.has(state.communityApplicationsFilter, 'processed')

    return CommunitiesApi.getCommunityApplications(payload.communitySlug, limits.communityApplications, (payload.page - 1) * limits.communityApplications, includeProcessed)
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
          communityApplications: response.data.applications,
          total: response.data.total
        })

        dispatch('stopWorking', i18n.t('store.getCommunityApplications'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.getCommunityApplications'))

        if (error.response) {
          console.error('getCommunityApplications', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getCommunityApplications.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          Raven.captureException(error, { extra: { module: 'communities', function: 'getCommunityApplications' } })
          console.error('getCommunityApplications', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getCommunityApplications.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          Raven.captureException(error, { extra: { module: 'communities', function: 'getCommunityApplications' } })
          console.error('getCommunityApplications', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getCommunityApplications.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  getCommunityApplicationStatus({ commit, dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.getCommunityApplicationStatus'))

    return CommunitiesApi.getCommunityApplicationStatus(payload)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Retrieving community application status failed"
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw "Received empty response"
        }

        if (_.isNil(response.data.application) || !_.isObject(response.data.application)) {
          console.error(response)
          throw "Received invalid community application status"
        }

        commit({
          type: 'setCommunityApplicationStatus',
          application: response.data.application
        })

        dispatch('stopWorking', i18n.t('store.getCommunityApplicationStatus'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.getCommunityApplicationStatus'))

        // Extra check for error response if no application has been sent in
        if (error.response && error.response.status === 404 && error.response.data && error.response.data.message === 'Community application not found') {
          commit({
            type: 'setCommunityApplicationStatus',
            application: null
          })
        } else if (error.response) {
          console.error('getCommunityApplicationStatus', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getCommunityApplicationStatus.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          Raven.captureException(error, { extra: { module: 'communities', function: 'getCommunityApplicationStatus' } })
          console.error('getCommunityApplicationStatus', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getCommunityApplicationStatus.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          Raven.captureException(error, { extra: { module: 'communities', function: 'getCommunityApplicationStatus' } })
          console.error('getCommunityApplicationStatus', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getCommunityApplicationStatus.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  getCommunityDetails({ commit, dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.getCommunityDetails'))

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

        dispatch('stopWorking', i18n.t('store.getCommunityDetails'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.getCommunityDetails'))

        if (error.response) {
          console.error('getCommunityDetails', error.response)

          if (error.response.status === 404) {
            dispatch('showAlert', {
              showAlert: true,
              alertVariant: 'warning',
              alertMessage: `<i class="fa fa-question" aria-hidden="true"></i> ${i18n.t('store.getCommunityDetails.error.notFound', { slug: payload })}`
            })

            return router.push({ name: 'communityList' })
          }

          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getCommunityDetails.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          Raven.captureException(error, { extra: { module: 'communities', function: 'getCommunityDetails' } })
          console.error('getCommunityDetails', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getCommunityDetails.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          Raven.captureException(error, { extra: { module: 'communities', function: 'getCommunityDetails' } })
          console.error('getCommunityDetails', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getCommunityDetails.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  getCommunityMissions({ commit, dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.getCommunityMissions'))

    if (_.isNil(payload.page)) {
      payload.page = 1
    }

    // TODO remove default value once filter has been implemented
    const includeEnded = false

    return CommunitiesApi.getCommunityMissions(payload.communitySlug, limits.communityMissions, (payload.page - 1) * limits.communityMissions, includeEnded)
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
          communityMissions: response.data.missions,
          total: response.data.total
        })

        dispatch('stopWorking', i18n.t('store.getCommunityMissions'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.getCommunityMissions'))

        if (error.response) {
          console.error('getCommunityMissions', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getCommunityMissions.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          Raven.captureException(error, { extra: { module: 'communities', function: 'getCommunityMissions' } })
          console.error('getCommunityMissions', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getCommunityMissions.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          Raven.captureException(error, { extra: { module: 'communities', function: 'getCommunityMissions' } })
          console.error('getCommunityMissions', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getCommunityMissions.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  getCommunityPermissions({ commit, dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.getCommunityPermissions'))

    if (_.isNil(payload.page)) {
      payload.page = 1
    }

    return CommunitiesApi.getCommunityPermissions(payload.communitySlug, limits.communityPermissions, (payload.page - 1) * limits.communityPermissions)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw 'Retrieving community permissions failed'
        }

        if (_.isEmpty(response.data)) {
          console.error(response)
          throw 'Received empty response'
        }

        if (_.isNil(response.data.permissions) || !_.isArray(response.data.permissions)) {
          console.error(response)
          throw 'Received invalid mission permissions'
        }

        commit({
          type: 'setCommunityPermissions',
          permissions: response.data.permissions,
          total: response.data.total
        })

        dispatch('stopWorking', i18n.t('store.getCommunityPermissions'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.getCommunityPermissions'))

        if (error.response) {
          console.error('getCommunityPermissions', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getCommunityPermissions.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          Raven.captureException(error, { extra: { module: 'communities', function: 'getCommunityPermissions' } })
          console.error('getCommunityPermissions', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getCommunityPermissions.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          Raven.captureException(error, { extra: { module: 'communities', function: 'getCommunityPermissions' } })
          console.error('getCommunityPermissions', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.getCommunityPermissions.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  processCommunityApplication({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.processCommunityApplication'))

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
        dispatch('getCommunityApplications', { communitySlug: payload.communitySlug })

        dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'success',
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.processCommunityApplication.success', { action: payload.accepted ? i18n.t('store.processCommunityApplication.accepted') : i18n.t('store.processCommunityApplication.denied'), nickname: payload.applicationUserNickname })}`
        })

        dispatch('stopWorking', i18n.t('store.processCommunityApplication'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.processCommunityApplication'))

        if (error.response) {
          console.error('processCommunityApplication', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.processCommunityApplication.error', { action: payload.accepted ? i18n.t('store.processCommunityApplication.accept') : i18n.t('store.processCommunityApplication.deny'), nickname: payload.applicationUserNickname })} - ${error.response.data.message}`
          })
        } else if (error.request) {
          Raven.captureException(error, { extra: { module: 'communities', function: 'processCommunityApplication' } })
          console.error('processCommunityApplication', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.processCommunityApplication.error', { action: payload.accepted ? i18n.t('store.processCommunityApplication.accept') : i18n.t('store.processCommunityApplication.deny'), nickname: payload.applicationUserNickname })} - ${i18n.t('failed.request')}`
          })
        } else {
          Raven.captureException(error, { extra: { module: 'communities', function: 'processCommunityApplication' } })
          console.error('processCommunityApplication', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.processCommunityApplication.error', { action: payload.accepted ? i18n.t('store.processCommunityApplication.accept') : i18n.t('store.processCommunityApplication.deny'), nickname: payload.applicationUserNickname })} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  removeCommunityMember({ dispatch }, payload) {
    dispatch('startWorking', i18n.t('store.removeCommunityMember'))

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
          alertMessage: `<i class="fa fa-check" aria-hidden="true"></i> ${i18n.t('store.removeCommunityMember.success', { nickname: payload.memberNickname })}</strong>`
        })

        dispatch('stopWorking', i18n.t('store.removeCommunityMember'))
      }).catch((error) => {
        dispatch('stopWorking', i18n.t('store.removeCommunityMember'))

        if (error.response) {
          console.error('removeCommunityMember', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.removeCommunityMember.error', { nickname: payload.memberNickname })} - ${error.response.data.message}`
          })
        } else if (error.request) {
          Raven.captureException(error, { extra: { module: 'communities', function: 'removeCommunityMember' } })
          console.error('removeCommunityMember', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.removeCommunityMember.error', { nickname: payload.memberNickname })} - ${i18n.t('failed.request')}`
          })
        } else {
          Raven.captureException(error, { extra: { module: 'communities', function: 'removeCommunityMember' } })
          console.error('removeCommunityMember', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.removeCommunityMember.error', { nickname: payload.memberNickname })} - ${i18n.t('failed.something')}`
          })
        }
      })
  },
  searchCommunities({ dispatch, commit }, payload) {
    commit({
      type: 'searchingCommunities',
      searching: true
    })

    return CommunitiesApi.searchCommunities(payload)
      .then(function (response) {
        if (response.status !== 200) {
          console.error(response)
          throw "Searching communities failed"
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
          type: 'searchingCommunities',
          searching: false
        })

        const communities = _.map(response.data.communities, (community) => {
          return {
            title: community.name,
            value: community
          }
        })

        return communities
      }).catch((error) => {
        commit({
          type: 'searchingCommunities',
          searching: false
        })

        if (error.response) {
          console.error('searchCommunities', error.response)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.searchCommunities.error')} - ${error.response.data.message}`
          })
        } else if (error.request) {
          Raven.captureException(error, { extra: { module: 'communities', function: 'searchCommunities' } })
          console.error('searchCommunities', error.request)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.searchCommunities.error')} - ${i18n.t('failed.request')}`
          })
        } else {
          Raven.captureException(error, { extra: { module: 'communities', function: 'searchCommunities' } })
          console.error('searchCommunities', error.message)
          dispatch('showAlert', {
            showAlert: true,
            alertVariant: 'danger',
            alertMessage: `<i class="fa fa-bolt" aria-hidden="true"></i> ${i18n.t('store.searchCommunities.error')} - ${i18n.t('failed.something')}`
          })
        }
      })
  }
}

const mutations = {
  clearCommunities(state) {
    state.communities = null
    state.totalCommunities = 0
  },
  clearCommunityDetails(state) {
    state.communityApplications = null
    state.communityDetails = null
    state.communityMembers = null
    state.communityMissions = null
    state.communityPermissions = null
    state.totalCommunityApplications = 0
    state.totalCommunityMissions = 0
    state.totalCommunityPermissions = 0
  },
  clearCommunitySlugAvailability(state) {
    state.checkingCommunitySlugAvalability = false
    state.communitySlug = false
  },
  searchingCommunities(state, payload) {
    state.searchingCommunities = payload.searching
  },
  setCommunities(state, payload) {
    state.communities = payload.communities
    state.totalCommunities = payload.total
  },
  setCommunityApplications(state, payload) {
    state.communityApplications = payload.communityApplications
    state.totalCommunityApplications = payload.total
  },
  setCommunityApplicationsFilter(state, payload) {
    const filter = {}
    _.each(payload.communityApplicationsFilter, (f) => {
      filter[f] = true
    })

    state.communityApplicationsFilter = filter
  },
  setCommunityApplicationStatus(state, payload) {
    state.communityApplicationStatus = payload.application
  },
  setCommunityDetails(state, payload) {
    state.communityDetails = payload.communityDetails
    state.communityMembers = null // force community member refresh

    utils.setTitle(`${i18n.t('mission.community')} ${state.communityDetails.name}`)
  },
  setCommunityMissions(state, payload) {
    state.communityMissions = payload.communityMissions
    state.totalCommunityMissions = payload.total
  },
  setCommunityPermissions(state, payload) {
    state.communityPermissions = payload.permissions
    state.totalCommunityPermissions = payload.total
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
