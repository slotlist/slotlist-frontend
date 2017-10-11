<template>
  <div id="app">
    <nav class="navbar navbar-toggleable-md navbar-light bg-faded mb-3">
      <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <router-link class="navbar-brand" to="/">slotlist.info</router-link>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">
              <i class="fa fa-home" aria-hidden="true"></i> {{ $t('nav.home') }}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/missions">
              <i class="fa fa-tasks" aria-hidden="true"></i> {{ $t('nav.missions') }}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/communities">
              <i class="fa fa-users" aria-hidden="true"></i> {{ $t('nav.communities') }}
            </router-link>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item" v-if="loggedIn">
            <router-link class="nav-link" to="/account">
              <i class="fa fa-user" aria-hidden="true"></i> {{ $t('nav.account') }}
            </router-link>
          </li>
          <li class="nav-item" v-if="!loggedIn">
            <router-link class="nav-link text-primary" to="/login">
              <i class="fa fa-sign-in" aria-hidden="true"></i> {{ $t('nav.login') }}
            </router-link>
          </li>
          <li class="nav-item" v-if="loggedIn">
            <router-link class="nav-link text-danger" to="/" @click.native="logout">
              <i class="fa fa-sign-out" aria-hidden="true"></i> {{ $t('nav.logout') }}
            </router-link>
          </li>
          <li class="nav-item" v-if="$acl.can(['admin.panel'], true)">
            <router-link class="nav-link text-warning" to="/admin">
              <i class="fa fa-server" aria-hidden="true"></i> {{ $t('nav.admin.panel') }}
            </router-link>
          </li>
          <li class="nav-item dropdown">
            <a id="navbarLanguageDropdown" class="nav-link dropdown-toggle text-muted" href="#" data-toggle="dropdown" aria-expanded="false" v-html="selectedLanguage"></a>
            <div class="dropdown-menu" aria-labelledby="navbarLanguageDropdown">
              <a class="dropdown-item text-muted" href="#" @click.prevent="setLocale('en')"><img src="/flags/gb.png"> English</a>
              <a class="dropdown-item text-muted" href="#" @click.prevent="setLocale('de')"><img src="/flags/de.png"> Deutsch</a>
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
              Copyright &copy; {{ year }}
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
          // need to check for token again since an expired token is cleared during the `setTokenFromLocalStorage` action, leading to an instant authentication error
          // if the users loads the app after the token expired
          if (!_.isNil(this.$ls.get('auth-token'))) {
            const lastRefreshedAt = this.$ls.get('auth-token-last-refreshed')
            if (_.isNil(lastRefreshedAt) || moment(lastRefreshedAt) <= moment().subtract(1, 'hour')) {
              this.$store.dispatch('refreshToken', { silent: true })
            }
          }
        })
    }
  },
  created: function() {
    utils.clearTitle()
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
        case 'en': return '<img src="/flags/gb.png"> English'
        case 'de': return '<img src="/flags/de.png"> Deutsch'
        default: return '<i class="fa fa-language" aria-hidden="true"> Language'
      }
    },
    showAlert() {
      return this.$store.getters.showAlert
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
    setLocale(locale) {
      this.$store.dispatch('setLocale', locale)
    }
  }
}
</script>
