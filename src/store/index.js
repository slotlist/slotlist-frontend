import Vue from 'vue'
import Vuex from 'vuex'

import alert from './modules/alert'
import auth from './modules/auth'
import communities from './modules/communities'
import missions from './modules/missions'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    alert,
    auth,
    communities,
    missions
  }
})

export default store
