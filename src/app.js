import * as _ from 'lodash'
import moment from 'moment'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/css/bootstrap.css'
import { sync } from 'vuex-router-sync'
import App from './components/App'
import router from './router'
import store from './store'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import VueACL from './plugins/acl'
import VueLocalStorage from 'vue-ls'
import VueQuillEditor from 'vue-quill-editor'
import VueSimpleSpinner from 'vue-simple-spinner'
import LoadingOverlay from './components/LoadingOverlay.vue'

// Black-require API/axios utils
require('./api/util')

// Blank-require mock adapter so it gets loaded in dev environment
require('./api/mock')

if (process.env.SENTRY_DSN) {
  Raven
    .config(process.env.SENTRY_DSN)
    .addPlugin(RavenVue, Vue)
    .install()
}

sync(store, router)

Vue.use(BootstrapVue)

Vue.use(VueACL, {
  router
})

Vue.use(VueLocalStorage, {
  namespace: 'sl__'
})

Vue.use(VueQuillEditor)

Vue.component('spinner', VueSimpleSpinner)
Vue.component('loading-overlay', LoadingOverlay)

Vue.mixin({
  methods: {
    formatDateTime: dateTime => moment(dateTime).format('Y-MM-DD HH:mm'),
    formatUserWithTag: user => _.isNil(user.community) ? user.nickname : `[${user.community.tag}] ${user.nickname}`
  }
})

const app = new Vue({
  router,
  store,
  ...App
})

export { app, router, store }
