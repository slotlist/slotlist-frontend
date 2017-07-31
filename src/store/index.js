import Vue from 'vue'
import Vuex from 'vuex'

import alert from './modules/alert'
import auth from './modules/auth'
import missions from './modules/missions'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    alert,
    auth,
    missions
  }
})

export default store
