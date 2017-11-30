import Vue from 'vue'
import Vuex from 'vuex'

import alert from './modules/alert'
import auth from './modules/auth'
import communities from './modules/communities'
import missions from './modules/missions'
import missionSlotTemplates from './modules/missionSlotTemplates'
import notifications from './modules/notifications'
import users from './modules/users'
import util from './modules/util'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    alert,
    auth,
    communities,
    missions,
    missionSlotTemplates,
    notifications,
    users,
    util
  }
})

export default store
