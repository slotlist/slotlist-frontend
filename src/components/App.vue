<template>
  <div id="app">
    <nav class="navbar navbar-toggleable-md navbar-light bg-faded mb-3">
      <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <router-link class="navbar-brand" :to="{name:'home'}">slotlist.info</router-link>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link class="nav-link" :to="{name:'home'}">
              <i class="fa fa-home" aria-hidden="true"></i> {{ $t('nav.home') }}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{name:'missionList'}">
              <i class="fa fa-tasks" aria-hidden="true"></i> {{ $t('nav.missions') }}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{name:'missionSlotTemplateList'}">
              <i class="fa fa-file-text-o" aria-hidden="true"></i> {{ $t('nav.missionSlotTemplates') }}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{name:'communityList'}">
              <i class="fa fa-users" aria-hidden="true"></i> {{ $t('nav.communities') }}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{name:'userList'}">
              <i class="fa fa-user" aria-hidden="true"></i> {{ $t('nav.users') }}
            </router-link>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item" v-if="loggedIn">
            <router-link class="nav-link" :class="{'text-danger': unseenNotificationCount > 0, 'font-weight-bold': unseenNotificationCount > 0}" :to="{name:'notificationList'}">
              <i class="fa fa-bell" aria-hidden="true"></i> {{ unseenNotificationCount }} {{ $t('nav.notifications') }}
            </router-link>
          </li>
          <li class="nav-item" v-if="loggedIn">
            <router-link class="nav-link" :to="{name:'account'}">
              <i class="fa fa-user" aria-hidden="true"></i> {{ $t('nav.account') }}
            </router-link>
          </li>
          <li class="nav-item" v-if="!loggedIn">
            <router-link class="nav-link text-primary" :to="{name:'login'}">
              <i class="fa fa-sign-in" aria-hidden="true"></i> {{ $t('nav.login') }}
            </router-link>
          </li>
          <li class="nav-item" v-if="loggedIn">
            <router-link class="nav-link text-danger" :to="{name:'home'}" @click.native="logout">
              <i class="fa fa-sign-out" aria-hidden="true"></i> {{ $t('nav.logout') }}
            </router-link>
          </li>
          <li class="nav-item dropdown">
            <a id="navbarLanguageDropdown" class="nav-link dropdown-toggle text-muted" href="#" data-toggle="dropdown" aria-expanded="false" v-html="selectedLanguage"></a>
            <div class="dropdown-menu" aria-labelledby="navbarLanguageDropdown">
              <a class="dropdown-item text-muted" href="#" @click.prevent="setLocale('en')"><img src="/img/flags/gb.png"> English</a>
              <a class="dropdown-item text-muted" href="#" @click.prevent="setLocale('de')"><img src="/img/flags/de.png"> Deutsch</a>
              <a class="dropdown-item text-muted" href="#" @click.prevent="setLocale('de-at')"><img src="/img/flags/at.png"> Österreichisch</a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
    <template>
      <div class="container">
        <b-alert :variant="alertVariant" :dismissible="alertDismissible" :show="showAlert" @dismissed="alertDismissed" @dismiss-count-down="alertDismissCountDown">
          <div v-html="alertMessage"></div>
        </b-alert>
        <router-view></router-view>
        <div v-show="working">
          <loading-overlay :message="working"></loading-overlay>
        </div>
      </div>
    </template>
    <footer class="footer">
      <div class="container">
        <div class="row">
          <div class="col">
            <span class="text-muted small float-left">
              Copyright &copy; 2017-{{ year }}
              <router-link to="/">slotlist.info</router-link>. {{ $t('rights.reserved') }}.
            </span>
          </div>
          <div class="col text-center">
            <span class="text-muted small">
              Made with
              <i class="fa fa-heart" aria-hidden="true"></i> by
              <a href="https://github.com/MorpheusXAUT">MorpheusXAUT</a>
            </span>
          </div>
          <div class="col">
            <span class="text-muted small float-right">
              <router-link to="/about">{{ $t('nav.about') }}</router-link> |
              <router-link to="/imprint">{{ $t('nav.imprint') }}</router-link> |
              <router-link to="/privacy">{{ $t('nav.privacy') }}</router-link> |
              <router-link to="/api">{{ $t('nav.api') }}</router-link> |
              <a href="https://github.com/MorpheusXAUT/slotlist-frontend">
                <i class="fa fa-github"></i> Frontend</a> |
              <a href="https://github.com/MorpheusXAUT/slotlist-backend">
                <i class="fa fa-github"></i> Backend</a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import * as _ from 'lodash'
import moment from 'moment-timezone'

import utils from '../utils'
import { pendingRequestCount } from '../api/util'

export default {
  beforeCreate: function() {
    let locale = this.$ls.get('locale')
    if (_.isNil(locale) || !_.isString(locale) || _.isEmpty(locale)) {
      console.info('Locale not defined, retrieving from browser language')

      const userLanguage = navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage;
      locale = userLanguage.split('-')[0].trim()

      if (!_.isString(locale) || _.isEmpty(locale)) {
        console.info('Failed to get user language from browser, falling back to English')
        locale = 'en'
      }
    }

    this.$store.dispatch('setLocale', locale)

    let timezone = this.$ls.get('timezone')
    if (_.isNil(timezone) || !_.isString(timezone) || _.isEmpty(timezone)) {
      console.info('Timezone not defined, guessing from browser settings')

      timezone = moment.tz.guess()

      if (!_.isString(timezone) || _.isEmpty(timezone)) {
        console.info('Failed to get user timezone from browser, falling back to UTC')
        timezone = 'Etc/UTC'
      }
    }

    this.$store.dispatch('setTimezone', timezone)

    const token = this.$ls.get('auth-token')
    if (!_.isNil(token)) {
      this.$store.dispatch('setTokenFromLocalStorage', token)
        .then(() => {
          // need to check for token again since an expired token is cleared during the `setTokenFromLocalStorage` action,
          // leading to an instant authentication error if the users loads the app after the token expired
          if (!_.isNil(this.$ls.get('auth-token'))) {
            const lastRefreshedAt = this.$ls.get('auth-token-last-refreshed')
            if (_.isNil(lastRefreshedAt) || moment(lastRefreshedAt) <= moment().subtract(1, 'hour')) {
              this.performInitialTokenRefresh()
            }

            if (!this.$store.getters.pollingUnseenNotifications) {
              this.$store.dispatch('getUnseenNotificationCount', { autoRefresh: true })
            }
          }
        })
    }
  },
  created: function() {
    utils.clearTitle()
  },
  beforeDestroy: function() {
    this.dispatch('clearMissions')
  },
  data() {
    return {
      initialTokenRefresh: true
    }
  },
  computed: {
    alertDismissible() {
      return this.$store.getters.alertDismissible
    },
    alertMessage() {
      return this.$store.getters.alertMessage
    },
    alertVariant() {
      return this.$store.getters.alertVariant
    },
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    selectedLanguage() {
      const locale = this.$i18n.locale

      switch (locale) {
        case 'en': return '<img src="/img/flags/gb.png"> English'
        case 'de': return '<img src="/img/flags/de.png"> Deutsch'
        case 'de-at': return '<img src="/img/flags/at.png"> Österreichisch'
        default: return '<i class="fa fa-language" aria-hidden="true"> Language'
      }
    },
    showAlert() {
      return this.$store.getters.showAlert
    },
    unseenNotificationCount() {
      return this.$store.getters.unseenNotificationCount
    },
    working() {
      return this.$store.getters.working
    },
    year() {
      return new Date().getFullYear()
    }
  },
  methods: {
    alertDismissCountDown(val) {
      if (val === 1) {
        console.info('This is gonna look ugly...')
        this.$store.dispatch('clearAlert')
      }
    },
    alertDismissed() {
      this.$store.dispatch('clearAlert')
    },
    logout() {
      this.$store.dispatch('performLogout')
        .then(() => {
          this.$router.push({ path: '/', query: { logout: true } })
        })
    },
    performInitialTokenRefresh() {
      if (this.initialTokenRefresh) {
        if (pendingRequestCount() > 0) {
          setTimeout(this.performInitialTokenRefresh, 5000)
          return
        }

        this.initialTokenRefresh = false

        this.$store.dispatch('refreshToken', { silent: true })
      }
    },
    setLocale(locale) {
      this.$store.dispatch('setLocale', locale)
    }
  }
}
</script>
