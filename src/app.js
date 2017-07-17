import axios from 'axios'
import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from './components/App'
import router from './router'
import store from './store'
import VueACL from './plugins/acl'
import VueLocalStorage from 'vue-ls'
import VueQuillEditor from 'vue-quill-editor'
import VueSimpleSpinner from 'vue-simple-spinner'
import VueDatePicker from 'vuejs-datepicker'
import LoadingOverlay from './components/LoadingOverlay.vue'

// Blank-require mock adapter so it gets loaded in dev environment
require('./api/mock')

axios.defaults.baseURL = process.env.BASE_API_URL

sync(store, router)

Vue.use(VueACL, {
  router
})

Vue.use(VueLocalStorage, {
  namespace: 'sl__'
})

Vue.use(VueQuillEditor)

Vue.component('spinner', VueSimpleSpinner)
Vue.component('datepicker', VueDatePicker)
Vue.component('loading-overlay', LoadingOverlay)

const app = new Vue({
  router,
  store,
  ...App
})

export { app, router, store }
