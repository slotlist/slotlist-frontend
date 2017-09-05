<template>
  <div>
    <div v-show="!performingLogin">
      <div class="jumbotron">
        <h1 class="display-3">Sign in using Steam</h1>
        <p class="lead">
          <router-link to="/">slotlist.info</router-link> uses Steam OpenID authentication. This allows you to use your existing Steam account to log into our site.
        </p>
        <hr class="my-4">
        <p>
          The site will not be able to read or store your Steam login credentials or perform any action regarding your Steam account.
          <br> We will only receive your SteamID as well as some other public information such as your username.
          <br> The information provided by Steam will be used to create a unique user in our backend for you, allowing you to use all features on
          <router-link to="/">slotlist.info</router-link>.
          <br> More information regarding the privacy policy of this site can be found
          <router-link to="/privacy">here</router-link>.
        </p>
        <p v-if="loginRedirectUrl" class="lead text-center">
          <a :href="loginRedirectUrl">
            <img src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_01.png" alt="Sign in through Steam" title="Yes, this login banner looks atrocious, unfortunately Valve forces us to use it >.< Anyways, click to sign in through Steam">
          </a>
        </p>
      </div>
    </div>
    <div v-show="performingLogin">
      <loading-overlay message="Logging in..."></loading-overlay>
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash'

import utils from '../utils'

export default {
  computed: {
    loginRedirectUrl() {
      return this.$store.getters.loginRedirectUrl
    },
    performingLogin() {
      return this.$store.getters.performingLogin
    }
  },
  beforeCreate: function() {
    this.$store.dispatch('getLoginRedirectUrl')

    if (_.has(this.$route.query, 'openid.claimed_id')) {
      const url = process.env.BASE_URL + this.$route.fullPath
      this.$store.dispatch('performLogin', url)
    }
  },
  created: function() {
    utils.setTitle(this.$t('nav.login'))
  }
}
</script>
