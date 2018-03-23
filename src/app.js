import * as _ from 'lodash'
import moment from 'moment-timezone'
import Promise from 'bluebird'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../static/css/app.css'
import '../static/css/arma3.css'
import '../static/css/editors.css'
import '../static/css/popovers.css'
import '../static/css/tables.css'
import { sync } from 'vuex-router-sync'
import App from './components/App'
import router from './router'
import store from './store'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import VueACL from './plugins/acl'
import VueLocalStorage from 'vue-ls'
import VueSimpleSpinner from 'vue-simple-spinner'
import VueClickConfirm from 'click-confirm'
import VuePaginate from 'vuejs-paginate'
import VueI18n from 'vue-i18n'
import VueClipboard from 'vue-clipboard2'
import Typeahead from './components/Typeahead.vue'
import LoadingOverlay from './components/LoadingOverlay.vue'
import EditorExplanation from './components/EditorExplanation.vue'

// Patch Promise globally to use more feature-rich bluebird Promises
Promise.config({
  warnings: false
})

window.Promise = Promise

// Taken from https://stackoverflow.com/a/27081419 on 2018-03-23 15:36
if (typeof localStorage === 'object') {
  try {
    localStorage.setItem('sl__localStorageTest', 1)
    localStorage.removeItem('sl__localStorageTest')

    console.debug('Your web browser supports local storage. Authentication and local preferences will be persisted!')
  } catch (err) {
    Storage.prototype._setItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function() {}

    console.warn('Your web browser does not support local storage. Authentication and local preferences will not be persisted!')
  }
}

// Blank-require API/axios utils
require('./api/util')

if (process.env.SENTRY_DSN) {
  console.info('Configuring sentry.io integration')
  Raven
    .config(process.env.SENTRY_DSN, {
      autoBreadcrumbs: true,
      environment: process.env.NODE_ENV || 'unknown',
      release: process.env.FRONTEND_VERSION || 'unknown'
    }).addPlugin(RavenVue, Vue)
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

import Quill from 'quill'
import ImageResize from 'quill-image-resize-module'

Quill.register('modules/imageResize', ImageResize)
const Link = Quill.import('formats/link')
Link.PROTOCOL_WHITELIST = _.concat(Link.PROTOCOL_WHITELIST, 'ts3server', 'ftp')

import VueQuillEditor from 'vue-quill-editor'

Vue.use(VueQuillEditor)

Vue.use(VueI18n)

Vue.use(VueClipboard)

Vue.component('click-confirm', VueClickConfirm)
Vue.component('spinner', VueSimpleSpinner)
Vue.component('loading-overlay', LoadingOverlay)
Vue.component('paginate', VuePaginate)
Vue.component('typeahead', Typeahead)
Vue.component('editor-explanation', EditorExplanation)

const i18n = new VueI18n({
  fallbackLocale: 'en',
  locale: 'en',
  messages: {
    de: require('./i18n/de.json'),
    'de-at': require('./i18n/de-at.json'),
    en: require('./i18n/en.json')
  }
})

Vue.mixin({
  methods: {
    formatDateTime: (dateTime) => moment(dateTime).format('L LT'),
    formatUserWithTag: (user) => _.isNil(user.community) ? user.nickname : `[${user.community.tag}] ${user.nickname}`
  }
})

const app = new Vue({
  router,
  store,
  i18n,
  ...App
})

export { app, router, store, i18n }
