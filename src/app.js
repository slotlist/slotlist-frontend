import axios from 'axios'
import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from './components/App'
import router from './router'
import store from './store'

axios.defaults.baseURL = process.env.BASE_API_URL
console.log(process.env.BASE_API_URL)

sync(store, router)

const app = new Vue({
  router,
  store,
  ...App
})

export { app, router, store }
