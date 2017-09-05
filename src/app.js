import * as _ from 'lodash'
import moment from 'moment'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/css/bootstrap.min.css'
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
import VueClickConfirm from 'click-confirm'
import VuePaginate from 'vuejs-paginate'
import VueI18n from 'vue-i18n'
import LoadingOverlay from './components/LoadingOverlay.vue'

// Black-require API/axios utils
require('./api/util')

// Blank-require mock adapter so it gets loaded in dev environment
require('./api/mock')

if (process.env.SENTRY_DSN) {
  console.info('Configuring sentry.io integration')
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

Vue.use(VueI18n)

Vue.component('click-confirm', VueClickConfirm)
Vue.component('spinner', VueSimpleSpinner)
Vue.component('loading-overlay', LoadingOverlay)
Vue.component('paginate', VuePaginate)

const i18n = new VueI18n({
  fallbackLocale: 'en',
  locale: 'en',
  messages: {
    de: require('./i18n/de.json'),
    en: require('./i18n/en.json')
  }
})

Vue.mixin({
  computed: {
    locale() {
      this.$store.getters.locale
    }
  },
  methods: {
    formatDateTime: (dateTime) => moment(dateTime).format('Y-MM-DD HH:mm'),
    formatUserWithTag: (user) => _.isNil(user.community) ? user.nickname : `[${user.community.tag}] ${user.nickname}`
  },
  watch: {
    locale() {
      this.$i18n.locale = this.locale
    }
  }
})

const app = new Vue({
  router,
  store,
  i18n,
  ...App
})

export { app, router, store, i18n }
