<template>
  <div>
    <login-de v-if="$i18n.locale === 'de' || $i18n.locale === 'de-at'"></login-de>
    <login-en v-else></login-en>
  </div>
</template>

<script>
import LoginDe from '../i18n/views/Login.de.vue'
import LoginEn from '../i18n/views/Login.en.vue'
import * as _ from 'lodash'

import utils from '../utils'

export default {
  components: {
    LoginDe,
    LoginEn
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
