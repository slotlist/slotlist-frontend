import axios from 'axios'
import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from './components/App'
import router from './router'
import store from './store'
import VueLocalStorage from 'vue-ls'
import VueSimpleSpinner from 'vue-simple-spinner'

axios.defaults.baseURL = process.env.BASE_API_URL

sync(store, router)

Vue.use(VueLocalStorage, {
  namespace: 'sl__'
})

Vue.component('spinner', VueSimpleSpinner)

const app = new Vue({
  router,
  store,
  ...App
})

export { app, router, store }
