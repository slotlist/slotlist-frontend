import * as _ from 'lodash'

const state = {
  showAlert: false,
  alertVariant: 'info',
  alertDismissible: true,
  alertMessage: null,
  persistentAlert: false
}

const getters = {
  showAlert() {
    return state.showAlert
  },
  alertVariant() {
    return state.alertVariant
  },
  alertDismissible() {
    return state.alertDismissible
  },
  alertMessage() {
    return state.alertMessage
  },
  persistentAlert() {
    return state.persistentAlert
  }
}

const actions = {
  showAlert({ commit }, payload) {
    if (_.isNil(payload.showAlert)) {
      console.error('Showing alert without showAlert doesn\'t make much sense...')
      return
    }
    if (_.isNil(payload.alertMessage)) {
      console.error('Showing alert without alertMessage doesn\'t make much sense...')
      return
    }

    if (_.isNil(payload.alertVariant)) {
      payload.alertVariant = 'info'
    }
    if (_.isNil(payload.alertDismissible)) {
      payload.alertDismissible = true
    }
    if (_.isNil(payload.scrollToTop)) {
      payload.scrollToTop = false
    }

    commit({
      type: 'showAlert',
      showAlert: payload.showAlert,
      alertVariant: payload.alertVariant,
      alertDismissible: payload.alertDismissible,
      alertMessage: payload.alertMessage,
      persistentAlert: payload.persistentAlert
    })

    if (payload.scrollToTop || payload.alertVariant.toLowerCase() === 'warning' || payload.alertVariant.toLowerCase() === 'danger') {
      window.scrollTo(0, 0)
    }
  },
  clearAlert({ commit }) {
    commit({
      type: 'clearAlert'
    })
  }
}

const mutations = {
  showAlert(state, payload) {
    state.alertVariant = payload.alertVariant
    state.alertDismissible = payload.alertDismissible
    state.alertMessage = payload.alertMessage
    state.showAlert = payload.showAlert
    state.persistentAlert = payload.persistentAlert
  },
  clearAlert(state) {
    state.showAlert = false
    state.alertVariant = 'info'
    state.alertDismissible = true
    state.alertMessage = null
    state.persistentAlert = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
