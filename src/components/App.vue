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
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/missions">Missions</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/communities">Communities</router-link>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item" v-if="!loggedIn">
            <router-link class="nav-link text-primary" to="/login">Login</router-link>
          </li>
          <li class="nav-item" v-if="loggedIn">
            <router-link class="nav-link" to="/account">Account</router-link>
          </li>
          <li class="nav-item" v-if="loggedIn">
            <router-link class="nav-link text-danger" to="/" @click.native="logout">Logout</router-link>
          </li>
          <li class="nav-item" v-if="$acl.can(['admin.panel'], true)">
            <router-link class="nav-link text-warning" to="/admin">Admin Panel</router-link>
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
      </div>
    </template>
    <footer class="footer">
      <div class="container">
        <div class="row">
          <div class="col">
            <span class="text-muted small float-left">
              Copyright &copy; {{ year }}
              <router-link to="/">slotlist.info</router-link>. All rights reserved.
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
              <router-link to="/about">About</router-link> |
              <router-link to="/privacy">Privacy</router-link> |
              <router-link to="/api">API</router-link> |
              <a href="https://github.com/MorpheusXAUT/slotlist-frontend">Frontend</a> |
              <a href="https://github.com/MorpheusXAUT/slotlist-backend">Backend</a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import * as _ from 'lodash'

import utils from '../utils'

export default {
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    year() {
      return new Date().getFullYear()
    },
    showAlert() {
      return this.$store.getters.showAlert
    },
    alertVariant() {
      return this.$store.getters.alertVariant
    },
    alertDismissible() {
      return this.$store.getters.alertDismissible
    },
    alertMessage() {
      return this.$store.getters.alertMessage
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('performLogout')
        .then(() => {
          this.$router.push({ path: '/', query: { logout: true } })
        })
    },
    alertDismissed() {
      this.$store.dispatch('clearAlert')
    },
    alertDismissCountDown(val) {
      if (val === 1) {
        console.info('This is gonna look ugly...')
        this.$store.dispatch('clearAlert')
      }
    }
  },
  beforeCreate: function () {
    const token = this.$ls.get('auth-token')
    if (!_.isNil(token)) {
      this.$store.dispatch("setTokenFromLocalStorage", token)
    }
  },
  created: function () {
    utils.clearTitle()
  },
}
</script>

<style>
html {
  position: relative;
  min-height: 100%;
}

body {
  /* Margin bottom by footer height plus extra spacing */
  margin-bottom: 75px;
}

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  /* Set fixed height of footer */
  height: 60px;
  line-height: 60px;
  background-color: #f5f5f5;
}

.footer>.container {
  padding-right: 15px;
  padding-left: 15px;
}
</style>
