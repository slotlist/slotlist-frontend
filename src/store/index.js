import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'
import missions from './modules/missions'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth,
    missions
  }
})

export default store
