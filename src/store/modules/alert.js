import * as _ from 'lodash'

const state = {
  showAlert: false,
  alertVariant: 'info',
  alertDismissible: true,
  alertMessage: null
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
  }
}

const actions = {
  showAlert({ commit }, payload) {
    if (_.isNil(payload.showAlert)) {
      console.log('Showing alert without showAlert doesn\'t make much sense...')
      return
    }
    if (_.isNil(payload.alertMessage)) {
      console.log('Showing alert without alertMessage doesn\'t make much sense...')
      return
    }

    if (_.isNil(payload.alertVariant)) {
      payload.alertVariant = 'info'
    }
    if (_.isNil(payload.alertDismissible)) {
      payload.alertDismissible = true
    }

    commit({
      type: 'showAlert',
      showAlert: payload.showAlert,
      alertVariant: payload.alertVariant,
      alertDismissible: payload.alertDismissible,
      alertMessage: payload.alertMessage
    })

    window.scrollTo(0, 0)
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
  },
  clearAlert(state) {
    state.showAlert = false
    state.alertVariant = 'info'
    state.alertDismissible = true
    state.alertMessage = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
